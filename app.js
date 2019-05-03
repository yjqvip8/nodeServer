const express = require("express");
const users = require("./routes/users");
const shops = require("./routes/shop")
const bodyParser = require("body-parser")

var appServer = express();
appServer.listen(8080,()=>{console.log("服务器正在运行...")})

appServer.use(bodyParser.urlencoded({
    extended: false
 }));
appServer.use('/users',users);
appServer.use('/shops',shops);
// session


// 托管静态资源
appServer.use(express.static("./public"))
