import AWS from 'aws-sdk';

const Bucket = process.env.VUE_APP_POST_IMAGE_POOL;

const uploadImage = async (file, Key) => {
  const s3 = new AWS.S3();
  const params = {
    ACL: 'public-read',
    Body: file,
    Bucket,
    Key,
  };

  await s3.putObject(params).promise();
  return `https://s3.amazonaws.com/${Bucket}/${Key}`;
};

export default {
  async uploadImages(images, id) {
    await AWS.config.credentials.refreshPromise();

    let offset = 0;
    const promises = images.map((image) => {
      const Key = `${id}_${offset}`;
      offset += 1;
      return uploadImage(image, Key);
    });

    const result = await Promise.all(promises);
    return result;
  },
};
