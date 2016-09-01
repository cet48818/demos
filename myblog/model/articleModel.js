var mongoose = require('mongoose');
var settings = require('../settings');

// mongoose.connect(settings.dbConnect);

var articleSchema = new mongoose.Schema({
    title: String,
    content: String,
    img: String,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'user'}, // 类型是主键类型, 引用的模型是user
    createAt: {type: Date, default: Date.now}
});
// 定义model
var articleModel = mongoose.model('article', articleSchema);
// 导出userModel
module.exports = articleModel;

