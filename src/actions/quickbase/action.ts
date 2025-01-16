"use server";

import { RecordData } from "@/src/interfaces/reports";
import { QueryBuilderQB, QBHelper } from "@/src/lib/quickbase";

export async function getQuickbaseReportData(
  id: string | undefined,
): Promise<RecordData> {
  if (!id) {
    throw new Error("No ID provided for QuickBase report data retrieval.");
  }

  const apiToken = process.env.QB_API_TOKEN;

  if (!apiToken) {
    throw new Error("Quickbase API token is required.");
  }

  // Configure search parameters for report project
  const tableSelectFields = [
    3, 16, 701, 1112, 1113, 1114, 1115, 1116, 1117, 1118, 1119, 1121, 1126,
    1132, 1134, 1135, 1136, 1137, 1141, 1149, 1192, 1195,
  ];
  const tableId = "bip52nvuf";
  const tableQueries: [string, string, string, (string | undefined)?][] = [
    ["16", "CONTAINS", id],
  ];
  const whereQuery = QueryBuilderQB.encodeWhereQueries(tableQueries);
  const queryBody = QueryBuilderQB.buildQuery(
    tableId,
    whereQuery,
    tableSelectFields,
  );

  // Configure search parameters for related task >> Peng lookup
  const taskSelectFields = [1077, 1048, 569, 616, 618, 1212];
  const taskTableId = "bip52nvv9";
  // task #6
  const task6Queries: [string, string, string, (string | undefined)?][] = [
    ["569", "CONTAINS", id],
    ["616", "CONTAINS", "6", "and"],
    ["618", "CONTAINS", "Peng", "and"],
  ];
  const task6WhereQuery = QueryBuilderQB.encodeWhereQueries(task6Queries);
  const task6QueryBody = QueryBuilderQB.buildQuery(
    taskTableId,
    task6WhereQuery,
    taskSelectFields,
  );
  // task #8
  const task8Queries: [string, string, string, (string | undefined)?][] = [
    ["569", "CONTAINS", id],
    ["616", "CONTAINS", "8", "and"],
    ["618", "CONTAINS", "Peng", "and"],
  ];
  const task8WhereQuery = QueryBuilderQB.encodeWhereQueries(task8Queries);
  const task8QueryBody = QueryBuilderQB.buildQuery(
    taskTableId,
    task8WhereQuery,
    taskSelectFields,
  );

  try {
    // Query QuickBase for report project
    const qbRecordRes = await QBHelper.makeRequest(
      queryBody,
      "report",
      apiToken,
    );
    // Query QuickBase for related task >> Peng lookup
    // task #6
    const qbTask6RecordRes = await QBHelper.makeRequest(
      task6QueryBody,
      "task #6",
      apiToken,
    );
    // task #8
    const qbTask8RecordRes = await QBHelper.makeRequest(
      task8QueryBody,
      "task #8",
      apiToken,
    );

    // Format the record response data
    const refinedRecordData = await QBHelper.dataCleanup(qbRecordRes);
    // Format the task record response data
    // task #6
    const refinedTask6Data = await QBHelper.dataCleanup(qbTask6RecordRes);
    // task #8
    const refinedTask8Data = await QBHelper.dataCleanup(qbTask8RecordRes);

    // initialize assigned eng. variable
    let pEng: string = "N/A";

    if (refinedTask8Data["1048"] && refinedTask8Data["1048"].length > 0) {
      pEng = refinedTask8Data["1048"][0]["name"];
    } else if (
      refinedTask6Data["1048"] &&
      refinedTask6Data["1048"].length > 0
    ) {
      pEng = refinedTask6Data["1048"][0]["name"];
    }

    if (pEng !== "N/A") {
      if (pEng === "Elahe Mohammadi") {
        pEng = "Eli Mohammadi, P. Eng.";
      } else {
        pEng = pEng + ", P. Eng.";
      }
    }

    refinedRecordData["1048"] = pEng;

    return refinedRecordData;
  } catch (error) {
    throw new Error(
      `Error fetching report data from QuickBase: ${(error as Error).message}`,
    );
  }
}
