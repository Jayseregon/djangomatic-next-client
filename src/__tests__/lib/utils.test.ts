import {
  cn,
  formatDate,
  sanitizeFileName,
  extractAzureFileData,
  formatAzureDate,
  titleCase,
  capitalizeFirstLetters,
  stripHtmlTags,
  maskPassword,
  convertTaskDates,
  convertBugsDates,
  convertProjectDates,
  taskDueDateColor,
} from "@/lib/utils";

describe("Utility Functions", () => {
  describe("cn", () => {
    it("should merge class names correctly", () => {
      expect(cn("class1", "class2")).toBe("class1 class2");
      expect(cn("p-4", { "bg-red": true, "text-white": false })).toBe(
        "p-4 bg-red",
      );
    });
  });

  describe("formatDate", () => {
    it("should format date string correctly", () => {
      // Use a specific timezone to avoid test failures
      const date = new Date("2024-01-15T12:00:00Z");

      expect(formatDate(date.toISOString())).toBe("January 15, 2024");
    });
  });

  describe("sanitizeFileName", () => {
    it("should sanitize file names correctly", () => {
      expect(sanitizeFileName("Hello World!@#.txt")).toBe("hello_world.txt");
      expect(sanitizeFileName(" test file ")).toBe("test_file");
    });
  });

  describe("extractAzureFileData", () => {
    it("should extract file data correctly", () => {
      const [baseName, extension, dir] =
        extractAzureFileData("folder/test.txt");

      expect(baseName).toBe("test");
      expect(extension).toBe("txt");
      expect(dir).toBe("folder");
    });
  });

  describe("formatAzureDate", () => {
    it("should format Azure date string correctly", () => {
      const date = new Date("2024-01-15T12:00:00Z");
      const formattedDate = formatAzureDate(date.toISOString());

      // Check if the format matches MM/DD/YYYY
      expect(formattedDate).toMatch(
        /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/,
      );
      expect(formattedDate).toBe("01/15/2024");
    });
  });

  describe("titleCase", () => {
    it("should convert string to title case", () => {
      expect(titleCase("hello_world")).toBe("Hello World");
      expect(titleCase("test_case_string")).toBe("Test Case String");
    });
  });

  describe("capitalizeFirstLetters", () => {
    it("should capitalize first letter of each word", () => {
      expect(capitalizeFirstLetters("hello world")).toBe("Hello World");
      expect(capitalizeFirstLetters("test string")).toBe("Test String");
    });
  });

  describe("stripHtmlTags", () => {
    it("should strip HTML tags from string", () => {
      expect(stripHtmlTags("<p>Hello <b>World</b></p>")).toBe("Hello World");
    });
  });

  describe("maskPassword", () => {
    it("should mask password with asterisks", () => {
      expect(maskPassword("password123")).toBe("***********");
      expect(maskPassword("test")).toBe("****");
    });
  });

  describe("convertTaskDates", () => {
    it("should convert task dates to Date objects", () => {
      const task = {
        createdAt: "2024-01-15T00:00:00Z",
        dueDate: "2024-02-15T00:00:00Z",
        startedAt: "2024-01-16T00:00:00Z",
        completedAt: "2024-02-01T00:00:00Z",
      };
      const converted = convertTaskDates(task);

      expect(converted.createdAt instanceof Date).toBeTruthy();
      expect(converted.dueDate instanceof Date).toBeTruthy();
      expect(converted.startedAt instanceof Date).toBeTruthy();
      expect(converted.completedAt instanceof Date).toBeTruthy();
    });
  });

  describe("convertBugsDates", () => {
    it("should convert bug dates to Date objects", () => {
      const bug = {
        createdDate: "2024-01-15T00:00:00Z",
        assignedDate: "2024-01-16T00:00:00Z",
        completedDate: "2024-02-01T00:00:00Z",
      };
      const converted = convertBugsDates(bug);

      expect(converted.createdDate instanceof Date).toBeTruthy();
      expect(converted.assignedDate instanceof Date).toBeTruthy();
      expect(converted.completedDate instanceof Date).toBeTruthy();
    });
  });

  describe("convertProjectDates", () => {
    it("should convert project dates to Date objects", () => {
      const project = {
        dueDate: "2024-02-15T00:00:00Z",
        startedAt: "2024-01-16T00:00:00Z",
        completedAt: "2024-02-01T00:00:00Z",
      };
      const converted = convertProjectDates(project);

      expect(converted.dueDate instanceof Date).toBeTruthy();
      expect(converted.startedAt instanceof Date).toBeTruthy();
      expect(converted.completedAt instanceof Date).toBeTruthy();
    });
  });

  describe("taskDueDateColor", () => {
    it("should return correct color class for past due date", () => {
      const pastDate = new Date();

      pastDate.setDate(pastDate.getDate() - 1);
      expect(taskDueDateColor(pastDate)).toBe("bg-red-500/15");
    });

    it("should return correct color class for today", () => {
      const today = new Date();

      expect(taskDueDateColor(today)).toBe("bg-yellow-500/15");
    });

    it("should return empty string for future date", () => {
      const futureDate = new Date();

      futureDate.setDate(futureDate.getDate() + 1);
      expect(taskDueDateColor(futureDate)).toBe("");
    });
  });
});
