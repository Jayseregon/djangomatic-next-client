import { useAsyncList } from "@react-stately/data";
import { Key } from "@react-types/shared";

import { RnDTeamTask, Status } from "@/interfaces/lib";
import { convertTaskDates } from "@/lib/utils";

interface SortDescriptor {
  column: Key;
  direction: "ascending" | "descending";
}

interface AsyncListResponse {
  items: RnDTeamTask[];
}

export const useSortTasksList = (
  apiEndpoint: string,
  showCompleted: boolean,
) => {
  return useAsyncList<RnDTeamTask>({
    async load({ signal }): Promise<AsyncListResponse> {
      const res = await fetch(apiEndpoint, {
        method: "GET",
        signal,
      });
      const data = await res.json();

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
