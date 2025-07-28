const nodemailer = require('nodemailer');

class MailSender {
  constructor() {
    this._transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendEmail(targetEmail, content) {
    const message = {
      from: 'OpenMusic App <no-reply@openmusic.com>',
      to: targetEmail,
      subject: 'Ekspor Lagu Playlist Anda',
      text: 'Terlampir data lagu dari playlist Anda',
      attachments: [
        {
          filename: 'playlist.json',
          content: JSON.stringify(content),
        },
      ],
    };

    await this._transporter.sendMail(message);
  }
}

module.exports = MailSender;
