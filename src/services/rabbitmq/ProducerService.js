const amqp = require('amqplib');

class ProducerService {
  constructor() {
    this._channel = null;
    this._connection = null;
  }

  async connect() {
    if (!this._channel) {
      this._connection = await amqp.connect(process.env.RABBITMQ_SERVER);
      this._channel = await this._connection.createChannel();
    }
  }

  async sendMessage(queue, message) {
    await this.connect();
    await this._channel.assertQueue(queue, { durable: true });
    this._channel.sendToQueue(queue, Buffer.from(message));
  }

  async close() {
    await this._channel?.close();
    await this._connection?.close();
  }
}

module.exports = ProducerService;
