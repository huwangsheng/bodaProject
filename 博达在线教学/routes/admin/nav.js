
/**
 * Created by Shinelon on 2019-09-16.
 */
var router=require("koa-router")();

var DB=require("../../model/db");

const tools = require('../../model/tools.js');

//配置上传图片

const multer = require('koa-multer');

router.get('/',async (ctx)=>{

    var page=ctx.query.page ||1;
    var pageSize=8;
    var result= await DB.find('nav',{},{},{
        page,
        pageSize
    });
    var count= await  DB.count('nav',{});  /*总数量*/
    await  ctx.render('admin/nav/list',{
        list:result,
        page:page,
        totalPages:Math.ceil(count/pageSize)
    });
})

router.get('/add',async (ctx)=>{


    await  ctx.render('admin/nav/add');

})

router.post('/doAdd',tools.multer().single('pic'),async (ctx)=>{

    //接受post传过来的数据

    //注意：在模板中配置  enctype="multipart/form-data"

    //ctx.body = {
    //    filename:ctx.req.file?ctx.req.file.filename : '',  //返回文件名
    //    body:ctx.req.body
    //}

    //增加到数据库


    var title=ctx.req.body.title;

    let pic=ctx.req.file? ctx.req.file.path.substr(7) :'';

    var url=ctx.req.body.url;

    var sort=ctx.req.body.sort;

    var status=ctx.req.body.status;

    var add_time=tools.getTime();


    await  DB.insert('nav',{

        title,pic,url,sort,status,add_time
    })
    //跳转
    ctx.redirect('/admin/nav');


})

router.get('/edit',async (ctx)=>{
    // ctx.body="添加轮播图列表"
    /*
     * 第一步:拿到对应的id
     *第二步：根据id去数据库中查找，并赋给result
     * 第三步：把对应的result里面的数据传给list数组
     * 第四步：在前端页面分别显示对应的内容
     * */
    var id=ctx.query.id;
    var result=await DB.find("nav",{"_id":DB.getObjectId(id)});
    console.log(result);

    await  ctx.render('admin/nav/edit',{
        list:result[0],
        prevPage:ctx.state.G.prevPage
    });

})

//执行编辑数据
router.post('/doEdit',tools.multer().single('pic'),async (ctx)=>{
    /*
     * 当跳转到修改页面之后。程序提交修改后的post表单
     * 第一步：重新把list中的数据进行重写
     * 第二步：然后把程序写好的数据写成json形式，然后进行数据库的更新操作
     * 第三步：通过隐藏的表单域存储上一页的地址，修改之后跳转回上一个页面
     * */
    var id=ctx.req.body.id;

    var title=ctx.req.body.title;

    let pic=ctx.req.file? ctx.req.file.path.substr(7) :'';

    var url=ctx.req.body.url;

    var sort=ctx.req.body.sort;

    var status=ctx.req.body.status;

    var add_time=tools.getTime();

    var prevPage=ctx.req.body.prevPage;


    if(pic){

        var json={

            title,pic,url,sort,status,add_time
        }
    }else{
        var json={

            title,url,sort,status,add_time
        }

    }
    //更新数据库
    await  DB.update('nav',{'_id':DB.getObjectId(id)},json);

//隐藏表单域
    if(prevPage){
        ctx.redirect(prevPage);
    }else{
        //跳转
        ctx.redirect('/admin/nav');

    }

})


module.exports=router.routes();