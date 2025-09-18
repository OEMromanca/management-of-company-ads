import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import type { TDocumentDefinitions, ContentColumns } from "pdfmake/interfaces";
import type { IAds } from "../types/types";

pdfMake.vfs = pdfFonts as unknown as Record<string, string>;

export const generatePDF = (ad: IAds & { companyName?: string }) => {
  const logoImage = ad.logoBase64
    ? ad.logoBase64.startsWith("data:")
      ? ad.logoBase64
      : `data:image/png;base64,${ad.logoBase64}`
    : undefined;

  const companyName = ad.companyName?.trim() || "UnknownCompany";

  const headerContent: ContentColumns = {
    columns: [
      logoImage
        ? { image: logoImage, width: 50, height: 50 }
        : { text: companyName, bold: true, fontSize: 16 },
      logoImage
        ? {
            text: companyName,
            bold: true,
            fontSize: 16,
            margin: [10, 15, 0, 0],
          }
        : { text: "", width: 50 },
    ],
    columnGap: 10,
    margin: [0, 0, 0, 10],
  };

  const docDefinition: TDocumentDefinitions = {
    pageSize: "A4",
    pageMargins: [10, 10, 10, 10],
    defaultStyle: { fontSize: 14, lineHeight: 1.2 },
    content: [
      headerContent,
      { text: "Address", bold: true, margin: [0, 10, 0, 2] },
      { text: ad.address || "", margin: [0, 0, 0, 5] },
      { text: "ICO", bold: true, margin: [0, 5, 0, 2] },
      { text: ad.ico || "", margin: [0, 0, 0, 5] },
      { text: "Ad Text", bold: true, margin: [0, 5, 0, 2] },
      { text: ad.text || "", margin: [0, 0, 0, 5] },
    ],
  };

  pdfMake
    .createPdf(docDefinition)
    .download(`${companyName}_${ad.ico || "unknown"}.pdf`);
};
