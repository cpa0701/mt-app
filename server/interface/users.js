/**
 * Create by chenpengan on 2019/8/7
 */
import Router from 'koa-router'
import Redis from 'koa-redis'
import nodeMailer from 'nodemailer'
import User from '../dbs/models/users'
import Email from '../dbs/config'
import Passport from './utils/passport'
import axios from './utils/axios'

const router = new Router({
  prefix: '/users'
})

const Store = new Redis().client
// 注册
router.post('/signup', async (ctx) => {
  const {
    username,
    password,
    email,
    code
  } = ctx.request.body
  if (code) {
    const saveCode = await Store.hget(`nodemail:${username}`, 'code')
    const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
    if (code === saveCode) {
      if (new Date().getTime() - saveExpire > 0) {
        ctx.body = {
          code: -1,
          msg: '验证码已过期，请重新尝试'
        }
        return false
      }
    } else {
      ctx.body = {
        code: -1,
        msg: '请填写正确的验证码'
      }
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '请填写验证码'
    }
  }
  const user = await User.find({
    username
  })
  if (user.length) {
    ctx.body = {
      code: -1,
      msg: '已被注册'
    }
    return false
  }
  const nuser = await User.create({
    username,
    password,
    email
  })
  if (nuser) {
    const res = await axios.post('/user/signin', {
      username,
      password
    })
    if (res.data && res.data.code === 0) {
      ctx.body = {
        code: 0,
        msg: '注册成功',
        user: res.data.user
      }
    } else {
      ctx.body = {
        code: -1,
        msg: 'error'
      }
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '注册失败'
    }
  }
})
// 登录
router.post('/signin', (ctx, next) => {
  return Passport.authenticate('local', function (err, user, info, status) {
    if (err) {
      ctx.body = {
        code: -1,
        msg: err
      }
    } else if (user) {
      ctx.body = {
        code: 0,
        msg: '登录成功'
      }
      return ctx.login(user)
    } else {
      ctx.body = {
        code: 1,
        msg: info
      }
    }
  })(ctx, next)
})
// 邮件验证
router.post('/verify', async (ctx, next) => {
  const username = ctx.request.body.username
  const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
  if (saveExpire && new Date().getTime() - saveExpire < 0) {
    ctx.body = {
      code: -1,
      msg: '验证请求过于频繁，1分钟内1次'
    }
    return false
  }
  const transporter = nodeMailer.createTransport({
    host: Email.smtp.host,
    port: 587,
    secure: false,
    auth: {
      user: Email.smtp.user,
      pass: Email.smtp.pass
    }
  })
  const ko = {
    code: Email.smtp.code(),
    expire: Email.smtp.expire(),
    email: ctx.request.body.email,
    user: ctx.request.body.username
  }
  const mailOptions = {
    from: `'认证邮件'<${Email.smtp.user}>`,
    to: ko.email,
    subject: '《高仿美团全栈实战》注册码',
    html: `您在《高仿美团全栈实战》课程中注册，您的邀请码是${ko.code}`
  }
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('error')
    } else {
      Store.hmset(`nodemail:${ko.user}`, 'code', ko.code, 'expire', ko.expire, 'email', ko.email)
    }
  })
  ctx.body = {
    code: 0,
    msg: '验证码已发送，可能会有延时，有效期1分钟'
  }
})
// 退出登录
router.get('/exit', async (ctx, next) => {
  await ctx.logout()
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: 0
    }
  } else {
    ctx.body = {
      code: -1
    }
  }
})
// 获取用户名
router.get('/getUser', (ctx) => {
  if (ctx.isAuthenticated()) {
    const { username, email } = ctx.session.passport.user
    ctx.body = {
      user: username,
      email
    }
  } else {
    ctx.body = {
      user: '',
      email: ''
    }
  }
})
export default router
