var express = require('express');
var router = express.Router(); // 路由的实例
var multer = require('multer');
var path = require('path');
var articleModel = require('../model/articleModel');
var markdown = require('markdown').markdown;

// 指定文件元素的存储方式
var storage = multer.diskStorage({
  // 保存文件的路径
  destination: function (req, file, cb) {
    cb(null, __dirname + '/../public/images');  // http://stackoverflow.com/questions/11675453/jade-loading-templates-from-different-directories
  },
  // 指定保存的文件名
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
var upload = multer({ storage: storage });

router.get('/list/:pageNum/:pageSize', function(req, res) {
    var pageNum = +req.params.pageNum;
    var pageSize = +req.params.pageSize;
    var query = {};
    if (req.query.keyword && req.query.keyword.trim()) {
      req.session.keyword = req.query.keyword;
      query['title'] = new RegExp(req.query.keyword, 'i'); // 查询条件
    } else {
      req.session.keyword = null;
    }
    articleModel.count(query, function(err, count) { // 得到总条数
      articleModel
        .find(query)
        .skip((pageNum-1)*pageSize)
        .sort({createAt:-1})
        .limit(pageSize)
        .populate('user')
        .exec(function(err, articles) {
          articles.forEach(function(article) {
          article.content = markdown.toHTML(article.content);
      });
      var totalPage = Math.ceil(count/pageSize);
      var pageArr = [];
      for (var i=1;i<=totalPage;i++) {
        pageArr.push(i);
      }
      // var flag = {flagPre: true, flagNext: true}
      // if (pageNum <= 1) {
      //   flagPre = false;
      // }
      // if (pageNum >= totalPage) {
      //   flagNext = false;
      // }
      res.render('index', { articles: articles, 
                            title: '我的博客', 
                            keyword: req.session.keyword, 
                            user: req.session.user,
                            pageNum: pageNum,
                            pageSize: pageSize,
                            totalPageNum: totalPage,
                            totalPage: pageArr,
                            
      });
        });
    });
  //   articleModel.find(query).populate('user').exec(function(err, articles) {
  //   if (err) {
  //     req.flash('error', error);
  //     return res.redirect('/');
  //   }
  //   articles.forEach(function(article) {
  //       article.content = markdown.toHTML(article.content);
  //   });
  //   res.render('index', { articles: articles, title: '我的博客', keyword: req.session.keyword, user: req.session.user});
  // });
});

// 请求一个空白的发表文章页面
router.get('/add', function(req, res, next) {
  res.render('article/add', {article: {}});
});
// 提交文章数据 里面放置的是文件域的名字
router.post('/add', upload.single('img'), function(req, res, next) {
  var article = req.body;
  var _id = article._id;
  if (_id) { // 有值表示修改
    var set = {
      title: article.title,
      content: article.content,
    };
    if (req.file) { // 如果新上传文件, 那么更新img字段
      set.img = '/images/' + req.file.filename;
    }
    articleModel.update({_id:_id}, {$set: set}, function(err, article) {
      if (err) {
        req.flash('error', '更新文章失败');
        return res.redirect('back'); // 返回到上个页面. 类似于$_SERVER['HTTP_REFERER'];
      } else {
        req.flash('success', '更新文章成功');
        return res.redirect('/');
      }
    });
  } else { // 表示添加
    if (req.file) {
      article.img = '/images/' + req.file.filename;
    }
    delete article._id;
    var user = req.session.user;
    article.user = user; // 用户
    console.log(article);
    articleModel.create(article, function(err, article) {
      if (err) {
        console.log(err)
        req.flash('error', '发表文章失败');
        return res.redirect('back'); // 返回到上个页面. 类似于$_SERVER['HTTP_REFERER'];
      } else {
        req.flash('success', '发表文章成功');
        return res.redirect('/');
      }
    });
  }
});

// 增加文章的详情页
router.get('/detail/:id', function(req, res) {
  articleModel.findById(req.params.id, function(err, article) {
    article.content = markdown.toHTML(article.content);
    res.render('article/detail', {article: article});
  });
});

// 删除
router.get('/delete/:id', function(req, res) {
  articleModel.remove({_id: req.params.id}, function(err, result) {
    if (err) {
      req.flash('error', '删除失败');
      res.redirect('back');
    } else {
      req.flash('success', '删除成功');
      res.redirect('/');
    }
  });
});

// 跳转到修改页
router.get('/update/:id', function(req, res) {
  articleModel.findById(req.params.id, function(err, article) {
    // article.content = markdown.toHTML(article.content);
    res.render('article/add', {article: article});
  });
});

module.exports = router;
