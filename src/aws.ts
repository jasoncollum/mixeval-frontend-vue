import aws from 'aws-sdk';
import axios from 'axios';

aws.config.update({
  accessKeyId: process.env.VUE_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.VUE_APP_AWS_SECRET_ACCESS_KEY,
})

export const s3 = new aws.S3({
  signatureVersion: 'v4',
  region: process.env.VUE_APP_AWS_REGION,
})

export const audioFileUpload = async (artistId: string, file: any) => {
  const key = `${artistId}_${file.name}`.replace(/ /g,'_');
  const params = {
    Bucket: process.env.VUE_APP_AWS_BUCKET,
    Key: key,
    Expires: 60,  // 1 minute
    ContentType: file.type,
  }

  try {
    const url = s3.getSignedUrl('putObject', params);
    const result = await axios.put(url, file)
    return result;
  } catch (error) {
    // IMPROVE ERROR HANDLING
    console.log(error);
  } 
}

export const getAudioFile = async (artistId: string, audioFileName: string) => {
  const key = `${artistId}_${audioFileName}`.replace(/ /g,'_');
  const params = {
    Bucket: process.env.VUE_APP_AWS_BUCKET,
    Key: key,
    Expires: 3600,  // 1 hour
    ResponseContentType: 'audio/mpeg'
  }
  try {
    const url = s3.getSignedUrl('getObject', params);
    return url;
  } catch (error) {
    // IMPROVE ERROR HANDLING
    console.log(error)
  }
}

// export const deleteAudioObjectByKey = async (key: string) => {
//   const params = {
//     Bucket: process.env.VUE_APP_AWS_BUCKET,
//     Key: key,
//   }
//   const data = await s3.deleteObject(params);
//   return data;
// }
