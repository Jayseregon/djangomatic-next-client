// Mock implementation for @azure/core-rest-pipeline

export const createEmptyPipeline = jest.fn();
export const bearerTokenAuthenticationPolicy = jest.fn();
export const createHttpHeaders = jest.fn().mockReturnValue({});
export const RestError = jest.fn();
