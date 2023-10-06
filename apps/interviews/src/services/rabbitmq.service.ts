import amqp from "amqplib";

export class RabbitMQ {
  static async sendToQueue(queue: string, data: any) {
    const connection = await amqp.connect(process.env.RABBITMQ_URL as string);
    const channel = await connection.createChannel();
    channel.assertQueue(queue, { durable: false });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
    await channel.close();
    await connection.close();
  }
}
