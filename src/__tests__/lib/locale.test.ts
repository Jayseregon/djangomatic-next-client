import { cookies } from "next/headers";

import { getUserLocale, setUserLocale } from "@/lib/locale";

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

describe("Locale Utils", () => {
  const mockCookies = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(() => {
    (cookies as jest.Mock).mockReturnValue(mockCookies);
    jest.clearAllMocks();
  });

  describe("getUserLocale", () => {
    it("should return locale from cookie if exists", async () => {
      mockCookies.get.mockReturnValue({ value: "fr" });
      const locale = await getUserLocale();

      expect(locale).toBe("fr");
    });

    it("should return default locale if cookie not found", async () => {
      mockCookies.get.mockReturnValue(undefined);
      const locale = await getUserLocale();

      expect(locale).toBe("en"); // assuming "en" is your defaultLocale
    });
  });

  describe("setUserLocale", () => {
    it("should set locale in cookies", async () => {
      await setUserLocale("fr");
      expect(mockCookies.set).toHaveBeenCalledWith("NEXT_LOCALE", "fr");
    });
  });
});
