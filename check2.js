////全面检测用户网站嵌入美洽JS的情况////

var url = "http://www.22225555.net";

var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var totalPage = 1;
var totalHref = 0;
var rightHref = 0;
var totalScript = 0;
var rightScript = 0;

//获取网站的源代码
function getSource(url, callback){
		http.get(url, function(res){
			var html = "";
			res.on('data', function(chunk){
				html += chunk;
			});
			res.on('end', function(){
				callback(html);
			});
		});
    }

//获取页面指定标签的属性
function getTag(html, tag, attr){
	var arr=[];//存储页面中的标签

  	//用cheerio提取
  	$ = cheerio.load(html);
  	$(tag).each(function(i, e){
  		 	var temp = $(e).attr(attr);
  		 	if(temp){
  		 		arr.push(temp);
  		 	}
  		 });
  	return arr;
}

//统计子页面个数
function countPage(arr){
	var page = [];
	var reg = /meiqia/;
	var reg2 = /javascript/;
	var reg3 = /weibo\.com/;
	for(var i  = 0; i < arr.length; i++){
		if(arr[i] != '#'){
			if(!(reg.test(arr[i]))){
				if(!(reg2.test(arr[i]))){
					if(!(reg3.test(arr[i]))){
				page.push(arr[i]);
			}
			}
			}
		}
	}
	return page;
}

//获取嵌入美洽链接
function getMeiqiaLink(arr){
	var reg = /meiqia/;
	var meChatHref = [];

	for(var i = 0; i < arr.length; i++){
  			if(reg.test(arr[i])){
  				meChatHref.push(arr[i]);
  			}
  		}

  	return meChatHref;
}

//检查美洽链接嵌入是否正确
function checkMeiqiaLink(href){
	var reg = /http:\/\/meiqia\.com\/chat/;

	return reg.test(href);
}

// 获取美洽插件
function getMeiqiaScript(arr){
	var meChatScript = [];
	var reg = /meiqia/;
	for(var i = 0; i < arr.length; i++){
		if(reg.test(arr[i])){
			meChatScript.push(arr[i])
		}
	}
	return meChatScript;
}

//检查美洽插件嵌入是否正确
function checkMeiqiaScript(script){
	var reg = /mechat\.js/;

	return reg.test(script);
}

//讲获取的链接转换为url
function createCompleteLink(url, arr){
	var reg = /http/;

	for(var i = 0; i < arr.length; i++){
		if(!(reg.test(arr[i]))){
			arr[i] = url + arr[i];
		}
	}
	return arr;
}

//检查单页面
function checkOnePage(url){
	getSource(url, function(data){
		if(data){
			totalPage++;
		var href = getTag(data, 'a', 'href');
		var script = getTag(data, 'script', 'src');

		var meChatHref = getMeiqiaLink(href);
			totalHref +=  meChatHref.length;

			for(var i = 0; i < meChatHref.length; i++){
				if(checkMeiqiaLink(meChatHref[i])){
					rightHref++;
				}
			}

		var meChatScript = getMeiqiaScript(script);
			totalScript += meChatScript.length;
			for(var i = 0; i < meChatScript.length; i++){
				if(checkMeiqiaScript(meChatScript[i])){
					rightScript++;
				}
			}
		
		console.log('检查网页数: ' + totalPage);
		console.log('嵌入美洽链接：' + totalHref + ' 正确连接数：' + rightHref);
		console.log('嵌入美洽插件：' + totalScript + ' 正确插件数' + rightScript); 
		}
		else{
			console.log('can not find: ' + url);
		}
	})
}



function checkHomePage(url){
	getSource(url, function(data){
		if(data){

			var href = getTag(data, 'a', 'href');
			var script = getTag(data, 'script', 'src');

			var page = countPage(href);
			//console.log(page);
			var completeLink = createCompleteLink(url, page);
			//console.log(completeLink);
			//totalPage = completeLink.length;

			for(var i = 0; i < completeLink.length; i++){
				checkOnePage(completeLink[i]);
			}
			

			var meChatHref = getMeiqiaLink(href);
			totalHref +=  meChatHref.length;

			for(var i = 0; i < meChatHref.length; i++){
				if(checkMeiqiaLink(meChatHref[i])){
					rightHref++;
				}
			}
			
			var meChatScript = getMeiqiaScript(script);
			totalScript += meChatScript.length;
			for(var i = 0; i < meChatScript.length; i++){
				if(checkMeiqiaScript(meChatScript[i])){
					rightScript++;
				}
			}
			
			console.log('检查网页数: ' + totalPage);
			console.log('嵌入美洽链接：' + totalHref + ' 正确连接数：' + rightHref);
			console.log('嵌入美洽插件：' + totalScript + ' 正确插件数' + rightScript);
			
			
		}else{
			console.log("获取网页源码失败")
		}
	})
}
checkHomePage(url);

//exports.checkPage = checkHomePage;
