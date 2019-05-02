const express=require('express');
//创建路由器
var router=express.Router();

router.get("/list",(req,res)=>{
    console.log(req.query)
    res.send(req.query)
})

//路由器导出
module.exports=router;