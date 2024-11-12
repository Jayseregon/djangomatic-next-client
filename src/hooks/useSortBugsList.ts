import { useAsyncList } from "@react-stately/data";

import { BugReport, BugStatus } from "@/interfaces/bugs";
import { convertBugsDates } from "@/lib/utils";

export const useSortBugsList = (
  apiEndpoint: string,
  showCompleted: boolean,
): ReturnType<typeof useAsyncList<BugReport>> =>
  useAsyncList<BugReport>({
    async load({ signal }) {
      const res = await fetch(apiEndpoint, {
        method: "GET",
        signal,
      });
      const data = await res.json();

      const bugsWithDates = data.map((bug: BugReport) => convertBugsDates(bug));

      if (showCompleted) {
        return {
          items: bugsWithDates.filter(
            (bug: BugReport) => bug.status === BugStatus.CLOSED,
          ),
        };
      } else {
        return {
          items: bugsWithDates.filter(
            (bug: BugReport) => bug.status !== BugStatus.CLOSED,
          ),
        };
      }
    },
    async sort({ items, sortDescriptor }) {
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
