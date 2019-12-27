const moment = require('moment')
const request = require('../../util/qq/request')
const setting = require('../../config/setting')


exports.search = async function (req, res, next) {
    try{
        let {
            pageNo = 1,
            pageSize = 50,
            key,
            t = 0, // 0：单曲，2：歌单，7：歌词，8：专辑，9：歌手，12：mv
            raw
        } = req.query
        let total = 0
        const url = {
            2: 'http://c.y.qq.com/soso/fcgi-bin/client_music_search_songlist',
            // 3: 'http://c.y.qq.com/soso/fcgi-bin/client_search_user',
            }[t] || 'http://c.y.qq.com/soso/fcgi-bin/client_search_cp'
        
        const typeMap = {
            0: 'song',
            2: 'songlist',
            7: 'lyric',
            8: 'album',
            12: 'mv',
            9: 'singer',
        }
        
        if (!typeMap[t]) {
            return res.send({ status: 500, errMsg: '搜索类型错误，检查一下参数 t'})
        }
        
        let data = {
            format: 'json', // 返回json格式
            n: pageSize, // 一页显示多少条信息
            p: pageNo, // 第几页
            w: key, // 搜索关键词
            cr: 1, // 不知道这个参数什么意思，但是加上这个参数你会对搜索结果更满意的
            t
        }
        
        if (Number(t) === 2) {
            data = {
                query: key,
                page_no: pageNo - 1,
                num_per_page: pageSize
            }
        }
        
        const result = await request({
            url,
            method: 'get',
            data,
            headers: {
                Referer: 'https://y.qq.com'
            }
        })
        
        if (Number(raw)) {
            return res.send(result)
        }
        
        // 下面是数据格式的美化
        const { keyword } = result.data;
        const keyMap = {
            0: 'song',
            2: '',
            7: 'lyric',
            8: 'album',
            12: 'mv',
            9: 'singer',
        }
        const searchResult = (keyMap[t] ? result.data[keyMap[t]] : result.data) || []
        const { list, curpage, curnum, totalnum, page_no, num_per_page, display_num } = searchResult
        
        switch (Number(t)) {
            case 2:
                pageNo = page_no + 1
                pageSize = num_per_page
                total = display_num
                break
            default:
                pageNo = curpage
                pageSize = curnum
                total = totalnum
                break
          }

          let arr = []
          list.map(item=>{
            arr.push({id:item.songmid, name:item.songname, artists:item.singer, fee:item.pay.payplay})
          })
          res.send({ status: 200, data: arr })
    } catch(e) {
        console.log(e)
        res.send({status:500})
    }
}


// 批量获取歌曲 url
exports.getUrls = async function (req, res, next) {
    try{
        const obj = { ...req.query, ...req.body }
        const { id } = obj
        const idArr = id.split(',')
        let count = 0
        const idStr = idArr.map((id) => `"${id}"`).join(',')
        let url = `https://u.y.qq.com/cgi-bin/musicu.fcg?-=getplaysongvkey2682247447678878&g_tk=5381&loginUin=956581739&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0&data=%7B"req_0"%3A%7B"module"%3A"vkey.GetVkeyServer"%2C"method"%3A"CgiGetVkey"%2C"param"%3A%7B"guid"%3A"2796982635"%2C"songmid"%3A%5B${idStr}%5D%2C"songtype"%3A%5B0%5D%2C"uin"%3A"956581739"%2C"loginflag"%3A1%2C"platform"%3A"20"%7D%7D%2C"comm"%3A%7B"uin"%3A956581739%2C"format"%3A"json"%2C"ct"%3A24%2C"cv"%3A0%7D%7D`
        let isOk = false;
        let result = null;

        const reqFun = async () => {
            count += 1;
            result = await request(url)
            if (result.req_0.data.testfile2g) {
                isOk = true
            }
        };

        while (!isOk && count < 10) {
            await reqFun()
        }

        // const domain = result.req_0.data.sip[0];
        const domain = 'http://124.89.197.18/amobile.music.tc.qq.com/'

        const data = {};
        result.req_0.data.midurlinfo.forEach((item) => {
            if (item.purl) {
                data[item.songmid] = `${domain}${item.purl}`
            }
        });

        res.send({ status: 200, data })
    } catch(e) {
        console.log(e)
        res.send({status:500})
    }
}


