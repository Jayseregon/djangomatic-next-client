-- AlterTable
ALTER TABLE "ChatbotUsage" ADD COLUMN     "reloadCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "stopCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "ChatInteractionLog" (
    "id" TEXT NOT NULL,
    "chatbotUsageId" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "promptTokens" INTEGER,
    "completionTokens" INTEGER,
    "totalTokens" INTEGER,
    "finishReason" TEXT,
    "durationMs" INTEGER,
    "errorDetails" TEXT,
    "toolsCalled" JSONB,
    "userMessageLength" INTEGER,
    "assistantMessageLength" INTEGER,
    "apiEndpoint" TEXT,
    "status" TEXT,

    CONSTRAINT "ChatInteractionLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ChatInteractionLog_chatbotUsageId_idx" ON "ChatInteractionLog"("chatbotUsageId");

-- CreateIndex
CREATE INDEX "ChatInteractionLog_chatId_idx" ON "ChatInteractionLog"("chatId");

-- AddForeignKey
ALTER TABLE "ChatInteractionLog" ADD CONSTRAINT "ChatInteractionLog_chatbotUsageId_fkey" FOREIGN KEY ("chatbotUsageId") REFERENCES "ChatbotUsage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
