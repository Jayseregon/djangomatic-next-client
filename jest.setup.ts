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

global.fetch = jest.fn();

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