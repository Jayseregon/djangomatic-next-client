"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  Chip,
  Tooltip,
} from "@heroui/react";

import { ChatInteractionLog as ChatInteractionLogInterface } from "@/src/interfaces/rnd";
import { getChatInteractionLogsByEmail } from "@/src/actions/chatbot/tracking/action";

interface ChatInteractionTrackerProps {
  selectedUserEmail: string | null;
}

const ITEMS_PER_PAGE = 10;

export const ChatInteractionTracker = ({
  selectedUserEmail,
}: ChatInteractionTrackerProps) => {
  const [logs, setLogs] = useState<ChatInteractionLogInterface[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchLogs = useCallback(async (email: string, page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const { logs: fetchedLogs, totalCount } =
        await getChatInteractionLogsByEmail(email, page, ITEMS_PER_PAGE);

      setLogs(fetchedLogs as ChatInteractionLogInterface[]);
      setTotalPages(Math.ceil(totalCount / ITEMS_PER_PAGE));
    } catch (err: any) {
      setError(err.message || "Failed to fetch interaction logs");
      setLogs([]);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedUserEmail) {
      setCurrentPage(1);
      fetchLogs(selectedUserEmail, 1);
    } else {
      setLogs([]);
      setTotalPages(0);
      setError(null); // Clear error when no user is selected
    }
  }, [selectedUserEmail, fetchLogs]);

  // Effect for page changes, only if a user is selected
  useEffect(() => {
    if (selectedUserEmail && currentPage > 0) {
      // Ensure currentPage is valid
      fetchLogs(selectedUserEmail, currentPage);
    }
  }, [currentPage, selectedUserEmail, fetchLogs]); // fetchLogs dependency is important here

  if (!selectedUserEmail && !isLoading && !error) {
    return (
      <div className="mt-6 p-4 text-center text-gray-500">
        Select a user from the board above to see their interaction logs.
      </div>
    );
  }
  if (isLoading && logs.length === 0) {
    // Show spinner only on initial load or when logs are empty
    return (
      <div className="mt-6 p-4 text-center">
        <Spinner label="Loading interaction logs..." />
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">
        Interaction Logs {selectedUserEmail ? `for ${selectedUserEmail}` : ""}
      </h3>
      {error && (
        <div className="text-red-500 mb-4 p-4 border border-red-500 rounded">
          Error: {error}
        </div>
      )}

      <Table
        isHeaderSticky
        removeWrapper
        aria-label="chat-interaction-logs"
        bottomContent={
          totalPages > 0 && !isLoading ? (
            <div className="flex w-full justify-center mt-4">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={currentPage}
                total={totalPages}
                onChange={setCurrentPage}
              />
            </div>
          ) : null
        }
        classNames={{
          base: "text-center",
          th: "uppercase bg-foreground text-background text-center",
          td: "py-2 px-3 text-sm",
        }}
        color="secondary"
      >
        <TableHeader>
          <TableColumn key="timestamp" className="text-start">
            Timestamp
          </TableColumn>
          <TableColumn key="chatId" className="text-start">
            Chat ID
          </TableColumn>
          <TableColumn key="tokensP" className="text-center min-w-[100px]">
            Tokens (Prompt, Compl, Total)
          </TableColumn>
          <TableColumn key="duration" className="text-center">
            Time
          </TableColumn>
          <TableColumn key="status" className="text-start">
            Status
          </TableColumn>
          <TableColumn key="error" className="text-start min-w-[150px]">
            Error Details
          </TableColumn>
          <TableColumn key="userMsgLen" className="text-center">
            User
          </TableColumn>
          <TableColumn key="assistMsgLen" className="text-center">
            Bot
          </TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            !isLoading && selectedUserEmail
              ? "No interaction logs found for this user."
              : " "
          }
          isLoading={isLoading && logs.length > 0} // Show spinner overlay only if there's already data
          items={logs}
          loadingContent={<Spinner label="Updating logs..." />}
        >
          {(item) => (
            <TableRow key={item.id}>
              <TableCell className="text-start text-nowrap p-o m-0">
                {format(new Date(item.timestamp), "yyyy-MM-dd HH:mm:ss")}
              </TableCell>
              <TableCell className="truncate" title={item.chatId}>
                <Tooltip content={item.chatId} placement="top">
                  <span>{item.chatId.substring(0, 10)}...</span>
                </Tooltip>
              </TableCell>
              <TableCell className="text-nowrap text-center">
                {item.promptTokens ?? "-"}, {item.completionTokens ?? "-"},{" "}
                {item.totalTokens ?? "-"}
              </TableCell>
              <TableCell className="text-center">
                {item.durationMs
                  ? `${(item.durationMs / 1000).toFixed(2)}s`
                  : "-"}
              </TableCell>
              <TableCell>
                {item.status ? (
                  <Chip
                    color={
                      item.status === "error" || item.status === "stopped"
                        ? "danger"
                        : item.status === "ready"
                          ? "success"
                          : item.status === "submitted"
                            ? "warning"
                            : "default"
                    }
                    size="sm"
                    variant="flat"
                  >
                    {item.status}
                  </Chip>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell
                className="text-start max-w-xs truncate"
                title={item.errorDetails ?? undefined}
              >
                <Tooltip
                  content={item.errorDetails ?? ""}
                  isDisabled={!item.errorDetails}
                  placement="top"
                >
                  <span>
                    {item.errorDetails
                      ? `${item.errorDetails.substring(0, 30)}...`
                      : "-"}
                  </span>
                </Tooltip>
              </TableCell>
              <TableCell className="text-center">
                {item.userMessageLength ?? "-"}
              </TableCell>
              <TableCell className="text-center">
                {item.assistantMessageLength ?? "-"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
