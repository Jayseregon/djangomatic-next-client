import { useAsyncList } from "@react-stately/data";

import { RnDTeamTask } from "@/interfaces/lib";

export const useSortTasksList = (
  apiEndpoint: string,
): ReturnType<typeof useAsyncList<RnDTeamTask>> =>
  useAsyncList<RnDTeamTask>({
    async load({ signal }) {
      const res = await fetch(apiEndpoint, {
        method: "GET",
        signal,
      });
      const data = await res.json();

      const tasksWithDates = data.map((task: RnDTeamTask) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        startedAt: task.startedAt ? new Date(task.startedAt) : undefined,
        completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
      }));

      return {
        items: tasksWithDates,
      };
    },
    async sort({ items, sortDescriptor }) {
      if (!sortDescriptor) {
        return { items };
      }

      return {
        items: items.sort((a, b) => {
          const aValue = a[sortDescriptor.column as keyof RnDTeamTask];
          const bValue = b[sortDescriptor.column as keyof RnDTeamTask];

          if (aValue == null || bValue == null) {
            return 0;
          }

          return aValue > bValue
            ? sortDescriptor.direction === "ascending"
              ? 1
              : -1
            : aValue < bValue
              ? sortDescriptor.direction === "ascending"
                ? -1
                : 1
              : 0;
        }),
      };
    },
  });
