const router = require('express').Router()
const axios = require('axios')

const baseUrl = 'http://cnodejs.org/api/v1'

router.post('/login', function (req, res, next) {
  console.log(999)
  axios.post(`${baseUrl}/accesstoken`, {
    accesstoken: req.body.accessToken
  }).then(resp => {
    if (resp.status === 200 && resp.data.success) {
      // 接口返回的数据保存到session中
      req.session.user = {
        accessToken: req.body.accessToken,
        loginName: resp.data.loginname,
        id: resp.data.id,
        avatarUrl: resp.data.avatar_url
      }
      // 成功正确的话给浏览器端发送数据
      res.json({
        success: true,
        data: resp.data
      })
    }
  }).catch(err => {
    if (err.response) {
      res.json({
        success: false,
        data: err.response.data
      })
    } else {
      // 否则抛给全局错误处理器去处理
      next(err)
    }
  })
})
module.exports = router
