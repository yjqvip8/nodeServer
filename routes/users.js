const express=require('express');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

//创建路由器
// 引入mysql连接池
const pool = require("../pool");
var router=express.Router();

// 根据id查询用户信息
router.get("/user",(req,res)=>{
    var sql = ` select * from user where id = ? ; `;
    var $id = req.query.id;
    pool.query(sql,[$id],(err,result)=>{
        if(err) throw err;
        //如何判断插入成功————affectedRows
        if(result.length){
            res.send({code:200,msg:"ok",data:result})
        }else{
            res.send({code:200,msg:"参数有误",data:result})
        }  
      });  
})
// 得到用户数据 新增用户
router.post("/addUser",multipartMiddleware,(req,res)=>{
    var data = req.body;
    
    var $name = data.name;
    var $phone = data.phone;
    var $data = {$name,$phone}
    if($name && $phone){
        res.send({code:200,msg:"ok",data:$data})
        // mysql进行新增用户操作
        // todo
    }else{
        res.send({code:405,msg:"参数缺失"})
        return
    }
})
//路由器导出
module.exports=router;