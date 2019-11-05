/**
 * Created by Administrator on 2018/3/20 0020.
 */
var router = require('koa-router')();

var DB=require("../model/db");

var Tools=require("../model/tools");
var url=require('url');
var config=require("../model/config");


router.use(async(ctx,next)=>{

    ctx.state._HOST_="Http://"+ctx.request.header.host;

    await next();


})
//配置中间件 获取url的地址
router.use(async (ctx,next)=>{
     console.log(ctx.request.header.host);
    var pathname=url.parse(ctx.request.url).pathname;

    //导航条的数据(首页导航数据 classes)
    var classesResult=await DB.find('classes',{$or:[{'status':1},{'status':'1'}]},{},{

        sortJson:{'sort':1}
    })
    //获取系统信息setting
    var setting=await DB.find('setting',{});
    //导航条的数据（课程导航分类  nav）
    var navResult=await DB.find('nav',{$or:[{'status':1},{'status':'1'}]},{},{

        sortJson:{'sort':1}
    })
    //模板引擎配置全局的变量
    ctx.state.classes=classesResult;
    ctx.state.nav=navResult;
    ctx.state.pathname=pathname;
    ctx.state.setting=setting[0];

    await  next()
})

router.get('/',async (ctx)=>{
    var list=await DB.find("articlecate",{'pid':'5d8d64de45fda84bc43279e3'});
    console.log(list);

    console.time('start');

    //轮播图  注意状态数据不一致问题  建议在后台增加数据的时候状态 转化成number类型
    var focusResult=await DB.find('focus',{$or:[{'status':1},{'status':'1'}]},{},{

        sortJson:{'sort':1}
    })

    console.timeEnd('start');

    ctx.render('defaul/index',{

        focus:focusResult,
        list:list
    });

})

router.get('/content/:id',async (ctx)=>{
    console.log(ctx.params)
    var id=ctx.params.id;
    var list=await DB.find("article",{"_id":DB.getObjectId(id)})
    var list1=await DB.find("article",{"_id":DB.getObjectId(id)})
    console.log(list);
    ctx.render('defaul/courses_info',{
        list:list[0],
        catelist:list1
    });
})


router.get('/news',async (ctx)=>{
    //ctx.body="new";

    var pid=ctx.query.pid;
    console.log(pid);

    var page=ctx.query.page || 1;

    var pageSize=12;


    //获取成功案例下面的分类
    var cateResult=await  DB.find('articlecate',{'pid':'5d8d65d145fda84bc43279e5'});
    console.log(cateResult);

    if(pid){
        var  articleResult=await DB.find('article',{"pid":pid},{},{
            page,
            pageSize
        });
        var  articleNum=await DB.count('article',{"pid":pid});
        console.log(articleResult)
    }else{
        //循环子分类获取子分类下面的所有的内容
        var subCateArr=[];
        for(var i=0;i<cateResult.length;i++){
            subCateArr.push(cateResult[i]._id.toString());
        }
        var  articleResult=await DB.find('article',{"pid":{$in:subCateArr}},{},{
            page,
            pageSize
        });

        var  articleNum=await DB.count('article',{"pid":{$in:subCateArr}});

    }

    ctx.render('defaul/courses02',{
        cateResult:cateResult,
        articleResult:articleResult,
        pid:pid,
        page:page,
        totalPages:Math.ceil(articleNum/pageSize)
    });

})

router.get('/service',async (ctx)=>{

//查询
    var pid=ctx.query.pid;
    console.log(pid);

    var page=ctx.query.page || 1;

    var pageSize=12;


    //获取成功案例下面的分类
    var cateResult=await  DB.find('articlecate',{'pid':'5d8d660545fda84bc43279e6'});
    console.log(cateResult);

    if(pid){
        var  articleResult=await DB.find('article',{"pid":pid},{},{
            page,
            pageSize
        });
        var  articleNum=await DB.count('article',{"pid":pid});
        console.log(articleResult)
    }else{
        //循环子分类获取子分类下面的所有的内容
        var subCateArr=[];
        for(var i=0;i<cateResult.length;i++){
            subCateArr.push(cateResult[i]._id.toString());
        }
        var  articleResult=await DB.find('article',{"pid":{$in:subCateArr}},{},{
            page,
            pageSize
        });

        var  articleNum=await DB.count('article',{"pid":{$in:subCateArr}});

    }

    ctx.render('defaul/courses03',{
        cateResult:cateResult,
        articleResult:articleResult,
        pid:pid,
        page:page,
        totalPages:Math.ceil(articleNum/pageSize)
    });


})

router.get('/about',async (ctx)=>{

    ctx.render('defaul/AboutUs');

})

router.get('/case',async (ctx)=>{

    var pid=ctx.query.pid;
    console.log(pid);

    var page=ctx.query.page || 1;

    var pageSize=12;


    //获取成功案例下面的分类
    var cateResult=await  DB.find('articlecate',{'pid':'5d8d64de45fda84bc43279e3'});
    console.log(cateResult);

    if(pid){
        var  articleResult=await DB.find('article',{"pid":pid},{},{
            page,
            pageSize
        });
        var  articleNum=await DB.count('article',{"pid":pid});
        console.log(articleResult)
    }else{
        //循环子分类获取子分类下面的所有的内容
        var subCateArr=[];
        for(var i=0;i<cateResult.length;i++){
            subCateArr.push(cateResult[i]._id.toString());
        }
        var  articleResult=await DB.find('article',{"pid":{$in:subCateArr}},{},{
            page,
            pageSize
        });

        var  articleNum=await DB.count('article',{"pid":{$in:subCateArr}});

    }

   await ctx.render('defaul/courses01',{
        catelist:cateResult,
        articlelist:articleResult,
        pid:pid,
        page:page,
        totalPages:Math.ceil(articleNum/pageSize)
    });

})
router.get('/language',async(ctx)=>{
    var pid=ctx.query.pid;
    console.log(pid);

    var page=ctx.query.page || 1;

    var pageSize=12;


    //获取成功案例下面的分类
    var cateResult=await  DB.find('articlecate',{'pid':'5d9ee3eb591120241071bc42'});
    console.log(cateResult);

    if(pid){
        var  articleResult=await DB.find('article',{"pid":pid},{},{
            page,
            pageSize
        });
        var  articleNum=await DB.count('article',{"pid":pid});
        console.log(articleResult)
    }else{
        //循环子分类获取子分类下面的所有的内容
        var subCateArr=[];
        for(var i=0;i<cateResult.length;i++){
            subCateArr.push(cateResult[i]._id.toString());
        }
        var  articleResult=await DB.find('article',{"pid":{$in:subCateArr}},{},{
            page,
            pageSize
        });

        var  articleNum=await DB.count('article',{"pid":{$in:subCateArr}});

    }

    await ctx.render('defaul/courses04',{
        catelist:cateResult,
        articlelist:articleResult,
        pid:pid,
        page:page,
        totalPages:Math.ceil(articleNum/pageSize)
    });

})
router.get('/history',async(ctx)=>{
    var pid=ctx.query.pid;
    console.log(pid);

    var page=ctx.query.page || 1;

    var pageSize=12;


    //获取成功案例下面的分类
    var cateResult=await  DB.find('articlecate',{'pid':'5d9ee4c0591120241071bc45'});
    console.log(cateResult);

    if(pid){
        var  articleResult=await DB.find('article',{"pid":pid},{},{
            page,
            pageSize
        });
        var  articleNum=await DB.count('article',{"pid":pid});
        console.log(articleResult)
    }else{
        //循环子分类获取子分类下面的所有的内容
        var subCateArr=[];
        for(var i=0;i<cateResult.length;i++){
            subCateArr.push(cateResult[i]._id.toString());
        }
        var  articleResult=await DB.find('article',{"pid":{$in:subCateArr}},{},{
            page,
            pageSize
        });

        var  articleNum=await DB.count('article',{"pid":{$in:subCateArr}});

    }

    await ctx.render('defaul/courses05',{
        catelist:cateResult,
        articlelist:articleResult,
        pid:pid,
        page:page,
        totalPages:Math.ceil(articleNum/pageSize)
    });

})

router.get('/connect',async (ctx)=>{

    ctx.render('defaul/connect');
})

router.get('/register',async (ctx)=>{

    ctx.render('defaul/register');
})

//doAdd

 router.post('/doAdd',async (ctx)=>{

     console.log("用户注册");
    console.log(ctx.request.body);
    //1.获取表单提交的数据

    //2.验证表单数据是否合法

    //3.在数据库查询当前要增加的用户是否存在

    //4.增加用户

    var username=ctx.request.body.username;
    var password=ctx.request.body.password;
    var rpassword=ctx.request.body.rpassword;
    var gender=ctx.request.body.gender;
    var favor=ctx.request.body.favor;
    var intername=ctx.request.body.intername;
    var age=ctx.request.body.age;
    var birthday=ctx.request.body.birthday;
    var Email=ctx.request.body.Email;
    var phone=ctx.request.body.phone;
    var occupation=ctx.request.body.occupation;
    if(password!=rpassword ||password.length<6){

        await ctx.render('defaul/error',{
            message:'密码和确认密码不一致，或者密码长度小于6位',
            redirect:"/register"
        })

    }else{

        //数据库查询当前用户是否存在

        var findResult=await  DB.find('users',{"username":username});

        if(findResult.length>0){

            await  ctx.render('defaul/error',{
                message:'用户已经存在，请登录！',
                redirect:'/login'
            })

        }else{
            if(gender==""||favor==""||intername==""||age==""||birthday==""||Email==""||phone==""||occupation==""){
                await ctx.render('defaul/error',{
                    message:'请填写信息完整',
                    redirect:"/register"
                })
            }else {
                if(phone.length<11){
                    await ctx.render('defaul/error',{
                        message:'电话号码格式不正确或者位数不满11位',
                        redirect:"/register"
                    })
                }else {
                    //增加用户
                    var addResult =await DB.insert('users',{"username":username,"password":Tools.md5(password),"status":1,"last_time":'',"gender":gender,"favor":favor,"intername":intername,"age":age,"birthday":birthday,"Email":Email,"phone":phone,"occupation":occupation});

                    ctx.redirect('/login');
                }


            }

        }
    }


})









router.get('/login',async (ctx)=>{

    ctx.render('defaul/login');
})




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
        if(pathname=="defaul/login"||pathname=="defaul/login/doLogin" ){
            await next();
        }else {
            ctx.redirect("/login");
        }

    }
})




//个人中心
router.get('/percen',async (ctx)=>{

    ctx.render('defaul/percen');

})
//个人中心修改密码

router.post('/doEdit',async (ctx)=>{
    console.log("修改密码");
    console.log(ctx.request.body)

    try{
        var id=ctx.request.body.id;
        var username=ctx.request.body.username;
        var password=ctx.request.body.password;
        var rpassword=ctx.request.body.rpassword;

        if(password!=''){
            if(password!=rpassword ||password.length<6){

                await ctx.render('admin/error',{
                    message:'密码和确认密码不一致，或者密码长度小于6位',
                    redirect:'/percen'
                })

            }else{

                //更新密码
                var updateResult=await DB.update('users',{"_id":DB.getObjectId(id)},{"password":Tools.md5(password)});
                ctx.redirect('/percen');
            }
        }else{

            ctx.redirect('/percen');
        }

    }catch(err){
        await ctx.render('defaul/error',{
            message:error,
            redirect:'/percen'
        })

    }

})
router.post('/doEditInfo',async (ctx)=>{
 console.log("修改属性");
console.log(ctx.request.body);
    var id=ctx.request.body.id;
    var intername=ctx.request.body.intername;
    var age=ctx.request.body.age;
    var birthday=ctx.request.body.birthday;
    var occupation=ctx.request.body.occupation;
    var phone=ctx.request.body.phone;
    var Email=ctx.request.body.Email;
    var favor=ctx.request.body.favor;



    //使用Json格式保存修改后的数据
    var json={
        intername,age,birthday,occupation,phone,Email,favor
    }
    //跟新
    DB.update('users',{"_id":DB.getObjectId(id)},json);

    ctx.redirect("/percen");

    console.log("修改成功");
})



//课程
router.get('/course',async (ctx)=>{
    console.log(ctx.session.userinfo);
    var page=ctx.query.page ||1;
    console.log(page);
    var pageSize=16;
    //查询总数量
    var articleNum= await DB.count("article",{});
    var cateResult=await DB.find('article',{},{},{
        page:page,
        pageSize:pageSize,
        sortJson: {
            'add_time': -1
        }
    });
    console.log(articleNum);
    console.log(cateResult);
    await ctx.render('defaul/courses',{
        cateResult:cateResult,
        page:page,
        totalPages:Math.ceil(articleNum/pageSize)
    });
})

//退出登陆，把userinfo清空，并返回首页
router.get("/loginOut",async(ctx)=>{
    ctx.session.userinfo=null;
    ctx.redirect("/");
})


module.exports=router.routes();