
/**
 * Created by Shinelon on 2019-09-16.
 */
const router=require("koa-router")();
const tools = require('../../model/tools.js');
//验证码模块
var svgCaptcha = require('svg-captcha');
const DB=require("../../model/db");
const config=require("../../model/config");

router.get("/",async(ctx)=>{
    await ctx.render("admin/login")
})

var cs
//doLogin
router.post("/doLogin",async(ctx)=>{
   console.log(ctx.request.body);
 //    1.拿到用户登录数据之后和数据库进行匹配

    let username=ctx.request.body.username;

    let password=tools.md5(ctx.request.body.password);
    console.log(password)
    //2.验证用户名是否合法
    //接收前端的验证数据
    let code=ctx.request.body.code;
    console.log(code);
    console.log(ctx.session.code);
    //去数据库进行匹配
    if(code.toLocaleLowerCase()==cs.toLocaleLowerCase()){
// 后台也要验证用户信息
      var result=await DB.find('admin',{"username":username,"password":password});
        console.log(password);

        if(result.length>0){
            console.log(result);
            ctx.session.userinfo=result[0];
            //更新用户表，改变用户时间
            DB.update("admin",{"_id:":DB.getObjectId(result[0]._id)},{
                last_time :new Date()
            })
            ctx.redirect("/admin");
        } else {
            ctx.render("admin/error",{
                message:"用户名或者密码错误",
                redirect:"/admin/login"
            })
        }
    }else{
        ctx.render("admin/error",{
            message:"验证失败",
            redirect:"/admin/login"
        })
    }

});

/*验证码*/
router.get('/code',async (ctx)=>{
   const captcha = svgCaptcha.create({
        size:4,
        fontSize: 50,
        width: 120,
        height:34,
        background:"#cc9966"
    });
    console.log(captcha.text);

    //保存生成的验证码
   cs=captcha.text;
    console.log(ctx.session)
    //设置响应头
    ctx.response.type = 'image/svg+xml';
    ctx.body=captcha.data;
})


//退出登陆，把userinfo清空，并返回首页
router.get("/loginOut",async(ctx)=>{
    ctx.session.userinfo=null;
    ctx.redirect(ctx.state._HOST_+"/admin/login")
})


module.exports=router.routes()