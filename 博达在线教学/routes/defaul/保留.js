/**
 * Created by Administrator on 2018/3/20 0020.
 */
const router = require('koa-router')();

const tools = require('../../model/tools.js');

const DB = require('../../model/db.js');

//验证码模块
var svgCaptcha = require('svg-captcha');


//post
router.post('/doLogin',async (ctx)=>{
    //console.log(ctx.request.body);
    var username=ctx.request.body.username;

    var password=tools.md5(ctx.request.body.password);
    console.log(password);
    var result=await DB.find('users',{"username":username,"password":password});
    if(result.length>0){
        //console.log(result);
        ctx.redirect('/');
    }else{
        ctx.body="<script>alert('登录失败,请重新登录');location.href='/login'</script>";
    }

})

router.post('/doAdd',async (ctx)=>{

    //1.获取表单提交的数据    console.log(ctx.request.body);

    //2.验证表单数据是否合法

    //3.在数据库查询当前要增加的管理员是否存在

    //4.增加管理员


    var username=ctx.request.body.username;
    var password=ctx.request.body.password;
    var rpassword=ctx.request.body.rpassword;
    console.log(username);
    console.log(password);
    console.log(rpassword);
    //!/^\w{4,20}/
    //邮箱验证
    //var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
    //var myReg=/^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
    if(!/^\w{4,20}/.test(username)){

        await ctx.render('admin/error',{
            message:'用户名不合法',
            redirect:"/register"
        })

    }else if(password!=rpassword ||password.length>6){

        await ctx.render('defaul/error',{
            message:'密码和确认密码不一致，或者密码长度小于6位',
            redirect:"/register"
        })

    }else{

        //数据库查询当前管理员是否存在

        var findResult=await  DB.find('users',{"username":username});

        if(findResult.length>0){

            await  ctx.render('admin/error',{
                message:'管理员已经存在，请登录！',
                redirect:'/login'
            })

        }else{

            //增加管理员
            var addResult =await DB.insert('users',{"username":username,"password":tools.md5(password),"status":1,"last_time":''});

            ctx.redirect('/login');

        }
    }




})




module.exports=router.routes();/**
 * Created by Shinelon on 2019-10-08.
 */
