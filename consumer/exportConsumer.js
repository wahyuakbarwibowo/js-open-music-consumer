require('dotenv').config();

const amqp = require('amqplib');
const PlaylistsService = require('../src/services/postgres/PlaylistsService');
const MailSender = require('../src/services/mail/MailSender');
const ExportPlaylists = require('../src/consumers/exportPlaylists');

const init = async () => {
  const playlistService = new PlaylistsService();
  const mailSender = new MailSender();

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  const queue = 'export:playlists';

  await channel.assertQueue(queue, { durable: true });
  channel.consume(queue, async (msg) => {
    await ExportPlaylists(msg, playlistService, mailSender);
    channel.ack(msg);
  });

  console.log(`🎧 Listening to queue: ${queue}`);
};

init();
