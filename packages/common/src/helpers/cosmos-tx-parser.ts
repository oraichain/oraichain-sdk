import { Tx as CosmosTx } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { Event, Attribute } from "@cosmjs/tendermint-rpc/build/tendermint37";
import { Tx } from "../tx";
import { JsonObject, fromBinary, wasmTypes } from "@cosmjs/cosmwasm-stargate";
import { Registry, decodeTxRaw } from "@cosmjs/proto-signing";
import {
  defaultRegistryTypes as defaultStargateTypes,
  logs
} from "@cosmjs/stargate";
import { TextProposal } from "cosmjs-types/cosmos/gov/v1beta1/gov";
import { fromAscii } from "@cosmjs/encoding";

export const parseRpcEvents = (events: readonly Event[]): Event[] => {
  return events.map((ev) => ({
    ...ev,
    attributes: ev.attributes.map((attr) => ({
      key: Buffer.from(attr.key, "base64").toString("utf-8"),
      value: Buffer.from(attr.value, "base64").toString("utf-8")
    }))
  }));
};

export const parseTxToMsgExecuteContractMsgs = (
  tx: Tx
): MsgExecuteContract[] => {
  if (tx.code !== 0) return [];
  const cosmosTx = CosmosTx.decode(tx.tx);
  if (!cosmosTx.body) return [];
  const msgs: MsgExecuteContract[] = [];
  for (let i = 0; i < cosmosTx.body.messages.length; i++) {
    const msg = cosmosTx.body.messages[i];
    if (msg.typeUrl === "/cosmwasm.wasm.v1.MsgExecuteContract") {
      const msgExecuteContract = MsgExecuteContract.decode(msg.value);
      // TODO: this is an assumption that the log order is the same as the message order.
      msgs.push({ ...msgExecuteContract });
    }
  }
  return msgs;
};

export const decodeProto = (value: JsonObject) => {
  if (!value) throw "value is not defined";

  const typeUrl = value.type_url || value.typeUrl;
  if (typeUrl) {
    const customRegistry = new Registry([
      ...defaultStargateTypes,
      ...wasmTypes
    ]);
    customRegistry.register("/cosmos.gov.v1beta1.TextProposal", TextProposal);
    // decode proto
    return decodeProto(customRegistry.decode({ typeUrl, value: value.value }));
  }

  for (const k in value) {
    if (typeof value[k] === "string") {
      try {
        value[k] = fromBinary(value[k]);
      } catch {}
    }
    if (typeof value[k] === "object") value[k] = decodeProto(value[k]);
  }
  if (value.msg instanceof Uint8Array)
    value.msg = JSON.parse(fromAscii(value.msg));
  return value;
};

export const parseWasmEvents = (
  events: readonly Event[]
): { [key: string]: string }[] => {
  const wasmEvents = events.filter((e) => e.type.startsWith("wasm"));
  const attrs: { [key: string]: string }[] = [];
  for (const wasmEvent of wasmEvents) {
    let attr: { [key: string]: string };
    for (const { key, value } of wasmEvent.attributes) {
      if (key === "_contract_address") {
        if (attr) attrs.push(attr);
        attr = {};
      }
      attr[key] = value;
    }
    attrs.push(attr);
  }
  return attrs;
};

export const parseTxToMsgsAndEvents = (
  indexedTx: Tx,
  eventsParser?: (events: readonly Event[]) => Attribute[]
) => {
  if (!indexedTx) return [];
  const { rawLog, tx } = indexedTx;
  const { body } = decodeTxRaw(tx);
  const messages = body.messages.map(decodeProto);
  const logs: logs.Log[] = JSON.parse(rawLog);

  return logs.map((log) => {
    const index = log.msg_index ?? 0;
    const attrs = eventsParser
      ? eventsParser(log.events)
      : parseWasmEvents(log.events);
    return { attrs, message: messages[index] };
  });
};
