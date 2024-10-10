import axios, { AxiosResponse } from "axios";

interface QuickBaseAPIResponse {
  status: number;
  data: () => Promise<any>;
}

abstract class QuickBaseAPI {
  protected _apiToken: string;
  protected _qbUrl: string;
  protected _qbRealm: string;
  protected _headers: Record<string, string>;

  constructor(apiToken: string) {
    this._apiToken = apiToken;
    this._qbUrl = "https://api.quickbase.com/v1";
    this._qbRealm = "telecon.quickbase.com";
    this._headers = {
      "QB-Realm-Hostname": this._qbRealm,
      "User-Agent": `Djangomatic_${this.constructor.name}_v1.0-dev`,
      Authorization: `QB-USER-TOKEN ${this._apiToken}`,
      "Content-Type": "application/json",
    };
  }

  get headers(): Record<string, string> {
    return this._headers;
  }

  get qbUrl(): string {
    return this._qbUrl;
  }

  abstract execute(): Promise<QuickBaseAPIResponse>;
}

class GetRecordFromQueryQB extends QuickBaseAPI {
  private _query: Record<string, any>;

  constructor(apiToken: string, query: Record<string, any>) {
    super(apiToken);
    this._query = query;
  }

  async execute(): Promise<QuickBaseAPIResponse> {
    const tableUrl = `${this._qbUrl}/records/query`;
    const response: AxiosResponse = await axios.post(tableUrl, this._query, {
      headers: this._headers,
    });

    return {
      status: response.status,
      data: async () => response.data,
    };
  }
}

enum QueryOperatorQB {
  CONTAINS = "CT",
  DOES_NOT_CONTAIN = "XCT",
  HAS = "HAS",
  DOES_NOT_HAVE = "XHAS",
  IS_EQUAL_TO = "EX",
  TRUE_VALUE = "TV",
  NOT_TRUE_VALUE = "XTV",
  IS_NOT_EQUAL_TO = "XEX",
  STARTS_WITH = "SW",
  DOES_NOT_START_WITH = "XSW",
  IS_BEFORE = "BF",
  IS_ON_OR_BEFORE = "OBF",
  IS_AFTER = "AF",
  IS_ON_OR_AFTER = "OAF",
  IS_IN_RANGE = "IR",
  IS_NOT_IN_RANGE = "XIR",
  IS_LESS_THAN = "LT",
  IS_LESS_THAN_OR_EQUAL_TO = "LTE",
  IS_GREATER_THAN = "GT",
  IS_GREATER_THAN_OR_EQUAL_TO = "GTE",
}

class QueryBuilderQB {
  static encodeWhereQueries(
    queries: [string, string, string, string?][],
  ): string {
    const encodedQueries: string[] = [];

    for (const query of queries) {
      const [fieldId, operator, argument, joinOperator] = query;
      const opCode = QueryOperatorQB[operator as keyof typeof QueryOperatorQB];

      let encodedQuery = `{${fieldId}.${opCode}.${argument}}`;

      if (joinOperator) {
        encodedQuery = `${joinOperator.toUpperCase()}${encodedQuery}`;
      }

      encodedQueries.push(encodedQuery);
    }

    return encodedQueries.join("");
  }

  static buildQuery(
    tableId: string,
    whereQuery: string,
    select?: number[],
  ): Record<string, any> {
    if (select) {
      return { from: tableId, select, where: whereQuery };
    } else {
      return { from: tableId, where: whereQuery };
    }
  }
}

class QBHelper {
  // query helper function
  static async makeRequest(
    queryBody: Record<string, any>,
    errorName: string,
    apiToken: string,
  ): Promise<{ data: () => any }> {
    const qbRequest = new GetRecordFromQueryQB(apiToken, queryBody);
    const qbRequestRes = await qbRequest.execute();

    if (qbRequestRes.status !== 200) {
      return {
        data: async () => {
          throw new Error(`Error fetching ${errorName} data from QuickBase`);
        },
      };
    }

    return qbRequestRes;
  }

  // data cleanup helper function
  static async dataCleanup(qbRecordRes: { data: () => any }) {
    try {
      const rawData = await qbRecordRes.data();
      const refinedData = rawData.data.reduce(
        (acc: Record<string, any>, record: Record<string, any>) => {
          Object.keys(record).forEach((key) => {
            acc[key] = record[key].value;
          });

          return acc;
        },
        {},
      );

      return refinedData;
    } catch (error) {
      throw new Error(`Data cleanup failed: ${(error as Error).message}`);
    }
  }
}

export {
  QuickBaseAPI,
  GetRecordFromQueryQB,
  QueryOperatorQB,
  QueryBuilderQB,
  QBHelper,
};
