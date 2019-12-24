const moment = require('moment')
const code = require('../../commons/code')
const request = require('../../util/request')



exports.search = async function (req, res, next) {
    try{
        //type 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频
        let data = {
            s: req.query.keywords,
            type: req.query.type || 1, 
            limit: req.query.limit || 30,
            offset: req.query.offset || 0
        }
        console.log(data)
        let result = await request(
            'POST', 
            `https://music.163.com/weapi/search/get`, 
            data,
            {crypto: 'weapi', cookie: req.cookie, proxy: req.proxy}
        )
        res.send(result)
    } catch(e) {
        console.log(e)
    }
}



