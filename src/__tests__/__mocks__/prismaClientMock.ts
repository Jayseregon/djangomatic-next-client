export const prisma: any = {
  appUsageTracking: {
    create: jest.fn().mockResolvedValue({ id: "test-id" }),
    update: jest.fn().mockResolvedValue({ id: "test-id" }),
  },
  user: {
    findUnique: jest.fn(),
  },
  roadmapCardCategory: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
  roadmapCard: {
    findMany: jest.fn(),
  },
  roadmapProject: {
    findMany: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    findUnique: jest.fn(),
  },
  roadmapProjectCard: {
    deleteMany: jest.fn(),
    update: jest.fn(),
  },
  $transaction: jest.fn((callback) => callback(prisma)),
};
