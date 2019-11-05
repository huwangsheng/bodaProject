
/**
 * Created by Administrator on 2019/09/24 0024.
 */

$(function(){

    app.confirmDelete();
})
var app={

    toggle:function(el,collectionName,attr,id){
        $.get('/admin/changeStatus',{collectionName:collectionName,attr:attr,id:id},function(data) {
            if (data.success) {
                if (el.src.indexOf('yes') != -1) {
                    el.src = '/admin/assets/images/no.png';
                } else {
                    el.src = '/admin/assets/images/yes.png';
                }
            }
        })

    },confirmDelete(){

        $('.delete').click(function(){
            var flag=confirm('您确定要删除吗?');
            return flag;
        })

    },changeSort(el,collectionName,id){

        var sortValue=el.value;
        $.get('/admin/changeSort',{collectionName:collectionName,id:id,sortValue:sortValue},function(data) {
            console.log(data)
        })

    }
}