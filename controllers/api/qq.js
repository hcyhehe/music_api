const moment = require('moment')
const getSearchByKey = require('../../util/qq/getSearchByKey')
const UCommon = require('../../util/qq/UCommon')
const { _guid } = require('../../util/qq/config')


exports.search = async function (req, res, next) {
    try{
        let { keywords: w, limit: n, page: p, catZhida } = req.query
        let data = {
            method: 'get',
            params: {
                w,
                n: +n || 50,
                p: +p || 1,
                catZhida: +catZhida || 1,
            },
            options: {}
        }
        let result = await getSearchByKey(data)
        if(result.body.response.code==0){
            let list = result.body.response.data.song.list
            let arr = []
            list.map(item=>{
                arr.push({id:item.id, name:item.name, artists:item.singer, file:item.file })
            })
            res.send({status:200, data:arr})
        } else {
            res.send({status:500})
        }
    } catch(e) {
        console.log(e)
        res.send({status:500})
    }
}


exports.getVKey = async function (req, res, next) {
    try{
        let songmid = req.query.songmid + ''
        let guid = _guid ? _guid + '' : '1429839143'
        let data = {
            req: {
                module: "CDN.SrfCdnDispatchServer",
                method: "GetCdnDispatch",
                param: {
                    guid,
                    calltype: 0,
                    userip: ""
                }
            },
            req_0: {
                module: "vkey.GetVkeyServer",
                method: "CgiGetVkey",
                param: {
                    guid,
                    songmid: [songmid],
                    songtype: [0],
                    uin: "0",
                    loginflag: 1,
                    platform: "20"
                }
            },
            comm: {
                uin: 0,
                format: "json",
                ct: 24,
                cv: 0
            }
        }
        let params = Object.assign({
            format: 'json',
            data: JSON.stringify(data),
        })
        let props = {
            method: 'get',
            params,
            options: {},
        }
        await UCommon(props).then((result) => {
            let response = result.data
            let playLists = []
            let req_0 = response.req_0.data
            req_0.sip.map(sipURL => {
                let purl = req_0.midurlinfo[0].purl
                let URI = `${sipURL}${purl}`
                playLists.push(URI);
            })
            response.playLists = playLists
            response.guid = guid
            res.send(response)
        }).catch(error => {
            console.log(`error`, error)
        })
    } catch(e) {
        console.log(e)
        res.send({status:500})
    }
}


//客户端播放
//http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/
//C4000045ydn329dklt.m4a?
//guid=3851519650
//&vkey=C9EC69CDC1046C423D00C9A69D8B3E0E7654FD6A50F37E394C4362A11C2382CFE1B0D0655F9E47AF011D627FD1EE527D42C6AF49C59E8746
//&uin=0
//&fromtag=38

