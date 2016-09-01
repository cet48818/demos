var express = require('express');
var userModel = require('../model/userModel');
var validate = require('../middle/index.js');
var crypto = require('crypto');
// 生成路由实例
var router = express.Router();

/* GET users listing. */
// 二级目录
// router.get('/', function(req, res) {
//     res.send('respond with a resource');
// });
/**
 * 用户注册, 当用户通过get方法请求/users/reg时, 执行此回调
 */
router.get('/reg', validate.checkNotLogin, function (req, res) {
    res.render('user/reg', {title: '注册'});
});

/**
 * 当填写用户注册信息提交时的处理
 */
router.post('/reg', validate.checkNotLogin, function (req, res) {
    var user = req.body;
    // 通过email把头像算出来
    user.avatar = 'http://en.gravatar.com/avatar/'+ md5(user.email, null);
    user.password = md5(user.password);
    userModel.create(user, function(err, doc) {
        if (err) {
            req.flash('error', err);
            res.redirect('back'); // 返回到上个页面. 类似于$_SERVER['HTTP_REFERER'];
        } else {
            // 自动登陆
            // 把保存之后的用户方知道此用户会话的user属性上;
            req.session.user = doc;
            // 增加成功的提示
            req.flash('success', '注册成功');
            res.redirect('/');
        }
    });
});

/**
 * 显示用户登录表单
 */
router.get('/login', validate.checkNotLogin, function (req, res) {
    res.render('user/login', {title: '登录'});
});

/**
 * 当填写用户登录信息提交时的处理
 */
router.post('/login', validate.checkNotLogin, function (req, res) {
    var user = req.body;
    user.password = md5(user.password);
    userModel.findOne(user, function(err, doc) {
        if (err) {
            req.flash('error', err);
            return res.redirect('back');
        } else {
            req.session.user = doc;
            req.flash('success', '登陆成功');
            return res.redirect('/');
        }
    });
});
/**
 * 退出登陆
 */
router.get('/logout', validate.checkLogin, function (req, res) {
    req.session.user = null;
    res.redirect('/');
});

module.exports = router;

function md5(str, salt) {
    var s = crypto.createHmac('md5', salt='myblog')
            .update(str)
            .digest('hex');
}