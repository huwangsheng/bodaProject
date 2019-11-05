/**
 * Created by Shinelon on 2019-09-16.
 */
var Koa=require("koa");
const session = require('koa-session');
const render = require('koa-art-template');
//MD5加密
var md5 = require('md5');
var bodyParser = require('koa-bodyparser');
path=require('path');
var router=require("koa-router")();
var serve = require('koa-static');
var app=new Koa();

//格式化时间模块
var sd = require('silly-datetime');
//配置放回json的中间件
const jsonp = require('koa-jsonp')
//配置post提交数据的中间件
app.use(bodyParser());

//配置session的中间件

app.keys = ['some secret hurr'];
const CONFIG = {
    key: 'koa:sess',
    maxAge: 860000,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: true,   /*每次请求都重新设置session*/
    renew: false,
};
app.use(session(CONFIG, app));

//配置模板引擎
render(app, {
    root: path.join(__dirname, 'views'),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production',
    dateFormat:dateFormat=function(value){
        return sd.format(new Date(value), 'YYYY-MM-DD HH:mm');} /*扩展模板里面的方法*/
});

//引入三大模块模块
var index=require("./routes/index");
var api=require("./routes/api");
var admin=require("./routes/admin");
var defaul=require("./routes/defaul");

router.use("/admin",admin);
router.use("/api",api);
//注意这里不能写成router.use("/",index);如果这样的话就只能找到index首页，其他页面显示不了
router.use(index);
router.use("/defaul",defaul);
app.use(serve(__dirname + '/public'));
//配置中间件
app.use(serve("."));


//启动路由
app.use(router.routes());
app.use(router.allowedMethods());




app.listen(8080);