const AWS = require('aws-sdk');

class StorageService {
  constructor() {
    this._s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    this._bucketName = process.env.AWS_BUCKET_NAME;
  }

  async writeFile(file, meta) {
    const filename = `${+new Date()}-${meta.filename}`;

    const buffer = await this._streamToBuffer(file);

    const params = {
      Bucket: this._bucketName,
      Key: filename,
      Body: buffer,
      ContentType: meta.headers['content-type'],
    };

    await this._s3.upload(params).promise();

    return filename;
  }

  _streamToBuffer(stream) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }
}

module.exports = StorageService;
