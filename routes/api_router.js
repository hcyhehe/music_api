const express = require('express')
const router = express.Router()
const check = require('../middlewares/check')
const net163 = require('../controllers/api/net163')
const qq = require('../controllers/api/qq')


router.get('/net163/topList', net163.topList)
router.get('/net163/search', net163.search)

router.get('/qq/search', qq.search)
router.get('/qq/getUrls', qq.getUrls)


module.exports = router
