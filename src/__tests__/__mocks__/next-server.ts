export class NextRequest {
  url: string;
  nextUrl: URL;
  cookies: Map<string, string>;
  method: string;
  headers: Headers;

  constructor(input: RequestInfo | URL, init?: RequestInit) {
    const inputUrl =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.toString()
          : "http://localhost";

    this.url = inputUrl;
    this.nextUrl = new URL(inputUrl);
    this.cookies = new Map();
    this.method = init?.method || "GET";
    this.headers = new Headers(init?.headers);
  }
}

export class NextResponse {
  headers: Headers;
  status: number;

  constructor(body?: BodyInit | null, init?: ResponseInit) {
    this.headers = new Headers(init?.headers);
    this.status = init?.status || 200;
  }
}

describe("Next Server Mocks", () => {
  it("creates NextRequest with correct properties", () => {
    const request = new NextRequest("https://example.com");

    expect(request.nextUrl.href).toBe("https://example.com/");
    expect(request.cookies).toBeInstanceOf(Map);
    expect(request.method).toBe("GET");
  });
});
