"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Spinner,
  Accordion,
  AccordionItem,
  Input,
} from "@heroui/react";
import { RefreshCw, Trash2 } from "lucide-react";

import {
  deleteChromaSourceFromCollection,
  getChromaSourceByCollections,
} from "@/actions/chatbot/chroma/action";
import {
  ChromaCollectionSourcesResponse,
  ChromaDeleteSourceResponse,
} from "@/interfaces/chatbot";
import { SearchIcon } from "@/components/icons";

import SourceDeletedToast from "./SourceDeletedToast";

export const SourcesManagementDashboard = () => {
  // Initialize with properly structured empty state
  const [sources, setSources] = useState<ChromaCollectionSourcesResponse>({
    collections: {},
  });
  const [loadingSources, setLoadingSources] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Toast state
  const [toastOpen, setToastOpen] = useState(false);
  const [deleteResponse, setDeleteResponse] =
    useState<ChromaDeleteSourceResponse | null>(null);
  const [deletedInfo, setDeletedInfo] = useState<{
    collection: string;
    source: string;
  }>({ collection: "", source: "" });
  const [deleteError, setDeleteError] = useState(false);

  // Function to fetch sources with better error handling
  const fetchSources = async () => {
    setLoadingSources(true);
    setError(null);

    try {
      const data = await getChromaSourceByCollections();

      // Ensure data has the expected structure
      if (data && typeof data === "object") {
        setSources(data);
      } else {
        throw new Error("Received invalid data format from API");
      }
    } catch (err: any) {
      console.error("Failed to fetch sources:", err);
      setError(err.message || "Failed to load sources");
    } finally {
      setLoadingSources(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchSources();
  }, []);

  // Handle search input change
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  // Clear search input
  const onClear = useCallback(() => {
    setSearchTerm("");
  }, []);

  // Handler for delete source
  const handleDeleteSource = async (collection: string, source: string) => {
    try {
      // Store the info about what we're deleting (for the toast)
      setDeletedInfo({
        collection: collection,
        source: source,
      });

      // Call the API to delete the source
      const response = await deleteChromaSourceFromCollection(
        collection,
        source,
      );

      // Set the response for the toast
      setDeleteResponse(response);
      setDeleteError(false);

      // Show the toast
      setToastOpen(true);

      // Refresh the sources list to reflect the deletion
      if (response.status === "success") {
        // Optionally update local state to avoid a full refetch
        const updatedCollections = { ...sources.collections };

        if (updatedCollections[collection]) {
          updatedCollections[collection] = updatedCollections[
            collection
          ].filter((s) => s !== source);
          setSources({ collections: updatedCollections });
        } else {
          // If we can't update locally, just fetch again
          fetchSources();
        }
      }
    } catch (err) {
      console.error("Error deleting source:", err);

      // Show error toast
      setDeleteError(true);
      setDeleteResponse({
        status: "error",
        message: err instanceof Error ? err.message : "Failed to delete source",
        documents_deleted: 0,
      });
      setToastOpen(true);
    }
  };

  // Filter and process collections based on search term - with safer access
  const filteredCollections = useMemo(() => {
    // Safely access collections, providing empty object as fallback
    const collectionsObj = sources?.collections || {};

    if (!searchTerm) {
      return collectionsObj;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered: Record<string, string[]> = {};

    // Filter collections and their sources based on search term
    Object.entries(collectionsObj).forEach(([collectionName, sourceArray]) => {
      if (!Array.isArray(sourceArray)) {
        return; // Skip if not an array
      }

      // Check if collection name matches
      const isCollectionMatch = collectionName
        .toLowerCase()
        .includes(lowerSearchTerm);

      // Filter sources that match search term
      const matchingSources = sourceArray.filter(
        (source) =>
          typeof source === "string" &&
          source.toLowerCase().includes(lowerSearchTerm),
      );

      // Include collection if its name matches or it has matching sources
      if (isCollectionMatch || matchingSources.length > 0) {
        filtered[collectionName] = isCollectionMatch
          ? sourceArray // If collection name matches, include all sources
          : matchingSources; // Otherwise just include matching sources
      }
    });

    return filtered;
  }, [sources, searchTerm]);

  return (
    <div className="w-full flex justify-center mt-20">
      <div className="w-full max-w-full">
        {/* Sources List Card */}
        <Card className="bg-background border border-foreground">
          <CardHeader className="flex flex-col gap-4">
            <div className="flex justify-between items-center w-full">
              <h4 className="text-lg font-bold text-foreground">
                Content Sources
              </h4>
              <Button
                isIconOnly
                color="primary"
                disabled={loadingSources}
                onPress={fetchSources}
              >
                {loadingSources ? (
                  <Spinner size="sm" />
                ) : (
                  <RefreshCw size={18} />
                )}
              </Button>
            </div>
            <Input
              isClearable
              aria-label="search-bar"
              className="h-10 w-full"
              classNames={{
                input:
                  "text-sm text-foreground border-none outline-none ring-0 focus:border-none focus:outline-none focus:ring-0",
                inputWrapper: "bg-background border border-foreground",
              }}
              color="default"
              placeholder="Search collections or sources..."
              radius="sm"
              startContent={
                <SearchIcon className="text-base text-foreground-400 pointer-events-none flex-shrink-0" />
              }
              value={searchTerm}
              onClear={onClear}
              onValueChange={handleSearchChange}
            />
          </CardHeader>
          <CardBody>
            {error && <p className="text-red-500 text-center py-4">{error}</p>}

            {loadingSources ? (
              <div className="flex justify-center py-10">
                <Spinner />
              </div>
            ) : sources?.collections &&
              Object.keys(filteredCollections).length > 0 ? (
              <Accordion
                className="gap-2"
                selectionMode="multiple"
                variant="bordered"
              >
                {Object.entries(filteredCollections).map(
                  ([collectionName, sourceArray]) => (
                    <AccordionItem
                      key={collectionName}
                      textValue={`${collectionName} (${Array.isArray(sourceArray) ? sourceArray.length : 0} sources)`}
                      title={
                        <div className="flex justify-between items-center w-full">
                          <span className="font-medium text-foreground">
                            {collectionName}
                          </span>
                          <span className="text-xs text-foreground px-2 py-1 rounded-full border border-foreground">
                            {Array.isArray(sourceArray)
                              ? sourceArray.length
                              : 0}{" "}
                            sources
                          </span>
                        </div>
                      }
                    >
                      <div className="space-y-3 py-2">
                        {Array.isArray(sourceArray) &&
                        sourceArray.length > 0 ? (
                          sourceArray.map((source, sourceIndex) => (
                            <div
                              key={`${collectionName}-${sourceIndex}`}
                              className="flex justify-between items-center p-2 mb-1 bg-foreground/5 rounded"
                            >
                              <div className="flex-1 overflow-hidden text-ellipsis mr-2">
                                <p className="text-sm text-foreground font-normal">
                                  {source}
                                </p>
                              </div>
                              <Button
                                isIconOnly
                                color="danger"
                                size="sm"
                                variant="flat"
                                onPress={() =>
                                  handleDeleteSource(collectionName, source)
                                }
                              >
                                <Trash2 size={16} strokeWidth={1} />
                              </Button>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-foreground/70">
                            No sources in this collection
                          </p>
                        )}
                      </div>
                    </AccordionItem>
                  ),
                )}
              </Accordion>
            ) : (
              <p className="text-foreground/70 py-10 text-center">
                {searchTerm
                  ? "No matching collections or sources found."
                  : "No sources available. Click the refresh button to load sources."}
              </p>
            )}
          </CardBody>
        </Card>

        {/* Toast notification for delete operation */}
        {deleteResponse && (
          <SourceDeletedToast
            collectionName={deletedInfo.collection}
            isError={deleteError}
            open={toastOpen}
            response={deleteResponse}
            setOpen={setToastOpen}
            sourceName={deletedInfo.source}
          />
        )}
      </div>
    </div>
  );
};
