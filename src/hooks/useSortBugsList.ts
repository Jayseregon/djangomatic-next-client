import { useAsyncList } from "@react-stately/data";
import { Key } from "@react-types/shared";

import { BugReport, BugStatus } from "@/interfaces/bugs";
import { convertBugsDates } from "@/lib/utils";

interface SortDescriptor {
  column: Key;
  direction: "ascending" | "descending";
}

interface AsyncListResponse {
  items: BugReport[];
}

export const useSortBugsList = (
  apiEndpoint: string,
  showCompleted: boolean,
) => {
  return useAsyncList<BugReport>({
    async load({ signal }): Promise<AsyncListResponse> {
      const res = await fetch(apiEndpoint, {
        method: "GET",
        signal,
      });
      const data = await res.json();

      const bugsWithDates = data.map(convertBugsDates);

      return {
        items: showCompleted
          ? bugsWithDates.filter(
              (bug: BugReport) => bug.status === BugStatus.CLOSED,
            )
          : bugsWithDates.filter(
              (bug: BugReport) => bug.status !== BugStatus.CLOSED,
            ),
      };
    },
    async sort({
      items,
      sortDescriptor,
    }: {
      items: BugReport[];
      sortDescriptor: SortDescriptor | null;
    }): Promise<AsyncListResponse> {
      if (!sortDescriptor) {
        return { items };
      }

      return {
        items: items.sort((a, b) => {
          const aValue = a[sortDescriptor.column as keyof BugReport];
          const bValue = b[sortDescriptor.column as keyof BugReport];

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
};
