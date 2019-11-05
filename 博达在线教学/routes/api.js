/**
 * Created by Shinelon on 2019-09-16.
 */
var router=require("koa-router")();

router.get("/",async(ctx)=>{
    ctx.body="api接口"
})

module.exports=router.routes();