const express=require('express');
//创建路由器
// 引入mysql连接池
const pool = require("../pool");
var router=express.Router();

router.get("/user",(req,res)=>{
    var sql = ` select * from user where id = ? ; `;
    var $id = req.query.id;
    pool.query(sql,[$id],(err,result)=>{
        if(err) throw err;
        //如何判断插入成功————affectedRows
        if(result.length){
            res.send({code:200,msg:"数据查询成功",data:result})
        }else{
            res.send({code:200,msg:"参数有误",data:result})
        }  
      });  
})

//路由器导出
module.exports=router;