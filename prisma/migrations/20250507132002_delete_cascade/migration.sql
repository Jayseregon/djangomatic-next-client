-- DropForeignKey
ALTER TABLE "ChatInteractionLog" DROP CONSTRAINT "ChatInteractionLog_chatbotUsageId_fkey";

-- AddForeignKey
ALTER TABLE "ChatInteractionLog" ADD CONSTRAINT "ChatInteractionLog_chatbotUsageId_fkey" FOREIGN KEY ("chatbotUsageId") REFERENCES "ChatbotUsage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
