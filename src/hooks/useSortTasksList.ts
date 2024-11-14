import { useAsyncList } from "@react-stately/data";

import { RnDTeamTask, Status } from "@/interfaces/lib";
import { convertTaskDates } from "@/lib/utils"; // Added import

export const useSortTasksList = (
  apiEndpoint: string,
  showCompleted: boolean,
): ReturnType<typeof useAsyncList<RnDTeamTask>> =>
  useAsyncList<RnDTeamTask>({
    async load({ signal }) {
      const res = await fetch(apiEndpoint, {
        method: "GET",
        signal,
      });
      const data = await res.json();

      const tasksWithDates = data.map((task: RnDTeamTask) =>
        convertTaskDates(task),
      );

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

      const sortedTasks = filteredTasks.sort(
        (a: RnDTeamTask, b: RnDTeamTask) => a.priority - b.priority,
      );

      return { items: sortedTasks };
    },
    async sort({ items, sortDescriptor }) {
      if (!sortDescriptor) {
        return { items };
      }

      const sortedItems = [...items].sort((a, b) => {
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

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDescriptor.direction === "ascending"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return 0;
      });

      return { items: sortedItems };
    },
  });
