"use client";

import { useState, useEffect, type JSX } from "react";
import { SortDescriptor } from "@react-types/shared";
import { useAsyncList } from "@react-stately/data";
import {
  Button,
  Progress,
  Spinner,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { v4 as uuidv4 } from "uuid";

import { videosData } from "@/src/config/videosData";
import {
  sanitizeFileName,
  extractAzureFileData,
  formatAzureDate,
} from "@/src/lib/utils";
import { LoadingContent } from "@/components/ui/LoadingContent";

import { TrashIcon, GearIcon } from "../icons";

export interface BlobTagsProps {
  clientName: string;
  categoryName: string;
  uuid: string;
}

export interface BlobProps {
  name: string;
  createdOn: Date;
  contentType: string;
  url: string;
  tags: BlobTagsProps;
}

/**
 * BlobStorage component for managing Azure Blob Storage uploads and displaying blob list.
 * It allows users to upload files, view the list of uploaded blobs, and delete blobs.
 *
 * @returns {JSX.Element} The rendered BlobStorage component.
 */
export const BlobStorage = (): JSX.Element => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string>("");
  const [clientName, setClientName] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadUUID, setUploadUUID] = useState<string>("");

  const blobsList = useAsyncList<BlobProps>({
    async load({ signal }) {
      const res = await fetch("/api/azure-blob/list?subdir=videos_tutorials", {
        method: "GET",
        signal,
      });
      const data = await res.json();

      return {
        items: data,
      };
    },
    async sort({ items, sortDescriptor }) {
      if (!sortDescriptor.column) {
        return { items };
      }

      return {
        items: items.sort((a, b) => {
          const first = a[sortDescriptor.column as keyof BlobProps];
          const second = b[sortDescriptor.column as keyof BlobProps];

          let cmp =
            (parseInt(first as string) || first) <
            (parseInt(second as string) || second)
              ? -1
              : 1;

          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }

          return cmp;
        }),
      };
    },
  });

  useEffect(() => {
    blobsList.reload();
  }, []);

  // Set up an EventSource to listen for upload progress updates
  useEffect(() => {
    if (uploadUUID) {
      const eventSource = new EventSource(
        `/api/azure-blob/progress?uuid=${uploadUUID}`,
      );

      eventSource.onmessage = (event) => {
        const progress = JSON.parse(event.data);

        setUploadProgress((progress.loadedBytes / file!.size) * 100);
      };
      eventSource.onerror = () => {
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    }
  }, [uploadUUID]);

  /**
   * Handle file input change event.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  /**
   * Handle the file upload process.
   */
  const handleUpload = async () => {
    if (file && categoryName && clientName) {
      setIsUploading(true);
      const sanitizedBlobName = sanitizeFileName(file.name);
      const sanitizeCategoryName = sanitizeFileName(categoryName);
      const sanitizeClientName = sanitizeFileName(clientName);
      const uuid = uuidv4();

      setUploadUUID(uuid);
      const formData = new FormData();

      formData.append("file", file);
      formData.append("blobName", sanitizedBlobName);
      formData.append("subdir", "videos_tutorials");
      formData.append("categoryName", sanitizeCategoryName);
      formData.append("clientName", sanitizeClientName);
      formData.append("uuid", uuid);

      const xhr = new XMLHttpRequest();

      xhr.open("POST", "/api/azure-blob/upload", true);

      // Handle upload completion
      xhr.onload = () => {
        if (xhr.status === 200) {
          setFile(null);
          setFileName(null);
          setCategoryName("");
          setClientName("");
          blobsList.reload(); // Reload the list to update the data
        }
        setIsUploading(false);
        setUploadProgress(0);
        setUploadUUID("");
      };

      // Handle upload error
      xhr.onerror = () => {
        console.error("Upload failed.");
        setIsUploading(false);
        setUploadProgress(0);
        setUploadUUID("");
      };

      xhr.send(formData);
    }
  };

  /**
   * Handle the delete process.
   *
   * @param {string} blobName - The name of the blob to delete.
   */
  const handleDelete = async (blobName: string) => {
    const res = await fetch(`/api/azure-blob/delete?blobName=${blobName}`, {
      method: "DELETE",
    });

    if (res.status === 200) {
      blobsList.reload(); // Reload the list to update the data
    } else {
      console.error("Delete failed.");
    }
  };

  /**
   * Render the top content for file upload and category/client selection.
   *
   * @returns {JSX.Element} The top content.
   */
  const topContent = (): JSX.Element => {
    return (
      <div className="pb-5">
        <div className="flex w-full inline-block py-1 rounded-3xl bg-transparent border-0 text-sm text-foreground ring-1 ring-inset ring-gray-300 dark:ring-gray-700">
          <label
            className="block w-40 py-1.5 bg-transparent border border-transparent border-r-slate-300 dark:border-r-slate-700 text-sm text-foreground text-center"
            htmlFor="file-input"
          >
            <span>Select a file</span>
            <input
              aria-label="file-input"
              className="sr-only"
              id="file-input"
              name="file-input"
              type="file"
              onChange={handleFileChange}
            />
          </label>
          {fileName && (
            <span className="py-1.5 ms-3 text-sm text-foreground">
              {fileName}
            </span>
          )}
        </div>
        <div className="flex inline-block gap-4 pt-4 justify-between">
          <div className="flex flex-row gap-10">
            <select
              required
              aria-label="category-name"
              className="block min-w-52 rounded-3xl bg-background border-0 py-1.5 text-sm text-foreground shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-foreground dark:focus:ring-foreground"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            >
              <option disabled value="">
                Select a category
              </option>
              {videosData.category_labels.map((category) => (
                <option key={category.key} value={category.key}>
                  {category.label}
                </option>
              ))}
            </select>
            <select
              required
              aria-label="client-name"
              className="block min-w-52 rounded-3xl bg-background border-0 py-1.5 text-sm text-foreground shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-foreground dark:focus:ring-foreground"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            >
              <option disabled value="">
                Select a client
              </option>
              {videosData.client_labels.map((client) => (
                <option key={client.key} value={client.key}>
                  {client.label}
                </option>
              ))}
            </select>
          </div>
          <Button
            aria-label="upload-button"
            className="bg-primary text-white"
            disabled={isUploading}
            isDisabled={isUploading}
            radius="full"
            onPress={handleUpload}
          >
            {isUploading ? (
              <Spinner aria-label="upload-spinner" color="white" size="sm" />
            ) : (
              "Upload"
            )}
          </Button>
        </div>
        {isUploading && (
          <Progress
            showValueLabel
            className="mt-4"
            color="primary"
            label="Loading..."
            maxValue={100}
            value={uploadProgress}
          />
        )}
      </div>
    );
  };

  const handleSortChange = (sortDescriptor: SortDescriptor) => {
    blobsList.sort({
      ...sortDescriptor,
      column: sortDescriptor.column ?? "id",
      direction: sortDescriptor.direction ?? "ascending",
    });
  };

  return (
    <div className="mt-10 w-full">
      <div className="overflow-x-auto">
        <Table
          isHeaderSticky
          removeWrapper
          aria-label="azure-blob-table"
          classNames={{
            tbody: "text-left",
            th: "uppercase bg-foreground text-background",
          }}
          color="primary"
          selectionMode="single"
          sortDescriptor={blobsList.sortDescriptor}
          topContent={topContent()}
          onSortChange={handleSortChange}
        >
          <TableHeader>
            <TableColumn key="name" allowsSorting>
              Name
            </TableColumn>
            <TableColumn key="extension" allowsSorting>
              Format
            </TableColumn>
            <TableColumn key="dir" allowsSorting>
              Azure Directory
            </TableColumn>
            <TableColumn key="tags.categoryName" allowsSorting>
              Category Name
            </TableColumn>
            <TableColumn key="tags.clientName" allowsSorting>
              Client Name
            </TableColumn>
            <TableColumn key="createdOn" allowsSorting>
              Date Upload
            </TableColumn>
            <TableColumn key="actions" className="ps-4">
              <GearIcon />
            </TableColumn>
          </TableHeader>
          <TableBody
            emptyContent={"No blobs to display."}
            isLoading={blobsList.isLoading}
            items={blobsList.items}
            loadingContent={<LoadingContent />}
          >
            {(item) => {
              const [baseName, extension, dir] = extractAzureFileData(
                item.name,
              );

              return (
                <TableRow key={item.name}>
                  <TableCell>{baseName}</TableCell>
                  <TableCell>{extension}</TableCell>
                  <TableCell>{dir}</TableCell>
                  <TableCell>{item.tags.categoryName}</TableCell>
                  <TableCell>{item.tags.clientName}</TableCell>
                  <TableCell>
                    {formatAzureDate(item.createdOn.toString())}
                  </TableCell>
                  <TableCell>
                    <Button
                      isIconOnly
                      className=" w-3 h-5"
                      color="danger"
                      size="sm"
                      variant="bordered"
                      onPress={() => handleDelete(item.name)}
                    >
                      <TrashIcon size={13} />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            }}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
