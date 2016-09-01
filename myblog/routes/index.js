var express = require('express');
var articleModel = require('../model/articleModel');
var markdown = require('markdown').markdown;
var router = express.Router(); // 路由的实例

/* GET home page. */
router.get('/', function(req, res, next) {
  // 读取文章列表
  // 先配置参数, 再执行查询
  // 查出来的user是ID, 需要通过populate转对象
  // articleModel.find().populate('user').exec....
  // articleModel.find().populate('user').exec(function(err, articles) {
  //   if (err) {
  //     req.flash('error', error);
  //     return res.redirect('/');
  //   }
  //   articles.forEach(function(article) {
  //       article.content = markdown.toHTML(article.content);
  //   });
  //   res.render('index', { articles: articles, title: '我的博客', user: req.session.user});
  // });
  
  res.redirect('/articles/list/1/2');
});

module.exports = router;
