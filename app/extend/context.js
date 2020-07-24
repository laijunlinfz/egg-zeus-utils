'use strict';

const md5 = require('../lib/md5');
const upload2Qiniu = require('../lib/upload2Qiniu');
const { qiniuUploadSteam, qiniuUploadBuff } = upload2Qiniu;
const index = require('../lib/utils');
const check = require('../lib/check');

const utils = {
  md5,
  qiniuUploadSteam,
  qiniuUploadBuff,
  ...index,
  ...check,
};

module.exports = { utils };
// module.exports = utils;
