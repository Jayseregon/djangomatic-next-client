"use client";

import type {
  ChromaHeartbeatResponse,
  ChromaCollectionsInfoResponse,
} from "@/src/interfaces/chatbot";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Spinner,
  Divider,
} from "@heroui/react";
import { RefreshCw, Activity } from "lucide-react";
import React from "react";

import {
  getChromaHeartbeat,
  getChromaCollectionsInfo,
} from "@/src/actions/chatbot/chroma/action";
import { cn } from "@/src/lib/utils";

export const HealthCheckDashboard = () => {
  const [heartbeat, setHeartbeat] = useState<ChromaHeartbeatResponse | null>(
    null,
  );
  const [collectionsInfo, setCollectionsInfo] =
    useState<ChromaCollectionsInfoResponse | null>(null);
  const [loadingHeartbeat, setLoadingHeartbeat] = useState(false);
  const [loadingCollections, setLoadingCollections] = useState(false);
  const [errorHeartbeat, setErrorHeartbeat] = useState<string | null>(null);
  const [errorCollections, setErrorCollections] = useState<string | null>(null);

  const handleFetchHeartbeat = async () => {
    setErrorHeartbeat(null);
    setLoadingHeartbeat(true);
    try {
      const data = await getChromaHeartbeat();

      setHeartbeat(data);
    } catch (err: any) {
      setErrorHeartbeat(err.message || "Failed to fetch heartbeat");
    } finally {
      setLoadingHeartbeat(false);
    }
  };

  const handleFetchCollections = async () => {
    setErrorCollections(null);
    setLoadingCollections(true);
    try {
      const data = await getChromaCollectionsInfo();

      setCollectionsInfo(data);
    } catch (err: any) {
      setErrorCollections(err.message || "Failed to fetch collections info");
    } finally {
      setLoadingCollections(false);
    }
  };

  return (
    <div className="w-full max-w-full mt-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-full">
        {/* Heartbeat Card */}
        <Card className="bg-background border border-foreground w-full">
          <CardHeader className="flex justify-between items-center">
            <h4 className="text-lg font-bold">Chroma Heartbeat</h4>
            <Button
              isIconOnly
              color="primary"
              disabled={loadingHeartbeat}
              onPress={handleFetchHeartbeat}
            >
              {loadingHeartbeat ? (
                <Spinner size="sm" />
              ) : (
                <Activity size={18} />
              )}
            </Button>
          </CardHeader>
          <CardBody>
            {errorHeartbeat && <p className="text-red-500">{errorHeartbeat}</p>}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                <span
                  className={cn(
                    "font-mono",
                    heartbeat?.status === "ok"
                      ? "text-green-500"
                      : heartbeat?.status
                        ? "text-red-500"
                        : "text-foreground",
                  )}
                >
                  {heartbeat?.status || "N/A"}
                </span>
              </div>
              <Divider />
              <div className="flex justify-between">
                <span className="font-medium">Message:</span>
                <span className="font-light font-mono">
                  {heartbeat?.message || "N/A"}
                </span>
              </div>
              <Divider />
              <div className="flex justify-between">
                <span className="font-medium">Heartbeat:</span>
                <span className="font-light font-mono">
                  {heartbeat?.heartbeat ? String(heartbeat.heartbeat) : "N/A"}
                </span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Collections Info Card */}
        <Card className="bg-background border border-foreground w-full">
          <CardHeader className="flex justify-between items-center">
            <h4 className="text-lg font-bold">Chroma Collections</h4>
            <Button
              isIconOnly
              color="primary"
              disabled={loadingCollections}
              onPress={handleFetchCollections}
            >
              {loadingCollections ? (
                <Spinner size="sm" />
              ) : (
                <RefreshCw size={18} />
              )}
            </Button>
          </CardHeader>
          <CardBody>
            {errorCollections && (
              <p className="text-red-500">{errorCollections}</p>
            )}
            <div className="space-y-2 w-full">
              <div key="setics" className="flex justify-between w-full">
                <span className="font-medium">setics:</span>
                <span className="bg-primary-100 text-primary-800 px-2 rounded-full">
                  {collectionsInfo?.setics !== undefined
                    ? `${collectionsInfo.setics} items`
                    : "N/A"}
                </span>
              </div>
              <Divider />
              <div key="knowledge_base" className="flex justify-between w-full">
                <span className="font-medium">knowledge_base:</span>
                <span className="bg-primary-100 text-primary-800 px-2 rounded-full">
                  {collectionsInfo?.knowledge_base !== undefined
                    ? `${collectionsInfo.knowledge_base} items`
                    : "N/A"}
                </span>
              </div>
              {collectionsInfo &&
                Object.entries(collectionsInfo)
                  .filter(
                    ([name]) => name !== "setics" && name !== "knowledge_base",
                  )
                  .map(([name, count], index) => (
                    <React.Fragment key={name}>
                      {index > 0 && <Divider />}
                      <div className="flex justify-between w-full">
                        <span className="font-medium">{name}:</span>
                        <span className="bg-primary-100 text-primary-800 px-2 rounded-full">
                          {count} items
                        </span>
                      </div>
                    </React.Fragment>
                  ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
