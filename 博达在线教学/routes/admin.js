
/**
 * Created by Shinelon on 2019-09-16.
 */
var router=require("koa-router")();

var url=require("url");

var login=require("./admin/login");
// var user=require("./admin/user");
var manage=require("./admin/manage");
var index=require("./admin/index");
var articlecate=require("./admin/articlecate");
var article=require("./admin/article");
var focus=require("./admin/focus");
var link=require("./admin/link");
var nav=require("./admin/nav");
var setting=require("./admin/setting");
var users=require("./admin/users");
var classes=require("./admin/classes");
const ueditor = require('koa2-ueditor');

//全局配置变量,权限判断
router.use(async(ctx,next)=>{

    ctx.state._HOST_="Http://"+ctx.header.host;
    var pathname=url.parse(ctx.request.url).pathname.substring(1);
    console.log(pathname.split("/"));
    var splitUrl=pathname.split("/");
    ctx.state.G={
        url:splitUrl,
        userinfo:ctx.session.userinfo,
        prevPage:ctx.request.headers["referer"]//记录上一页的地址
    }

    //登录继续向下匹配路由
    if(ctx.session.userinfo){
    await next();
}else {
    //没有登录就跳转到登录页面
    if(pathname=="admin/login"||pathname=="admin/login/doLogin" ||pathname=="admin/login/code"){
        await next();
    }else {
        ctx.redirect("/admin/login");
    }

    }
})

router.get("/",async(ctx)=>{
    await ctx.render("admin/index")
})
//后台的首页
router.use(index);
router.use("/login",login);
// router.use("/user",user);
router.use("/manage",manage);
router.use("/articlecate",articlecate);
router.use("/article",article);
router.use("/focus",focus);
router.use("/link",link);
router.use("/nav",nav);
router.use("/setting",setting);
router.use("/users",users);
router.use("/classes",classes);

//注意上传图片的路由   ueditor.config.js配置图片post的地址
router.all('/editor/controller', ueditor(['public', {
    "imageAllowFiles": [".png", ".jpg", ".jpeg"],
    "imagePathFormat": "/upload/ueditor/image/{yyyy}{mm}{dd}/{filename}"  // 保存为原文件名
}]))

module.exports=router.routes();