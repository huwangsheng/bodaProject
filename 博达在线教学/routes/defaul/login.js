/**
 * Created by Administrator on 2018/3/20 0020.
 */
const router = require('koa-router')();

const tools = require('../../model/tools.js');

const DB = require('../../model/db.js');

//验证码模块
var svgCaptcha = require('svg-captcha');

//post
// router.post('/doLogin',async (ctx)=>{
//     //console.log(ctx.request.body);
//     var username=ctx.request.body.username;
//
//     var password=tools.md5(ctx.request.body.password);
//     console.log(password);
//     var result=await DB.find('users',{"username":username,"password":password});
//     if(result.length>0){
//         //console.log(result);
//         ctx.redirect('/');
//     }else{
//         ctx.body="<script>alert('登录失败,请重新登录');location.href='/login'</script>";
//     }
//
// })


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
// 后台也要验证用户信息
        var result=await DB.find('users',{"username":username,"password":password});
        console.log(password);
        if(result.length>0){
            console.log(result);
            ctx.session.userinfo=result[0];
            //更新用户表，改变用户时间
            DB.update("users",{"_id:":DB.getObjectId(result[0]._id)},{
                last_time :new Date()
            })
            ctx.redirect("/");
        } else {
            ctx.render("defaul/error",{
                message:"用户名或者密码错误",
                redirect:"/login"
            })
        }



});



// router.post('/doAdd',async (ctx)=>{
//     console.log("用户注册");
//     console.log(ctx.request.body);
//     //1.获取表单提交的数据
//
//     //2.验证表单数据是否合法
//
//     //3.在数据库查询当前要增加的用户是否存在
//
//     //4.增加用户
//
//     var username=ctx.request.body.username;
//     var password=ctx.request.body.password;
//     var rpassword=ctx.request.body.rpassword;
//     var gender=ctx.request.body.gender;
//     var favor=ctx.request.body.favor;
//     var intername=ctx.request.body.intername;
//     var age=ctx.request.body.age;
//     var birthday=ctx.request.body.birthday;
//     var Email=ctx.request.body.Email;
//     var phone=ctx.request.body.phone;
//     var occupation=ctx.request.body.occupation;
//     if(password!=rpassword ||password.length<6){
//
//         await ctx.render('defaul/error',{
//             message:'密码和确认密码不一致，或者密码长度小于6位',
//             redirect:"/register"
//         })
//
//     }else{
//
//         //数据库查询当前用户是否存在
//
//         var findResult=await  DB.find('users',{"username":username});
//
//         if(findResult.length>0){
//
//             await  ctx.render('dafaul/error',{
//                 message:'用户已经存在，请登录！',
//                 redirect:'/login'
//             })
//
//         }else{
//             if(gender==""||favor==""||intername==""||age==""||birthday==""||Email==""||phone==""||occupation==""){
//                 await ctx.render('defaul/error',{
//                     message:'请填写信息完整',
//                     redirect:"/register"
//                 })
//             }else {
//                 if(phone.length<11){
//                     await ctx.render('defaul/error',{
//                         message:'电话号码格式不正确或者位数不满11位',
//                         redirect:"/register"
//                     })
//                 }else {
//                     //增加用户
//                     var addResult =await DB.insert('users',{"username":username,"password":tools.md5(password),"status":1,"last_time":'',"gender":gender,"favor":favor,"intername":intername,"age":age,"birthday":birthday,"Email":Email,"phone":phone,"occupation":occupation});
//
//                     // ctx.redirect('/login');
//                 }
//
//
//             }
//
//
//
//         }
//     }
// })


router.get('/edit',async (ctx)=>{


    var id=ctx.query.id;

    var result=await  DB.find("admin",{"_id":DB.getObjectId(id)});


    await ctx.render('admin/manage/edit',{
        list:result[0]
    })

})

router.post('/doEdit',async (ctx)=>{

    try{
        var id=ctx.request.body.id;
        var username=ctx.request.body.username;
        var password=ctx.request.body.password;
        var rpassword=ctx.request.body.rpassword;

        if(password!=''){
            if(password!=rpassword ||password.length>6){

                await ctx.render('defaul/error',{
                    message:'两次密码不一致，请重新输入',
                    redirect:'/admin/manage/edit?id='+id
                })

            }else{

                //更新密码
                var updateResult=await DB.update('users',{"_id":DB.getObjectId(id)},{"password":tools.md5(password)});
                ctx.redirect('/admin/manage');
            }
        }else{

            ctx.redirect('/admin/manage');
        }

    }catch(err){
        await ctx.render('admin/error',{
            message:err,
            redirect:'/admin/manage/edit?id='+id
        })

    }

})

//退出登陆，把userinfo清空，并返回首页
router.get("/loginOut",async(ctx)=>{
    ctx.session.userinfo=null;
    ctx.redirect("/")
})



module.exports=router.routes();
