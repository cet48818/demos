# 生成项目

## 安装express代码生成器
> npm install express-generator -g

## 生成项目
> express --hbs myblog

## 进入目录并安装依赖
> cd myblog && npm install

## 设置环境变量并启动服务器
> SET DEBUG=myblog:* & npm start
> SET DEBUG=myblog:* & nodemon ./bin/www

## 通过浏览器访问
http://localhost:3000

# 提交代码

## 初始化仓库
> git init

## 添加文件到暂存区
> git add -A

## 提交到历史区
> git commit -m"init"

## 添加远程仓库
> git remote add origin https://github.com/...

## 推送到远程仓库
> git push origin master

# 启动mongodb
> mongod --dbpath=D:\Mongodb\data\db

