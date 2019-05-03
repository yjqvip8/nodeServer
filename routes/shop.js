const express=require('express');
const multipart = require('connect-multiparty');
const session = require("express-session")

const pool = require("../pool");
var router=express.Router();
var multipartMiddleware = multipart();

router.use(session({
    name: 'session-name', // 这里是cookie的name，默认是connect.sid
    secret: 'my_session_secret', // 建议使用 128 个字符的随机字符串
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 1000, httpOnly: true }
}));

router.get("/",(req,res)=>{
    res.send("欢迎来到商品列表")
})

module.exports=router;