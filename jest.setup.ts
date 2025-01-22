import "@testing-library/jest-dom";

// Mock global Request and Response if not available in test environment
if (typeof Request === 'undefined') {
  global.Request = class Request {
    constructor(input: RequestInfo | URL, init?: RequestInit) {}
  } as any
}

if (typeof Response === 'undefined') {
  global.Response = class Response {
    constructor(body?: BodyInit | null, init?: ResponseInit) {}
  } as any
}
Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });