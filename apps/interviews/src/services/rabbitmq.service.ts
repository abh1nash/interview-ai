import amqp from "amqplib";

export class RabbitMQ {
  private static connection: amqp.Connection | null = null;
  private static channel: amqp.Channel | null = null;

  static async initialize() {
    const maxRetries = 5;
    const backoff = 3000;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        RabbitMQ.connection = await amqp.connect(
          process.env.RABBIT_URL as string
        );
        RabbitMQ.channel = await RabbitMQ.connection.createChannel();
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
  }

  static async sendToQueue(queue: string, data: any) {
    if (!RabbitMQ.channel || !RabbitMQ.connection) {
      console.error(
        "Channel or Connection is not initialized. Ensure RabbitMQ is initialized first."
      );
      throw new Error("Channel or Connection is not initialized.");
    }

    RabbitMQ.channel.assertQueue(queue, { durable: true });
    RabbitMQ.channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
  }
}
