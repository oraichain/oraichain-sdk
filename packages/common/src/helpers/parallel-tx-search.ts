import { StargateClient, IndexedTx } from "@cosmjs/stargate";
import { QueryTag } from "@cosmjs/tendermint-rpc";
import { buildQuery } from "@cosmjs/tendermint-rpc/build/tendermint37/requests";
import { Tx } from "src/tx";

export type SearchOptions = {
  startHeight: number;
  endHeight: number;
  queryTags?: QueryTag[];
  limit?: number;
  maxThreadLevel?: number;
};

export class TxSearch {
  public options: SearchOptions;

  constructor(public readonly client: StargateClient, options: SearchOptions) {
    // override with default options
    this.options = {
      startHeight: options.startHeight ?? 1,
      limit: Math.min(5000, options.limit ?? 1000),
      maxThreadLevel: options.maxThreadLevel ?? 4,
      queryTags: options.queryTags ?? [],
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
    startHeight: number,
    limit: number,
    endHeight: number
  ): number {
    return Math.min(startHeight + limit || 1, endHeight);
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

  private calculateOffsetParallel(threadId: number, startHeight: number) {
    return threadId * this.options.limit + startHeight;
  }

  private calculateParallelLevel(startHeight: number, endHeight: number) {
    // if negative then default is 1. If larger than 4 then max is 4
    return Math.max(
      1,
      Math.min(
        this.options.maxThreadLevel,
        Math.floor((endHeight - startHeight) / this.options.limit)
      )
    );
  }

  public txSearch = async () => {
    try {
      const { startHeight, endHeight } = this.options;
      if (endHeight > startHeight) {
        let parallelLevel = this.calculateParallelLevel(startHeight, endHeight);
        let threads = [];
        for (let i = 0; i < parallelLevel; i++) {
          threads.push(
            this.queryTendermint(this.client, i, startHeight, endHeight)
          );
        }
        const results: Tx[][] = await Promise.all(threads);
        let storedResults: Tx[] = [];
        for (let result of results) {
          storedResults.push(...result);
        }
        return storedResults;
      }
    } catch (error) {
      console.log("error query tendermint parallel: ", error);
      // this makes sure that the stream doesn't stop and keeps reading forever even when there's an error
    }
  };

  private async queryTendermint(
    stargateClient: StargateClient,
    threadId: number,
    startHeight: number,
    endHeight: number
  ): Promise<Tx[]> {
    const { queryTags } = this.options;
    const threadOffset = this.calculateOffsetParallel(threadId, startHeight);
    const newOffset = this.calculateMaxSearchHeight(
      threadOffset,
      this.options.limit,
      endHeight
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
