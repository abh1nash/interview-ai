import amqp from "amqplib";
import prisma from "prisma/client";
import LLMService, { LLMReqeustData } from "./llm.service";

export async function listenForReports() {
  const connection = await amqp.connect(process.env.RABBIT_URL as string);
  const channel = await connection.createChannel();

  channel.assertQueue("generate_report_queue", { durable: true }); // Making the queue durable so messages don't get lost

  channel.consume(
    "generate_report_queue",
    async (msg) => {
      if (msg) {
        const data = JSON.parse(msg.content.toString());

        const requestData = new LLMReqeustData(
          data.chatHistory,
          data.jobDescription
        );

        const llmResponse = await LLMService.generateReport(requestData);

        const reportData = JSON.parse(llmResponse[0]?.message.content); // Assuming that the required JSON is in the content field of the first response

        await prisma.report.create({
          data: {
            interviewId: data.interviewId,
            employerId: data.employerId,
            jobId: data.jobId,
            candidateId: data.candidateId,
            summary: reportData.summary,
            suitabilityScore: reportData.suitabilityScore,
            sentimentSummary: reportData.sentimentSummary,
            knowledgeSummary: reportData.knowledgeSummary,
          },
        });

        channel.ack(msg);
      }
    },
    {
      noAck: false,
    }
  );
}
