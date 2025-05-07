// Mock implementation for @azure/storage-blob

export const BlobServiceClient = jest.fn().mockImplementation(() => {
  return {
    getContainerClient: jest.fn().mockReturnValue({
      getBlockBlobClient: jest.fn().mockReturnValue({
        uploadData: jest.fn().mockResolvedValue({
          _response: { status: 201 },
        }),
        url: "https://mock-storage-account.blob.core.windows.net/mock-container/mock-blob",
      }),
    }),
  };
});

export const StorageSharedKeyCredential = jest
  .fn()
  .mockImplementation(() => ({}));

export const generateBlobSASQueryParameters = jest.fn().mockReturnValue({
  toString: () => "mock-sas-token",
});

export const BlobSASPermissions = {
  parse: jest.fn(),
  add: jest.fn(),
};
