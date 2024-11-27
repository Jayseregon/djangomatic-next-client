import React from "react";
import { Text, Image as PdfImg } from "@react-pdf/renderer";

import { StylesPDF } from "@/styles/stylesPDF";

const PageFooter = ({
  redlinePages,
  jumpRedlines = false,
}: {
  redlinePages: number;
  jumpRedlines?: boolean;
}) => {
  return (
    <>
      <Text
        fixed
        render={({ pageNumber, totalPages }) => (
          <>
            Page{" "}
            <Text style={{ fontFamily: "Helvetica-Bold" }}>
              {jumpRedlines ? pageNumber + redlinePages : pageNumber}
            </Text>{" "}
            of {totalPages + redlinePages}
          </>
        )}
        style={StylesPDF.pageCount}
      />
      {/* Footer Rogers corner */}
      <PdfImg
        fixed
        src="/reports/rogers/rogers-footer.jpg"
        style={StylesPDF.pageImageFooter}
      />
    </>
  );
};

export default PageFooter;
