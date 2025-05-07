import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { JSX } from "react";

import {
  defaultHeader,
  docsHeader,
  videosHeader,
  reportsHeader,
  appsTdsHeader,
  appsCogecoHeader,
  appsVistabeamHeader,
  appsXploreHeader,
  appsTelusHeader,
  renderTableHeader,
} from "@/components/admin/UserTableHeaders";

describe("UserTableHeaders", () => {
  // Updated helper: always render header without extra wrapping.
  const renderHeader = (header: JSX.Element) => {
    render(<table>{header}</table>);
  };

  const getHeaderTexts = () =>
    screen.getAllByRole("columnheader").map((el) => el.textContent?.trim());

  describe("defaultHeader", () => {
    it("renders admin view correctly", () => {
      renderHeader(defaultHeader({ isAdmin: true }));
      // Expected texts for admin view (exact match)
      const expectedTexts = [
        "email",
        "username",
        "last login",
        "admin",
        "r&d team",
        "Roadmap",
        "Bugs",
        "r&d",
      ];
      const headers = getHeaderTexts();

      expectedTexts.forEach((text) => expect(headers).toContain(text));
      expect(headers).toHaveLength(10);
    });

    it("renders non-admin view correctly", () => {
      renderHeader(defaultHeader({ isAdmin: false }));
      // Non-admin view omits "r&d team"
      const expectedTexts = [
        "email",
        "username",
        "last login",
        "admin",
        "Roadmap",
        "Bugs",
        "r&d",
      ];
      const headers = getHeaderTexts();

      expectedTexts.forEach((text) => expect(headers).toContain(text));
      expect(headers).toHaveLength(9);
    });
  });

  describe("docsHeader", () => {
    it("renders docs header with correct columns", () => {
      renderHeader(docsHeader());
      const expectedTexts = [
        "email",
        "username",
        "admin",
        "cogeco",
        "comcast",
        "tds",
        "vistabeam",
        "xplore",
      ];
      const headers = getHeaderTexts();
      // Check that "K-C" appears twice (one plain, one with file lock)
      const kcCount = headers.filter((text) => text?.startsWith("K-C")).length;

      expect(kcCount).toEqual(2);
      // Also check for remaining expected texts
      expectedTexts.forEach((text) => expect(headers).toContain(text));
      expect(headers).toHaveLength(10);
    });
  });

  describe("videosHeader", () => {
    it("renders videos header with correct columns", () => {
      renderHeader(videosHeader());
      const expectedTexts = [
        "email",
        "username",
        "admin",
        "gis",
        "cad",
        "lidar",
        "eng",
        "sttar",
      ];
      const headers = getHeaderTexts();

      expectedTexts.forEach((text) => expect(headers).toContain(text));
      expect(headers).toHaveLength(8);
    });
  });

  describe("reportsHeader", () => {
    it("renders reports header with correct columns", () => {
      renderHeader(reportsHeader());
      const expectedTexts = ["email", "username", "access", "delete"];
      const headers = getHeaderTexts();

      expectedTexts.forEach((text) => expect(headers).toContain(text));
      expect(headers).toHaveLength(4);
    });
  });

  describe("appsTdsHeader", () => {
    it("renders apps TDS header with correct columns", () => {
      renderHeader(appsTdsHeader());
      const expectedTexts = [
        "email",
        "username",
        "hld",
        "lld",
        "arcgis",
        "ovr",
        "admin",
        "super",
      ];
      const headers = getHeaderTexts();

      expectedTexts.forEach((text) => expect(headers).toContain(text));
      expect(headers).toHaveLength(8);
    });
  });

  describe("appsCogecoHeader", () => {
    it("renders apps COGECO header with correct columns", () => {
      renderHeader(appsCogecoHeader());
      const expectedTexts = ["email", "username", "hld"];
      const headers = getHeaderTexts();

      expectedTexts.forEach((text) => expect(headers).toContain(text));
      expect(headers).toHaveLength(3);
    });
  });

  describe("appsVistabeamHeader", () => {
    it("renders apps Vistabeam header with correct columns", () => {
      renderHeader(appsVistabeamHeader());
      const expectedTexts = ["email", "username", "hld", "ovr", "super"];
      const headers = getHeaderTexts();

      expectedTexts.forEach((text) => expect(headers).toContain(text));
      expect(headers).toHaveLength(5);
    });
  });

  describe("appsXploreHeader", () => {
    it("renders apps Xplore header with correct columns", () => {
      renderHeader(appsXploreHeader());
      const expectedTexts = ["email", "username", "admin", "hld"];
      const headers = getHeaderTexts();

      expectedTexts.forEach((text) => expect(headers).toContain(text));
      expect(headers).toHaveLength(4);
    });
  });

  describe("appsTelusHeader", () => {
    it("renders apps Telus header with correct columns", () => {
      renderHeader(appsTelusHeader());
      const expectedTexts = ["email", "username", "admin"];
      const headers = getHeaderTexts();

      expectedTexts.forEach((text) => expect(headers).toContain(text));
      expect(headers).toHaveLength(3);
    });
  });

  describe("renderTableHeader", () => {
    it("renders correct header based on selected menu and admin", () => {
      // docs case
      renderHeader(renderTableHeader("docs", true));
      let headers = getHeaderTexts();

      // Expect at least one header starting with "K-C"
      expect(
        headers.filter((text) => text?.startsWith("K-C")).length,
      ).toBeGreaterThan(0);

      // videos
      renderHeader(renderTableHeader("videos", true));
      headers = getHeaderTexts();
      expect(headers).toContain("gis");

      // reports
      renderHeader(renderTableHeader("reports", true));
      headers = getHeaderTexts();
      expect(headers).toContain("access");

      // apps-tds
      renderHeader(renderTableHeader("apps-tds", true));
      headers = getHeaderTexts();
      expect(headers).toContain("arcgis");

      // apps-cogeco
      renderHeader(renderTableHeader("apps-cogeco", true));
      headers = getHeaderTexts();
      expect(headers).toContain("hld");

      // apps-vistabeam
      renderHeader(renderTableHeader("apps-vistabeam", true));
      headers = getHeaderTexts();
      expect(headers).toContain("ovr");

      // apps-xplore
      renderHeader(renderTableHeader("apps-xplore", true));
      headers = getHeaderTexts();
      expect(headers).toContain("admin");

      // apps-telus
      renderHeader(renderTableHeader("apps-telus", true));
      headers = getHeaderTexts();
      expect(headers).toContain("admin");

      // default falls back to defaultHeader
      renderHeader(renderTableHeader("random", false));
      headers = getHeaderTexts();
      expect(headers).toContain("username");
    });
  });
});
