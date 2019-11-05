
/**
 * Created by Shinelon on 2019-09-16.
 */
var router=require("koa-router")();

var DB=require("../../model/db");

const tools = require('../../model/tools.js');

router.get('/',async (ctx)=>{
    //ctx.body='系统设置';
    //获取设置的信息
/*
* 1.拿到setting表中所有的数据
* 2.把数据放在list数组中渲染在前端页面
* 3.在前端显示所有的数据
* */
    var result=await DB.find('setting',{});
    await ctx.render('admin/setting/index',{
        list:result[0]
    });
})

router.post("/doEdit",tools.multer().single("site_logo"),async(ctx)=>{
    /*
    1.当点击修改时候提交post表单
    2.把修改后的数据更新
    3.如果修改了logo，就更新logo否则就不更新logo
    4.把修改更新后的数据写成json形式
    5.把json形式的数据重新放入到setting表中，并更新
    6.返回上一页
    * */
    var site_title=ctx.req.body.site_title;
    let site_logo=ctx.req.file? ctx.req.file.path.substr(7) :'';
    var site_keywords=ctx.req.body.site_keywords;
    var site_description=ctx.req.body.site_description;
    var site_icp=ctx.req.body.site_icp;
    var site_qq=ctx.req.body.site_qq;
    var site_tel=ctx.req.body.site_tel;
    var site_address=ctx.req.body.site_address;
    var site_status=ctx.req.body.site_status;
    var add_time=tools.getTime();
    if(site_logo){
        var json={
            site_title,site_logo,site_keywords,site_description,site_icp,site_qq,site_tel,site_address,site_status,add_time

        }
    }else{
        var json={
            site_title,site_keywords,site_description,site_icp,site_qq,site_tel,site_address,site_status,add_time

        }

    }

    await  DB.update('setting',{},json);
    ctx.redirect('/admin/setting');

})


module.exports=router.routes();