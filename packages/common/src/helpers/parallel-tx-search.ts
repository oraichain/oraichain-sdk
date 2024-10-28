import { StargateClient, IndexedTx } from "@cosmjs/stargate";
import { QueryTag } from "@cosmjs/tendermint-rpc";
import { buildQuery } from "@cosmjs/tendermint-rpc/build/tendermint37/requests";
import { Tx } from "src/tx";

export type SearchOptions = {
  queryTags: QueryTag[];
  offset?: number;
  limit?: number;
  maxThreadLevel?: number;
};

export class TxSearch {
  public options: SearchOptions;

  constructor(public readonly client: StargateClient, options: SearchOptions) {
    // override with default options
    this.options = {
      offset: options.offset ?? 1,
      limit: Math.min(5000, options.limit ?? 1000),
      maxThreadLevel: options.maxThreadLevel ?? 4,
      ...options
    };
  }

  parseTxResponse(tx: IndexedTx): Tx {
    return {
      ...tx,
      timestamp: (tx as any).timestamp
    };
  }

  private calculateMaxSearchHeight(
    offset: number,
    limit: number,
    currentHeight: number
  ): number {
    return Math.min(offset + limit || 1, currentHeight);
  }

  private buildTendermintQuery(
    queryTags: QueryTag[],
    oldOffset: number,
    newOffset: number
  ) {
    return buildQuery({
      tags: queryTags,
      raw: `tx.height >= ${oldOffset} AND tx.height < ${newOffset}`
    });
  }

  private calculateOffsetParallel(threadId: number, offset: number) {
    return threadId * this.options.limit + offset;
  }

  private calculateParallelLevel(offset: number, currentHeight: number) {
    // if negative then default is 1. If larger than 4 then max is 4
    return Math.max(
      1,
      Math.min(
        this.options.maxThreadLevel,
        Math.floor((currentHeight - offset) / this.options.limit)
      )
    );
  }

  public txSearch = async () => {
    try {
      const { limit, offset } = this.options;
      let currentHeight = await this.client.getHeight();
      if (currentHeight > offset) {
        let parallelLevel = this.calculateParallelLevel(offset, currentHeight);
        let threads = [];
        for (let i = 0; i < parallelLevel; i++) {
          threads.push(
            this.queryTendermint(this.client, i, offset, currentHeight)
          );
        }
        const results: Tx[][] = await Promise.all(threads);
        let storedResults: Tx[] = [];
        for (let result of results) {
          storedResults.push(...result);
        }
        // calculate the next offset
        this.options.offset = this.calculateMaxSearchHeight(
          // parallel - 1 because its the final thread id which handles the highest offset possible assuming we have processed all height before it
          this.calculateOffsetParallel(parallelLevel - 1, offset),
          limit,
          currentHeight
        );
      }
    } catch (error) {
      console.log("error query tendermint parallel: ", error);
      // this makes sure that the stream doesn't stop and keeps reading forever even when there's an error
    }
  };

  private async queryTendermint(
    stargateClient: StargateClient,
    threadId: number,
    offset: number,
    currentHeight: number
  ): Promise<Tx[]> {
    const { queryTags } = this.options;
    const threadOffset = this.calculateOffsetParallel(threadId, offset);
    const newOffset = this.calculateMaxSearchHeight(
      threadOffset,
      this.options.limit,
      currentHeight
    );
    if (newOffset > threadOffset) {
      const query = this.buildTendermintQuery(
        queryTags,
        threadOffset,
        newOffset
      );
      const result = await stargateClient.searchTx(query);
      const storedResults = result.map((tx) => this.parseTxResponse(tx));
      return storedResults;
    }
    return [];
  }
}
