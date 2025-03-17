import { useAsyncList } from "@react-stately/data";
import { Key } from "@react-types/shared";
import { Status } from "@prisma/client";

import { RnDTeamTask } from "@/interfaces/lib";
import { convertTaskDates } from "@/lib/utils";
import { getRndTasksByOwnerId } from "@/src/actions/prisma/rndTask/action";

interface SortDescriptor {
  column: Key;
  direction: "ascending" | "descending";
}

interface AsyncListResponse {
  items: RnDTeamTask[];
}

export const useSortTasksList = (ownerId: string, showCompleted: boolean) => {
  return useAsyncList<RnDTeamTask>({
    async load(): Promise<AsyncListResponse> {
      try {
        // Use the server action instead of fetch
        const data = await getRndTasksByOwnerId(ownerId);

        const tasksWithDates = data.map(convertTaskDates);
        const filteredTasks = showCompleted
          ? tasksWithDates.filter(
              (task: RnDTeamTask) =>
                task.status === Status.COMPLETED ||
                task.status === Status.CANCELLED,
            )
          : tasksWithDates.filter(
              (task: RnDTeamTask) =>
                task.status !== Status.COMPLETED &&
                task.status !== Status.CANCELLED,
            );

        return {
          items: filteredTasks.sort(
            (a: RnDTeamTask, b: RnDTeamTask) => a.priority - b.priority,
          ),
        };
      } catch (error) {
        console.error("Error loading tasks:", error);

        return { items: [] };
      }
    },
    async sort({
      items,
      sortDescriptor,
    }: {
      items: RnDTeamTask[];
      sortDescriptor: SortDescriptor | null;
    }): Promise<AsyncListResponse> {
      if (!sortDescriptor) {
        return { items };
      }

      return {
        items: [...items].sort((a, b) => {
          const aValue = a[sortDescriptor.column as keyof RnDTeamTask];
          const bValue = b[sortDescriptor.column as keyof RnDTeamTask];

          if (aValue == null || bValue == null) {
            return 0;
          }

          if (typeof aValue === "number" && typeof bValue === "number") {
            return sortDescriptor.direction === "ascending"
              ? aValue - bValue
              : bValue - aValue;
          }

          if (aValue instanceof Date && bValue instanceof Date) {
            return sortDescriptor.direction === "ascending"
              ? aValue.getTime() - bValue.getTime()
              : bValue.getTime() - aValue.getTime();
          }

          const aString = String(aValue);
          const bString = String(bValue);

          return sortDescriptor.direction === "ascending"
            ? aString.localeCompare(bString)
            : bString.localeCompare(aString);
        }),
      };
    },
  });
};
