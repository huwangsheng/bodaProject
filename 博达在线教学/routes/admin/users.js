
/**
 * Created by Shinelon on 2019-09-16.
 */
var router=require("koa-router")();

var DB=require("../../model/db");

const tools = require('../../model/tools.js');

router.get("/",async(ctx)=>{
    //从数据库拿到管理元数据
    var result=await DB.find("users",{});
    //进行渲染

    // console.log(result);
    await ctx.render('admin/users/list',{
        list:result
    })
})


router.get('/add',async (ctx)=>{

    await  ctx.render('admin/users/add');

})


router.post('/doAdd',async (ctx)=>{

    //1.获取表单提交的数据
    console.log(ctx.request.body);

    //2.验证表单数据是否合法

    //3.在数据库查询当前要增加的管理员是否存在

    //4.增加管理员


    var username=ctx.request.body.username;
    var password=ctx.request.body.password;
    var rpassword=ctx.request.body.rpassword;

    //!/^\w{4,20}/
    //邮箱验证
    //var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
    //var myReg=/^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
    if(!/^\w{4,20}/.test(username)){

        await ctx.render('admin/error',{
            message:'用户名不合法',
            redirect:ctx.state.__HOST__+'/admin/users/add'
        })

    }else if(password!=rpassword ||password.length>6){

        await ctx.render('admin/error',{
            message:'密码和确认密码不一致，或者密码长度小于6位',
            redirect:ctx.state.__HOST__+'/admin/user/add'
        })

    }else{

        //数据库查询当前管理员是否存在

        var findResult=await  DB.find('users',{"username":username});

        if(findResult.length>0){

            await  ctx.render('admin/error',{
                message:'管理员已经存在，请登录！',
                redirect:'/admin/users'
            })

        }else{

            //增加管理员
            var addResult =await DB.insert('users',{"username":username,"password":tools.md5(password),"status":1,"last_time":''});

            ctx.redirect('/admin/users');

        }
    }




})
router.get('/edit',async (ctx)=>{


    var id=ctx.query.id;

    var result=await  DB.find("users",{"_id":DB.getObjectId(id)});


    await ctx.render('admin/users/edit',{
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

                await ctx.render('admin/error',{
                    message:'两次密码不一致，请重新输入',
                    redirect:'/admin/manage/edit?id='+id
                })

            }else{

                //更新密码
                var updateResult=await DB.update('users',{"_id":DB.getObjectId(id)},{"password":tools.md5(password)});
                ctx.redirect('/admin/users');
            }
        }else{

            ctx.redirect('/admin/users');
        }

    }catch(err){
        await ctx.render('admin/error',{
            message:err,
            redirect:'/admin/users/edit?id='+id
        })

    }

})



router.get("/delete",async(ctx)=>{
    ctx.body="delete"
})



router.get("/find",async(ctx)=>{
    ctx.body="find"
})

module.exports=router.routes();