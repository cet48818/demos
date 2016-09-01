var mongoose = require('mongoose');
var settings = require('../settings');

// mongoose.connect(settings.dbConnect);
// 定义schema(模型), 第一个参数是集合(表)的名称
var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    avatar: String
});
// 定义model
var userModel = mongoose.model('user', userSchema);
// 导出userModel
module.exports = userModel;

