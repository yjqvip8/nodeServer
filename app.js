const express = require("express");
const news = require("./routes/news");
const bodyParser = require("body-parser")
var appServer = express();
appServer.listen(8080,()=>{console.log("服务器正在运行...")})

appServer.use(bodyParser.urlencoded({
    extended: false
 }));
appServer.use('/news',news);

// 托管静态资源
appServer.use(express.static("./public"))
