"use client";

import { Input, Switch } from "@heroui/react";
import { FileUp, FileJson } from "lucide-react";

import { useFileUpload } from "@/hooks/chatbot/useFileUpload";
import { useWebUpload } from "@/hooks/chatbot/useWebUpload";
import { UploadCard } from "@/components/rnd/chatbot/UploadCard";
import { UploadResultDisplay } from "@/components/rnd/chatbot/UploadResultDisplay";
import { FileUploadInput } from "@/components/rnd/chatbot/FileUploadInput";
import { UploadActionButtons } from "@/components/rnd/chatbot/UploadActionButtons";

export const UploadsUtilityDashboard = () => {
  // Custom hooks for handling file uploads and web URL processing
  const pdf = useFileUpload("pdf");
  const json = useFileUpload("setics");
  const web = useWebUpload();

  return (
    <div className="w-full max-w-full mt-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-full">
        {/* PDF Document Card */}
        <UploadCard
          description="Add new or Update existing PDF documents in the vector store"
          title="PDF Document"
        >
          <FileUploadInput
            accept=".pdf"
            fileToUpload={pdf.fileToUpload}
            handleFileChange={pdf.handleFileChange}
            icon={<FileUp className="text-foreground/70" size={18} />}
            inputRef={pdf.inputRef}
            uploadProgress={pdf.uploadProgress}
            uploading={pdf.uploading}
          />

          <UploadResultDisplay result={pdf.uploadResult} />

          <UploadActionButtons
            currentOperation={pdf.uploadOperation}
            disabled={!pdf.fileToUpload}
            uploading={pdf.uploading}
            onUpload={pdf.handleFileUpload}
          />

          {pdf.uploadError && (
            <p className="text-red-500 text-sm">{pdf.uploadError}</p>
          )}
        </UploadCard>

        {/* URL Processing Card */}
        <UploadCard
          description="Add new or Update existing Web url documents in the vector store"
          title="Web Document"
        >
          <Input
            classNames={{
              input:
                "text-sm text-foreground border-none outline-none ring-0 focus:border-none focus:outline-none focus:ring-0",
              inputWrapper: "bg-background border border-foreground",
              innerWrapper: "ring-0",
              mainWrapper: "ring-0",
            }}
            color="default"
            placeholder="https://example-url.com"
            radius="sm"
            type="url"
            value={web.urlToProcess}
            onChange={(e) => web.setUrlToProcess(e.target.value)}
          />

          {web.urlToProcess && (
            <p className="text-sm text-foreground font-light font-mono">
              Selected: {web.urlToProcess}
            </p>
          )}

          <Switch
            color="primary"
            isSelected={web.withImages}
            size="sm"
            onValueChange={web.setWithImages}
          >
            <span className="text-sm text-foreground">
              Include images in processing
            </span>
          </Switch>

          <UploadResultDisplay result={web.uploadResult} sourceLabel="Source" />

          <UploadActionButtons
            currentOperation={web.operation}
            disabled={!web.urlToProcess.trim()}
            uploading={web.processing}
            onUpload={web.handleUrlSubmit}
          />

          {web.error && <p className="text-red-500 text-sm">{web.error}</p>}
        </UploadCard>

        {/* Setics Document Card (JSON) */}
        <UploadCard
          description="Add new or Update existing Setics JSON documents in the vector store"
          title="Setics Document"
        >
          <FileUploadInput
            accept=".json"
            fileToUpload={json.fileToUpload}
            handleFileChange={json.handleFileChange}
            icon={<FileJson className="text-foreground/70" size={18} />}
            inputRef={json.inputRef}
            uploadProgress={json.uploadProgress}
            uploading={json.uploading}
          />

          <UploadResultDisplay result={json.uploadResult} />

          <UploadActionButtons
            currentOperation={json.uploadOperation}
            disabled={!json.fileToUpload}
            uploading={json.uploading}
            onUpload={json.handleFileUpload}
          />

          {json.uploadError && (
            <p className="text-red-500 text-sm">{json.uploadError}</p>
          )}
        </UploadCard>
      </div>
    </div>
  );
};
