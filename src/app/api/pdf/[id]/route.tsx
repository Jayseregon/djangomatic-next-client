import { PrismaClient } from "@prisma/client";
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  Image,
  StyleSheet,
  renderToStream,
} from "@react-pdf/renderer";
import { NextResponse } from "next/server";

import { TowerReport } from "@/src/components/reports/TowerReportsDashboard";

const prisma = new PrismaClient();

// Create styles
const styles = StyleSheet.create({
  page: {
    display: "flex",
    flexDirection: "column",
    padding: 20,
    fontSize: 12,
    lineHeight: 1,
    fontFamily: "Times-Roman",
  },
  section: {
    flexGrow: 1,
    border: "1px solid #4a5568",
  },
  text: {
    marginBottom: 10,
  },
  imageContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: 5,
  },
  image: {
    marginBottom: 3,
  },
  label: {
    textAlign: "center",
    fontSize: 10,
    fontFamily: "Times-Italic",
  },
  imageColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
  },
  footer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 0,
    textAlign: "left",
    fontSize: 10,
  },
  sectionTitleContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  sectionTitle: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

// Create Report Document Component
const ReportDocument = ({ report }: { report: TowerReport }) => {
  const siteImagePairs = [];

  for (let i = 0; i < report.site_images.length; i += 2) {
    siteImagePairs.push(report.site_images.slice(i, i + 2));
  }

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <Text>{report.site_name}</Text>
        <Text>{report.site_code}</Text>
        <Text>{report.jde_job}</Text>
        <Text>{report.design_standard}</Text>
        <Text>{report.client_company}</Text>
        <Text>{report.client_name}</Text>
      </Page>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>SITE PHOTOS</Text>
        </View>
        {siteImagePairs.map((pair, index) => (
          <View key={index} break style={styles.imageColumn}>
            {pair.map((image, idx) => (
              <View key={idx} style={styles.imageContainer}>
                <Image src={image.url} style={styles.image} />
                <Text style={styles.label}>{image.label}</Text>
              </View>
            ))}
          </View>
        ))}
        <Text
          fixed
          render={({ pageNumber, totalPages }) => (
            <>
              Page{" "}
              <Text style={{ fontFamily: "Times-Bold" }}>{pageNumber}</Text> of{" "}
              {totalPages}
            </>
          )}
          style={styles.footer}
        />
      </Page>
    </Document>
  );
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  if (!params.id || params.id === "new") {
    return new Response("ID is required", { status: 400 });
  }

  const report = await prisma.towerReport.findUnique({
    where: { id: params.id },
    include: { front_image: true, site_images: true, deficiency_images: true },
  });

  if (!report) {
    return new Response("Report not found", { status: 404 });
  }

  const stream = await renderToStream(<ReportDocument report={report} />);

  return new NextResponse(stream as unknown as ReadableStream);
}
