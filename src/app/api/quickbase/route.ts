// pages/api/quickbase.ts

import { NextResponse } from "next/server";

import { GetRecordFromQueryQB, QueryBuilderQB } from "@/src/lib/quickbase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new NextResponse("ID is required", { status: 400 });
  }

  const apiToken = process.env.QB_API_TOKEN;

  if (!apiToken) {
    return new NextResponse("API token is required", { status: 400 });
  }

  const selectField = [
    3, 16, 701, 1112, 1113, 1114, 1115, 1116, 1117, 1118, 1119, 1121, 1126,
    1132, 1134, 1135, 1136, 1137, 1141, 1149, 1192, 1195,
  ];

  const tableId = "bip52nvuf";
  const queries: [string, string, string, (string | undefined)?][] = [
    ["16", "CONTAINS", id],
  ];

  // ["16", "CONTAINS", "159370"],

  const whereQuery = QueryBuilderQB.encodeWhereQueries(queries);
  const queryBody = QueryBuilderQB.buildQuery(tableId, whereQuery, selectField);

  try {
    const qbRecord = new GetRecordFromQueryQB(apiToken, queryBody);
    const qbRecordRes = await qbRecord.execute();

    if (qbRecordRes.status !== 200) {
      return new NextResponse("Error fetching data from QuickBase", {
        status: qbRecordRes.status,
      });
    }

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

    // const rawData = await qbRecordRes.data();
    // const fieldsMap = rawData.fields.reduce(
    //   (acc: Record<string, string>, field: { id: number; label: string }) => {
    //     acc[field.id] = field.label;
    //     return acc;
    //   },
    //   {}
    // );

    // const refinedData = rawData.data.map((record: Record<string, any>) => {
    //   const transformedRecord: Record<string, any> = {};
    //   Object.keys(record).forEach((key) => {
    //     const fieldName = fieldsMap[key];
    //     transformedRecord[key] = { field: fieldName, value: record[key].value };
    //   });
    //   return transformedRecord;
    // });

    // // Pretty-print the JSON response
    // const prettyPrintedData = JSON.stringify(refinedData, null, 2);

    // return new NextResponse(prettyPrintedData, {
    //   status: 200,
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });

    console.log(refinedData);

    return NextResponse.json(refinedData);
  } catch (error) {
    return new NextResponse(`Error: ${(error as Error).message}`, {
      status: 500,
    });
  }
}
