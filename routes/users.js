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
// 根据id查询用户信息 id 
router.get("/user",(req,res)=>{
    if(req.session.isLogin == undefined){
        res.send({code:200,msg:"请去登录"})
        return
    }
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
//  新增用户  name + phone + password = form-data
router.post("/addUser",multipartMiddleware,(req,res)=>{
    var data = req.body;
    var $name = data.name;
    var $phone = data.phone;
    var $password = data.password;
    if($name && $phone && $password){ 
    if( $name.length > 8 || $name.length == 0){res.send({code:405,msg:"name格式错误"});return}
    if( $phone.length != 11){res.send({code:405,msg:"phone格式错误"});return}
    if( $password.length == 0 ||$password.length > 18 ){res.send({code:405,msg:"密码格式错误"});return}
    var sql = `insert into user (name,password,phone) values ("?","?",?);`;
    pool.query(sql,[$name,$password,$phone],(err,result)=>{
        if(err) throw err;
        res.send({code:200,msg:"ok",data:req})
    })  
   }else{
    res.send({code:405,msg:"参数不全",$date});
   }
})
router.get("/isOk",(req,res)=>{
    if(req.session.isLogin){
        res.send({code:1,msg:"已登录"})
    }else{
        res.send({code:0,msg:"请登录"})
    }
})
router.get("/t",(req,res)=>{
    req.session.isLogin = undefined;
    res.send("退出登录")
})
// 登录 id + password => form-data
router.post("/login",multipartMiddleware,(req,res)=>{
    var data = req.body;
    var $id = data.id;
    var $password = data.password;
    if($id && $password){
        if(isNaN(Number($id))){res.send({code:405,msg:"账号不存在"});return}
         var sql = `select password from user where id = ? ; `;
         pool.query(sql,[$id],(err,result)=>{
            if(err) throw err;
            if(result.length>0){
                var $result = JSON.stringify(result);
                    $result = JSON.parse($result)
                if(eval(result[0].password) == $password){
                    req.session.isLogin = true;
                    res.send({code:200,msg:"登陆成功"})
                    
                }else{
                    res.send({code:405,msg:"密码错误"})
                }
            }else{
                res.send({code:405,msg:"账号不存在"})
                return
            }
         });
    }else{
        res.send({code:405,msg:"参数缺失"})
        return
    }
})
// 修改密码 id + password => form-data
router.post("/updatePassword",multipartMiddleware,(req,res)=>{
    var $password = req.body.password;
    var $id = req.body.id;
    if($password && $id){
        if($password.length>18 || $password.length == 0){res.send({code:501,msg:"参数有误"});return}
        var sql =`update user set password = "?" where id = ? ; `;
        pool.query(sql,[$password,$id],(err,result)=>{
           if (err) throw err;
           if(result.affectedRows>0){
               res.send({code:200,msg:"ok"})
           }else{
            res.send({code:501,msg:"参数有误"})
           }
        })
    }else{
        res.send({code:501,msg:"参数有误"})
    }
})
// 修改手机号 id + phone => form-data
router.post("/updatePhone",multipartMiddleware,(req,res)=>{
    var $phone = req.body.phone;
    var $id = req.body.id;
    if($phone && $id){
        if($phone.length != 11){res.send({code:501,msg:"参数有误"});return}
        var sql =`update user set phone = ? where id = ? ; `;
        pool.query(sql,[$phone,$id],(err,result)=>{
           if (err) throw err;
           if(result.affectedRows>0){
               res.send({code:200,msg:"ok"})
           }else{
            res.send({code:501,msg:"参数有误"})
           }
        })
    }else{
        res.send({code:501,msg:"参数有误"})
    }
})

// 修改数据 name + gender + birth  + email + personalSay + personalState + id  => form-data
router.post("/updateDate",multipartMiddleware,(req,res)=>{
    var data = req.body;
    var $name = data.name;
    var $gender = data.gender;
    var $birth = new Date(data.birth)
    var $email = data.email;
    var $personalSay = data.personalSay;
    var $personalState = data.personalState;
    var $id = data.id;
    if($name && $gender && $birth && $email && $personalSay && $personalState && $id){ 
        if($name.length == 0 || $name.length > 8 ){res.send({code:501,msg:"name有误"});return}
        if($gender < 0 || $gender > 1 ){res.send({code:501,msg:"gender有误",$gender});return}
        if($birth == "Invalid Date"){res.send({code:501,msg:"date有误"});return}
        if($email.length == 0 || $email.length > 50 ){res.send({code:501,msg:"email有误"});return}
        if($personalSay.length == 0 || $personalSay.length > 101 ){res.send({code:501,msg:"say有误"});return}
        if($personalState.length == 0 || $personalState.length > 101 ){res.send({code:501,msg:"state有误"});return}
        if($id.length != 6 ){res.send({code:501,msg:"id有误"});return}
        var sql =`update user set name="?",gender=?,birth=?,email="?",personalSay="?",personalState="?"  where id = ? ; `;
        pool.query(sql,[$name,$gender,$birth,$email,$personalSay,$personalState,$id],(err,result)=>{
           if (err) throw err;
           if(result.affectedRows>0){
               res.send({code:200,msg:"ok",data})
           }else{
            res.send({code:501,msg:"参数有误"})
           }
        })
    }else{
        res.send({code:501,msg:"参数缺失"})
    }
})
//路由器导出
module.exports=router;