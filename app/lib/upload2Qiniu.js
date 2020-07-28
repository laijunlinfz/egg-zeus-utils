/* eslint-disable */
"use strict";

/**
 * egg上传文件到七牛
 * https://developer.qiniu.com/kodo/sdk/1289/nodejs#form-upload-stream
 * https://www.jianshu.com/p/5e034609cd02
 */

const qiniu = require("qiniu");
// const awaitWriteStream = require("await-stream-ready").write;
const sendToWormhole = require("stream-wormhole");

const md5 = require("./md5");

// 七牛文件上传(数据流上传)
const qiniuUploadSteam = async (stream, qiniuConfig) => {
  try {
    const filename = md5(stream.filename + Date.now());
    const { accessKey, secretKey, bucket, imageBaseUrl } = qiniuConfig;
    const options = {
      scope: bucket,
    };
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);
    const config = new qiniu.conf.Config();
    config.zone = qiniu.zone.Zone_z0;

    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();
    const imgSrc = await new Promise((resolve, reject) => {
      formUploader.putStream(
        uploadToken,
        filename,
        stream,
        putExtra,
        (respErr, respBody, respInfo) => {
          const { error } = respBody;
          if (respInfo.statusCode == 200) {
            resolve(imageBaseUrl + "/" + respBody.key);
          } else if (error === "file exists") {
            // 上传文件已存在，会返回respBody:{ error: 'file exists' }
            resolve(imageBaseUrl + "/" + filename);
          } else {
            reject("");
          }
        }
      );
    });
    if (imgSrc !== "") {
      return imgSrc;
    }
    return false;
  } catch (err) {
    console.error('qiniuUploadSteam err : ', err);
    // 如果出现错误，关闭管道
    await sendToWormhole(stream);
    return false;
  }
};

// 七牛文件上传(数据流上传)
const qiniuUploadBuff = async (buff, qiniuConfig) => {
  try {
    const filename = md5(Date.now() + '');
    const { accessKey, secretKey, bucket, imageBaseUrl } = qiniuConfig;
    const options = {
      scope: bucket,
    };
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);
    const config = new qiniu.conf.Config();
    config.zone = qiniu.zone.Zone_z0;

    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();
    const imgSrc = await new Promise((resolve, reject) => {
      formUploader.put(
        uploadToken,
        filename,
        buff,
        putExtra,
        (respErr, respBody, respInfo) => {
          const { error } = respBody;
          if (respInfo.statusCode == 200) {
            resolve(imageBaseUrl + "/" + respBody.key);
          } else if (error === "file exists") {
            // 上传文件已存在，会返回respBody:{ error: 'file exists' }
            resolve(imageBaseUrl + "/" + filename);
          } else {
            reject("");
          }
        }
      );
    });
    if (imgSrc !== "") {
      return imgSrc;
    }
    return false;
  } catch (err) {
    console.error('qiniuUploadBuff err : ', err);
    // 如果出现错误，关闭管道
    // await sendToWormhole(stream);
    return false;
  }
};

module.exports = {
  qiniuUploadSteam,
  qiniuUploadBuff,
};
