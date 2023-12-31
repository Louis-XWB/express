var RPCClient = require('@alicloud/pop-core').RPCClient;

function initVodClient(accessKeyId, accessSecret) {
  const regionId = 'cn-shanghai'
  const client = new RPCClient({
    accessKeyId: accessKeyId,
    accessKeySecret: accessSecret,
    endpoint: `https://vod.${regionId}.aliyuncs.com`,
    apiVersion: '2017-03-21'
  })
  return client
}

exports.getVod = async (req, res) => {
  const client = initVodClient('LTAI5t7BiuaV3vWuftzmihDZ', 'riMzYqDsMUgzoz1l5kFhzcC6VqO0cM')
  const vod = await client.request('CreateUploadVideo', {
    Title: 'this is a sample test',
    FileName: 'filename.mp4',
    setStorageLocation: '123'
  })
  res.status(200).json({ vod })
}