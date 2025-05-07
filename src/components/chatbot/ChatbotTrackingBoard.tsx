"use client";
import type { Key } from "@react-types/shared";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@heroui/react";
import { RefreshCcw } from "lucide-react";

import { getChatbotUsageStats } from "@/src/actions/chatbot/tracking/action";
import { ChatbotUsage } from "@/src/interfaces/rnd";
import { LoadingContent } from "@/components/ui/LoadingContent";

import { ChatInteractionTracker } from "./ChatInteractionTracker";

export const ChatbotTrackingBoard = () => {
  const [usageData, setUsageData] = useState<ChatbotUsage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState<Key | null>(null);
  const [userEmailForLogs, setUserEmailForLogs] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getChatbotUsageStats();

        setUsageData(data);
        if (userEmailForLogs && data.length > 0) {
          const initialUser = data.find(
            (user) => user.email === userEmailForLogs,
          );

          if (initialUser) {
            setSelectedKey(initialUser.id);
          } else {
            setSelectedKey(null); // User for logs not in the list, clear visual selection
          }
        } else {
          setSelectedKey(null);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Fetch data once on mount

  // Effect to update visual selection if userEmailForLogs changes (e.g. by prop or internal logic)
  useEffect(() => {
    if (userEmailForLogs && usageData.length > 0) {
      const userToSelect = usageData.find(
        (user) => user.email === userEmailForLogs,
      );

      setSelectedKey(userToSelect ? userToSelect.id : null);
    } else {
      setSelectedKey(null);
    }
  }, [userEmailForLogs, usageData]);

  const refreshData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const freshData = await getChatbotUsageStats();

      setUsageData(freshData);
      // Re-apply visual selection based on the current userEmailForLogs
      if (userEmailForLogs && freshData.length > 0) {
        const userToSelect = freshData.find(
          (user) => user.email === userEmailForLogs,
        );

        setSelectedKey(userToSelect ? userToSelect.id : null);
      } else {
        setSelectedKey(null);
      }
    } catch (err: any) {
      setError(err.message || "Failed to refresh data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectionChange = (keys: "all" | Set<Key>) => {
    let newSelectedEmail: string | null = null;
    let newKey: Key | null = null;

    if (keys === "all") {
      // For single selection, "all" might mean clear selection
      newSelectedEmail = null;
      newKey = null;
    } else {
      const keyArray = Array.from(keys);

      if (keyArray.length > 0) {
        newKey = keyArray[0];
        const user = usageData.find((u) => u.id === newKey);

        if (user) {
          newSelectedEmail = user.email;
        }
      } else {
        // Selection cleared
        newSelectedEmail = null;
        newKey = null;
      }
    }

    // If the selected email is the same as the one already showing logs,
    // and the user clicks it again, treat it as a deselect.
    if (newSelectedEmail && newSelectedEmail === userEmailForLogs) {
      setUserEmailForLogs(null);
      setSelectedKey(null);
    } else {
      setUserEmailForLogs(newSelectedEmail);
      setSelectedKey(newKey);
    }
  };

  return (
    <>
      {" "}
      {/* Use a fragment to return multiple top-level elements */}
      <div className="overflow-x-auto mt-4">
        {error && <div className="text-red-500 mb-4">Error: {error}</div>}

        <Table
          isHeaderSticky
          removeWrapper
          aria-label="chatbot-usage-tracking-board"
          classNames={{
            base: "text-center",
            th: "uppercase bg-foreground text-background text-center",
          }}
          color="primary"
          selectedKeys={selectedKey ? new Set([selectedKey]) : new Set()}
          selectionMode="single"
          topContent={
            <div className="flex justify-end mb-4">
              <Button
                isIconOnly
                color="primary"
                isLoading={isLoading}
                variant="solid"
                onPress={refreshData}
              >
                <RefreshCcw size={18} />
              </Button>
            </div>
          }
          onSelectionChange={handleSelectionChange}
        >
          <TableHeader>
            <TableColumn key="email" className="text-start">
              Email
            </TableColumn>
            <TableColumn key="username" className="text-start">
              Username
            </TableColumn>
            <TableColumn key="messageCount">Messages Sent</TableColumn>
            <TableColumn key="reloadCount">Reloads</TableColumn>
            <TableColumn key="stopCount">Stops</TableColumn>
            <TableColumn key="firstUsed">First Used</TableColumn>
            <TableColumn key="lastUsed">Last Used</TableColumn>
          </TableHeader>
          <TableBody
            emptyContent={"No usage data available"}
            isLoading={isLoading}
            items={usageData}
            loadingContent={<LoadingContent />}
          >
            {(item) => (
              <TableRow key={item.id}>
                <TableCell className="text-start text-nowrap">
                  {item.email}
                </TableCell>
                <TableCell className="text-start text-nowrap">
                  {item.username}
                </TableCell>
                <TableCell className="text-center text-nowrap">
                  {item.messageCount}
                </TableCell>
                <TableCell className="text-center text-nowrap">
                  {item.reloadCount}
                </TableCell>
                <TableCell className="text-center text-nowrap">
                  {item.stopCount}
                </TableCell>
                <TableCell className="text-center text-nowrap">
                  {format(new Date(item.firstUsed), "yyyy-MM-dd HH:mm:ss")}
                </TableCell>
                <TableCell className="text-center text-nowrap">
                  {format(new Date(item.lastUsed), "yyyy-MM-dd HH:mm:ss")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-10">
        <ChatInteractionTracker selectedUserEmail={userEmailForLogs} />
      </div>
    </>
  );
};
