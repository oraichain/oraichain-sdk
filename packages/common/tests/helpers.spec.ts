import { Event } from "@cosmjs/tendermint-rpc/build/tendermint37";
import {
  calculateTimeoutTimestamp,
  decodeProto,
  ethToTronAddress,
  getEvmAddress,
  isEthAddress,
  parseTxToMsgsAndEvents,
  parseWasmEvents,
  toAmount,
  toDecimal,
  toDisplay,
  tronToEthAddress,
  validateEvmAddress,
  validateNumber,
  validateTronAddress
} from "../src";
import fs, { promises } from "fs";
import path from "path";
import { expect, afterAll, beforeAll, describe, it } from "vitest";
import { ChainInfoReader } from "../src";
import { CustomChainInfo } from "../src/chain-infos/types";

export class ChainInfoReaderImpl implements ChainInfoReader {
  constructor(
    private readonly directory: string = path.join(process.cwd(), "chains")
  ) {}
  async readChainInfos(): Promise<CustomChainInfo[]> {
    const files = await promises.readdir(this.directory);
    const jsonFiles = files.filter((file) => path.extname(file) === ".json");

    const readFilesPromises = jsonFiles.map(async (file) => {
      const filePath = path.join(this.directory, file);
      const data = await promises.readFile(filePath, "utf-8");
      return JSON.parse(data);
    });

    return Promise.all(readFilesPromises);
  }
}

describe("should helper functions in helper run exactly", () => {
  it.each<[string, boolean]>([
    ["0x", false],
    ["orai1g4h64yjt0fvzv5v2j8tyfnpe5kmnetejvfgs7g", false],
    ["0x3C5C6b570C1DA469E8B24A2E8Ed33c278bDA3222", true]
  ])("test-is-eth-address-metamask", (address, expectedIsEthAddress) => {
    const isEth = isEthAddress(address);
    expect(isEth).toEqual(expectedIsEthAddress);
  });

  it("getEvmAddress-happy-path", async () => {
    expect(
      getEvmAddress("oraie1ny7sdlyh7303deyqtzpmnznvyzat2jtyxs3y0v")
    ).toEqual("0x993d06fc97f45f16e4805883b98a6c20bab54964");
    expect(
      ethToTronAddress("0x993d06fc97f45f16e4805883b98a6c20bab54964")
    ).toEqual("TPwTVfDDvmWSawsP7Ki1t3ecSBmaFeMMXc");
    expect(tronToEthAddress("TPwTVfDDvmWSawsP7Ki1t3ecSBmaFeMMXc")).toEqual(
      "0x993d06fc97f45f16e4805883b98a6c20bab54964"
    );
  });

  it("test-getEvmAddress", () => {
    expect(
      getEvmAddress("oraie1ny7sdlyh7303deyqtzpmnznvyzat2jtyxs3y0v")
    ).toEqual("0x993d06fc97f45f16e4805883b98a6c20bab54964");
    expect(() => {
      getEvmAddress("");
    }).toThrow("bech32 address is empty");
    expect(() => {
      getEvmAddress("foobar");
    }).toThrow();
  });
  it("test-ethToTronAddress", () => {
    expect(
      ethToTronAddress("0x993d06fc97f45f16e4805883b98a6c20bab54964")
    ).toEqual("TPwTVfDDvmWSawsP7Ki1t3ecSBmaFeMMXc");
  });
  it("test-tronToEthAddress", () => {
    expect(tronToEthAddress("TPwTVfDDvmWSawsP7Ki1t3ecSBmaFeMMXc")).toEqual(
      "0x993d06fc97f45f16e4805883b98a6c20bab54964"
    );
  });

  describe("validateNumber", () => {
    it("validateNumber-NaN-should-return-zero", async () => {
      const amount = Number.NaN;
      const res = validateNumber(amount);
      expect(res).toBe(0);
    });

    it("validateNumber-infinite-should-return-zero", async () => {
      const amount = Number.POSITIVE_INFINITY;
      const res = validateNumber(amount);
      expect(res).toBe(0);
    });

    it("validateNumber-super-large-number", async () => {
      const amount = 2 * Math.pow(10, 21);
      const res = validateNumber(amount);
      expect(res).toBe(2e21);
    });

    it("validateNumber-happy-path-should-return-amount", async () => {
      const amount = 6;
      const res = validateNumber(amount);
      expect(res).toBe(6);
    });
  });

  describe("toAmount", () => {
    it("toAmount-percent", () => {
      const bondAmount = BigInt(1000);
      const percentValue = (toAmount(0.3, 6) * bondAmount) / BigInt(100000000);
      expect(percentValue.toString()).toBe("3");
    });

    it.each([
      [6000, 18, "6000000000000000000000"],
      [2000000, 18, "2000000000000000000000000"],
      [6000.5043177, 6, "6000504317"],
      [6000.504317725654, 6, "6000504317"],
      [0.0006863532, 6, "686"]
    ])(
      "toAmount number %.7f with decimal %d should return %s",
      (amount: number, decimal: number, expectedAmount: string) => {
        const res = toAmount(amount, decimal).toString();
        expect(res).toBe(expectedAmount);
      }
    );
  });

  describe("toDisplay", () => {
    it.each([
      ["1000", 6, "0.001", 6],
      ["454136345353413531", 15, "454.136345", 6],
      ["454136345353413531", 15, "454.13", 2],
      ["100000000000000", 18, "0.0001", 6]
    ])(
      "toDisplay number %d with decimal %d should return %s",
      (
        amount: string,
        decimal: number,
        expectedAmount: string,
        desDecimal: number
      ) => {
        const res = toDisplay(amount, decimal, desDecimal).toString();
        expect(res).toBe(expectedAmount);
      }
    );
  });

  describe("toDecimal", () => {
    it("toDecimal-happy-path", async () => {
      const numerator = BigInt(6);
      const denominator = BigInt(3);
      const res = toDecimal(numerator, denominator);
      expect(res).toBe(2);
    });

    it("should return 0 when denominator is zero", async () => {
      const numerator = BigInt(123456);
      const denominator = BigInt(0);
      expect(toDecimal(numerator, denominator)).toBe(0);
    });

    it("should correctly convert a fraction into its equivalent decimal value", () => {
      const numerator = BigInt(1);
      const denominator = BigInt(3);

      // Convert the fraction to its decimal value using toDecimal.
      const decimalValue = toDecimal(numerator, denominator);
      // Expect the decimal value to be equal to the expected value.
      expect(decimalValue).toBeCloseTo(0.333333, 6);
    });

    it.each([
      [BigInt(1), BigInt(3), 0.333333, 6],
      [BigInt(1), BigInt(3), 0.3333, 4],
      [BigInt(1), BigInt(2), 0.5, 6]
    ])(
      "should correctly convert a fraction into its equivalent decimal value",
      (numerator, denominator, expectedDecValue, desDecimal) => {
        // Convert the fraction to its decimal value using toDecimal.
        const decimalValue = toDecimal(numerator, denominator);
        // Expect the decimal value to be equal to the expected value.
        expect(decimalValue).toBeCloseTo(expectedDecValue, desDecimal);
      }
    );
  });

  it("test-calculateTimeoutTimestamp", () => {
    const now = 1000;
    expect(calculateTimeoutTimestamp(10, now)).toEqual(
      (11000000000).toString()
    );
  });

  // TODO: add more tests for this func
  it("test-parseTxToMsgsAndEvents", async () => {
    // case 1: undefined input
    const reuslt = parseTxToMsgsAndEvents(undefined);
    expect(reuslt).toEqual([]);

    // case 2: real tx with multiple msgs and multiple contract calls
    // got data from tx hash 9B435E4014DEBA5AB80D4BB8F52D766A6C14BFCAC21F821CDB96F4ABB4E29B17 Oraichain.
    const rawLog = fs
      .readFileSync(path.join(__dirname, "indexed-tx-raw-log.json"))
      .toString();
    const tx = Buffer.from(
      fs.readFileSync(path.join(__dirname, "indexed-tx-tx.json")).toString(),
      "base64"
    );
    const data = parseTxToMsgsAndEvents({
      rawLog,
      tx,
      hash: "",
      height: 0,
      txIndex: 0,
      code: 0,
      events: [],
      msgResponses: [],
      gasUsed: 0,
      gasWanted: 0
    });
    expect(data.length).toEqual(2);
    expect(data[0].message).toMatchObject({
      sender: "orai16hv74w3eu3ek0muqpgp4fekhrqgpzl3hd3qeqk",
      contract:
        "orai1nt58gcu4e63v7k55phnr3gaym9tvk3q4apqzqccjuwppgjuyjy6sxk8yzp",
      msg: {
        execute_order_book_pair: {
          asset_infos: [
            {
              token: {
                contract_addr:
                  "orai1lplapmgqnelqn253stz6kmvm3ulgdaytn89a8mz9y85xq8wd684s6xl3lt"
              }
            },
            {
              token: {
                contract_addr: "orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh"
              }
            }
          ],
          limit: 100
        }
      },
      funds: []
    });
    expect(data[0].attrs.length).toEqual(5);
    expect(data[1].message).toMatchObject({
      sender: "orai16hv74w3eu3ek0muqpgp4fekhrqgpzl3hd3qeqk",
      contract:
        "orai1nt58gcu4e63v7k55phnr3gaym9tvk3q4apqzqccjuwppgjuyjy6sxk8yzp",
      msg: {
        execute_order_book_pair: {
          asset_infos: [
            { native_token: { denom: "orai" } },
            {
              token: {
                contract_addr: "orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh"
              }
            }
          ],
          limit: 100
        }
      },
      funds: []
    });
    expect(data[0].attrs.length).toEqual(5);
  }, 20000);

  it("test-decodeProto-with-value-input-undefined", () => {
    expect(() => decodeProto(undefined)).toThrow("value is not defined");
  });

  it.each([
    [
      // case 1: value with type_url and valid value
      {
        type_url: "/cosmos.gov.v1beta1.TextProposal",
        value: Uint8Array.from([10, 3, 97, 98, 99]) // Example byte array
      },
      { title: "abc", description: "" }
    ],

    [
      // case 2: value with typeUrl and valid value
      {
        type_url: "/cosmos.gov.v1beta1.TextProposal",
        value: Uint8Array.from([10, 3, 97, 98, 99])
      },
      { title: "abc", description: "" }
    ],

    // case 3: value is object with binary string and object properties is binary string
    [
      {
        key1: "InZhbHVlMSI=",
        key2: {
          nestedKey: "Im5lc3RlZC1zdHJpbmctdmFsdWUi"
        }
      },
      {
        key1: "value1",
        key2: {
          nestedKey: "nested-string-value"
        }
      }
    ],

    // case 4: value is object with text string
    [
      {
        key1: "text-string"
      },
      {
        key1: "text-string"
      }
    ],

    // case 5: value.msg is instance of Uint8Array
    [
      {
        msg: Uint8Array.from([
          123, 34, 107, 101, 121, 34, 58, 34, 118, 97, 108, 117, 101, 34, 125
        ]) // Uint8Array representation of '{"key": "value"}'
      },
      {
        msg: {
          key: "value"
        }
      }
    ]
  ])("test-decodeProto", (value, expectation) => {
    // act
    const res = decodeProto(value);

    // assertion
    expect(res).toEqual(expectation);
  });

  it.each<[string, readonly Event[], { [key: string]: string }[]]>([
    ["empty-events-array", [], []],
    [
      "events-with-single-event-without-attributes",
      [{ type: "wasmEvent", attributes: [] }],
      []
    ],
    [
      "events-with-single-event-with-attributes",
      [
        {
          type: "wasmEvent",
          attributes: [
            { key: "_contract_address", value: "addr1" },
            { key: "key1", value: "value1" }
          ]
        }
      ],
      [{ _contract_address: "addr1", key1: "value1" }]
    ],
    [
      "events-with-multiple-events-with-and-without-attributes",
      [
        {
          type: "wasmEvent",
          attributes: [
            { key: "_contract_address", value: "addr1" },
            { key: "key2", value: "value2" }
          ]
        },
        { type: "otherEvent", attributes: [{ key: "key3", value: "value3" }] },
        {
          type: "wasmEvent",
          attributes: [{ key: "_contract_address", value: "addr2" }]
        }
      ],
      [
        { _contract_address: "addr1", key2: "value2" },
        { _contract_address: "addr2" }
      ]
    ]
  ])("test-parseWasmEvents-with-case: %p", (_case, input, expectedOutput) => {
    expect(parseWasmEvents(input).filter((event) => event)).toEqual(
      expectedOutput
    );
  });

  it.each([
    ["0x1CE09E54A5d7432ecabf3b085BAda7920aeb7dab", "0x01", true],
    ["TEu6u8JLCFs6x1w5s8WosNqYqVx2JMC5hQ", "0x2b6653dc", false],
    ["TEu6u8JLCFs6x1w5s8WosNqYqVx2JMC5hQ", "0x01", false],
    ["0x1", "0x38", false],
    ["", "0x38", false]
  ])("test-validateEvmAddress", (value, network, expectation) => {
    try {
      const { isValid } = validateEvmAddress(value, network);
      expect(isValid).toEqual(expectation);
    } catch (error) {
      expect(expectation).toEqual(false);
    }
  });

  it.each([
    ["TEu6u8JLCFs6x1w5s8WosNqYqVx2JMC5hQ", "0x2b6653dc", true],
    ["0x1CE09E54A5d7432ecabf3b085BAda7920aeb7dab", "0x01", false],
    ["TEu6u8JLCFs6x1w5s8WosNqYqVx2JMC5hQ", "0x01", false],
    ["TE", "0x2b6653dc", false],
    ["", "0x2b6653dc", false]
  ])("test-validateTronAddress", (value, network, expectation) => {
    try {
      const { isValid } = validateTronAddress(value, network);
      expect(isValid).toEqual(expectation);
    } catch (error) {
      expect(expectation).toEqual(false);
    }
  });
});
