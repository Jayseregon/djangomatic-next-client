// Polyfill for TextEncoder/TextDecoder
if (typeof TextEncoder === "undefined") {
  const { TextEncoder, TextDecoder } = require("util");
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

import "@testing-library/jest-dom";

// Mock global Request and Response if not available in test environment
if (typeof Request === 'undefined') {
  global.Request = class Request {
    constructor(input: RequestInfo | URL, init?: RequestInit) {}
  } as any
}

// Replace the Response polyfill with a custom implementation that supports json()
class CustomResponse {
  body: string;
  status: number;
  statusText: string;
  headers: Headers;
  ok: boolean;
  constructor(body: BodyInit | null, init: ResponseInit = {}) {
    this.body = body as string;
    this.status = init.status || 200;
    this.statusText = init.statusText || "OK";
    this.headers = new Headers(init.headers || {});
    this.ok = this.status >= 200 && this.status < 300;
  }
  json() {
    return Promise.resolve(JSON.parse(this.body));
  }
}
global.Response = CustomResponse as any;

Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });

global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: async () => [],
    // ...add any additional properties needed...
  })
);

// Enhance DataTransfer mock to store files
class MockDataTransfer {
  items: {
    fileList: File[];
    add: (file: File) => void;
    clear: () => void;
    remove: () => void;
  };
  files: FileList;

  constructor() {
    this.items = {
      fileList: [],
      add: (file: File) => {
        this.items.fileList.push(file);
        this.files = {
          ...this.items.fileList,
          length: this.items.fileList.length,
          item: (index: number) => this.items.fileList[index] || null
        } as unknown as FileList;
      },
      clear: jest.fn(),
      remove: jest.fn(),
    };
    
    // Initialize empty FileList
    this.files = {
      0: undefined,
      length: 0,
      item: jest.fn()
    } as unknown as FileList;
  }
}

global.DataTransfer = MockDataTransfer as unknown as typeof DataTransfer;