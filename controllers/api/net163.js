const moment = require('moment')
const code = require('../../commons/code')
const request = require('../../util/request')



exports.topList = async function (req, res, next) {
    try{
        const topList = {
            0: '3779629', //云音乐新歌榜
            1: '3778678', //云音乐热歌榜
            2: '2884035', ///云音乐原创榜
            3: '19723756', //云音乐飙升榜
            4: '10520166', //云音乐电音榜
            5: '180106', //UK排行榜周榜
            6: '60198', //美国Billboard周榜
            7: '21845217', //KTV嗨榜
            8: '11641012', //iTunes榜
            9: '120001', //Hit FM Top榜
            10: '60131', //日本Oricon周榜
        }
        let data = {
            id: topList[req.query.idx],
            n: 10000
        }
        console.log(data)
        let result = await request(
            'POST', 
            `https://music.163.com/weapi/v3/playlist/detail`, 
            data,
            {crypto: 'linuxapi', cookie: req.query.cookie, proxy: req.query.proxy}
        )
        res.send(result)
    } catch(e) {
        console.log(e)
    }
}


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


//客户端播放
//https://music.163.com/song/media/outer/url?id=歌曲id.mp3
