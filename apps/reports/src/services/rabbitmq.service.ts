import amqp from "amqplib";
import prisma from "../../prisma/client";
import LLMService, { LLMReqeustData } from "./llm.service";

export async function listenForReports() {
  const maxRetries = 5;
  const backoff = 3000;
  let retries = 0;

  let connection;
  let channel: amqp.Channel;

  while (retries < maxRetries) {
    try {
      connection = await amqp.connect(process.env.RABBIT_URL as string);
      channel = await connection.createChannel();
      console.log("Connected to RabbitMQ.");
      break;
    } catch (error) {
      retries++;
      console.error(
        `Failed to connect to RabbitMQ. Attempt ${retries}/${maxRetries}. Retrying in ${
          backoff / 1000
        } seconds.`
      );
      if (retries === maxRetries) {
        console.error("Max retries reached. Exiting.");
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, backoff));
    }
  }

  channel!.assertQueue("generate_report_queue", { durable: true });

  channel!.consume(
    "generate_report_queue",
    async (msg) => {
      if (msg) {
        const data = JSON.parse(msg.content.toString());
        console.log("Received message from generate_report_queue:");
        console.log(data);
        const requestData = new LLMReqeustData(
          data.questionsAndAnswers,
          data.jobDescription
        );
        const llmResponse = await LLMService.generateReport(requestData);
        const reportData = JSON.parse(llmResponse[0]?.message.content);

        await prisma.report.create({
          data: {
            interviewId: data.interviewId,
            employerId: data.employerId,
            jobId: data.jobId,
            candidateId: data.candidateId,
            summary: reportData.summary,
            suitabilityScore:
              typeof reportData.suitabilityScore == "string"
                ? parseInt(reportData.suitabilityScore)
                : reportData.suitabilityScore,
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
