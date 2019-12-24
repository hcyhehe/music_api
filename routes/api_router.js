const express = require('express')
const router = express.Router()
const check = require('../middlewares/check')
const net163 = require('../controllers/api/net163')

router.get('/net163/search', net163.search)



module.exports = router
