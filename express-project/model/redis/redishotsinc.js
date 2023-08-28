const redis = require('./index')

module.exports.hotInc = async (videoId, incNum) => {
  const data = await redis.zscore('videohots', videoId)

  if (data) {
    return await redis.zincrby('videohots', incNum, videoId)
  } else {
    return await redis.zadd('videohots', incNum, videoId)
  }
}

module.exports.topHots = async (num) => {
  const data = await redis.zrevrange('videohots', 0, num - 1, 'WITHSCORES')
  console.log(data)
  const result = []
  for (let i = 0; i < data.length; i += 2) {
    result.push({
      videoId: data[i],
      hot: data[i + 1],
    })
  }
  return result
}