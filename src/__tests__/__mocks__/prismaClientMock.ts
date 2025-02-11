export const prisma: any = {
  appUsageTracking: {
    create: jest.fn().mockImplementation((data) => {
      if (!data.data.task_id) {
        throw new Error("Error creating new tracking entry");
      }

      return Promise.resolve({ id: "test-id", ...data.data });
    }),
    update: jest.fn().mockImplementation((data) => {
      if (!data.where.id) {
        throw new Error("Error updating tracking entry");
      }

      return Promise.resolve({ id: data.where.id, ...data.data });
    }),
    findMany: jest.fn().mockImplementation((query) => {
      if (query?.where?.status === "SUCCESS") {
        return Promise.resolve([
          { id: "1", status: "SUCCESS" },
          { id: "2", status: "SUCCESS" },
        ]);
      }
      throw new Error("Database error");
    }),
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
