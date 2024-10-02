import React from "react";
import { Text, Image } from "@react-pdf/renderer";

import { StylesPDF } from "@/styles/stylesPDF";

export default function PageFooter() {
  return (
    <>
      <Text
        fixed
        render={({ pageNumber, totalPages }) => (
          <>
            Page{" "}
            <Text style={{ fontFamily: "Helvetica-Bold" }}>{pageNumber}</Text>{" "}
            of {totalPages}
          </>
        )}
        style={StylesPDF.pageCount}
      />
      {/* Footer Rogers corner */}
      <Image
        fixed
        src="./public/reports/rogers/rogers-footer.jpg"
        style={StylesPDF.pageImageFooter}
      />
    </>
  );
}
