
/**
 * Created by Shinelon on 2019-09-16.
 */
var router=require("koa-router")();

var url=require("url");

const ueditor = require('koa2-ueditor');

var login=require("./defaul/login");

//配置中间件 获取url的地址
router.use(async (ctx,next)=>{
    //console.log(ctx.request.header.host);

    //模板引擎配置全局的变量
    ctx.state.__HOST__='http://'+ctx.request.header.host;
    console.log(ctx.request.url);  //   /admin/user

    //  /admin/login/code?t=709.0399997523431
    var pathname=url.parse(ctx.request.url).pathname;

    //权限判断
    if(ctx.session.userinfo){
        await  next();
    }else{  //没有登录跳转到登录页面
        if(pathname=='/defaul/login' || pathname=='/defaul/login/doLogin'){
            await  next();
        }else{
            ctx.redirect('/login');
        }
    }


})



router.get("/",async(ctx)=>{
    await ctx.render("defaul/index")
})




//后台的首页
router.use("/login",login);



module.exports=router.routes();