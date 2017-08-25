/*
* @Author: vip
* @Date:   2017-07-20 15:21:52
* @Last Modified by:   vip
* @Last Modified time: 2017-07-25 16:18:44
*/
var BDtpl = require('../vendors/js/baiduTemplate1.0.6');//引入模版引擎
var bootstrapPaginator = require('../vendors/js/bootstrap-paginator');//引入bootstrap-paginator分页组件

'use strict';

//网站分页模板
var paginationTpl = '<div class="go-to">\
            <div>共<!:=totalPages!>页，到第</div>\
            <div><input id="inputPage" type="text" value="1"/></div>\
            <div class="add-cut">\
                <span class="add">&nbsp;</span>\
                <span class="cut">&nbsp;</span>\
            </div>\
        </div>\
        <div id="pagination1"></div>\
    </div>';

//分页初始化配置
var deyuPagination = {

	pageSize : 10,
	
	renderPagination : function(o){

		if(o.totalPages <= 0){ 
			$(".deyu-pagination").hide();
			return; 
		}else{
			$(".deyu-pagination").show();
		}

		var options = {
		    currentPage: 1,          //当前页数
		    totalPages: o.totalPages,//总页数
		    numberOfPages:5,         //显示的页码数
		    shouldShowPage : function(type, page, current){
		    	if(type=="first" || type=="last"){
		    		return false;
		    	}else{
		    		return true;
		    	}
		    },
		    itemTexts : function(type, page, current){
		    	switch(type){
		    		case "first":
					    return "首页";
				    case "last":
					    return "尾页";
				    case "prev":
					    return " < 上一页";
				    case "next":
					    return "下一页 > ";
				    default:
					   return page;
		    	}
		    },
		    //页码改变
		    onPageChanged : function(event, oldPage, newPage){
		    	if(newPage){
		    		o.onPageChanged(event, oldPage, newPage);
		    	}else{
		    		o.onPageChanged(event, oldPage, options.currentPage);
		    	}
		    }
		};

		//渲染分页模板
		var html = BDtpl.template(paginationTpl,{totalPages : options.totalPages});
		$(".deyu-pagination").html(html);
		$("#pagination1").bootstrapPaginator(options);

		//只能输入数字		
		$("#inputPage").keydown(function(){
			if(!(event.keyCode==46)&&!(event.keyCode==8)&&!(event.keyCode==37)&&!(event.keyCode==39))
		    if(!((event.keyCode>=48&&event.keyCode<=57)||(event.keyCode>=96&&event.keyCode<=105)))
		    event.returnValue=false;
		})

		//输入的值发生改变时，校验输入格式是否正确
		$("#inputPage").on('input',function(e){
			var reg = new RegExp("^[0-9]*$");
			var f = reg.test($(this).val());
		    if(f==false){
		    	$(this).val("");
		    }
		}); 

		//加页码
		$(".deyu-pagination").find(".add").click(function(){
			var page = $("#inputPage").val();
			if(page){
				$("#inputPage").val(parseInt(page) + 1);
			}else{
				$("#inputPage").val(1);
			}
		})

		//减页码
		$(".deyu-pagination").find(".cut").click(function(){
			var page = parseInt($("#inputPage").val());
			if(page > 1 ){
				$("#inputPage").val(page - 1);
			}
		})

		//输入正确的页码后，回车 请求页码
		document.onkeydown = function(e){ 
		    var ev = document.all ? window.event : e;
		    var inputPage = parseInt($("#inputPage").val());
		    if(ev.keyCode==13 && $("#inputPage").val()) {
		    	if(inputPage > options.totalPages || inputPage <= 0){
		    		console.log("输入不合法!");
		    	}else{
		    		console.log("输入合法!");
		    		//重新渲染 分页模板
		    		options.currentPage = inputPage;
		    		$('#pagination1').bootstrapPaginator("setOptions",options);
		    		//加载 新页码的数据
		    		options.onPageChanged();
		    	}
		     }
		}

	}

};


module.exports = deyuPagination;