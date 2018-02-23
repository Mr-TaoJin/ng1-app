var app = angular.module('mainApp',['ui.router','ionic','utils','index','score','login','reg',
	'fgtpwd','orderJczq',"orderJclq","invitation","codelogin","betscore",
	"personal","plan","ngFileUpload",'shopping','personalCenter','goldManagement']);

app.config(["$urlRouterProvider","$httpProvider",function($urlRouterProvider,$httpProvider){
	$urlRouterProvider.otherwise("/index");
	 $httpProvider.defaults.transformRequest = function(obj){  
	     var str = [];  
	     for(var p in obj){  
	       str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));  
	     }  
	     return str.join("&");  
	   }  

	   $httpProvider.defaults.headers.post = {  
	        'Content-Type': 'application/x-www-form-urlencoded'  
	   }
}]).directive("tab",function(){
	return {
		restrict:"EA",
		templateUrl:"tab.html"
	}
}).directive("histroy",function(){
	return {
		restrict:"EA",
		template:"<span>返回</span>",
		link:function($scope,elm,attr,controller){
			elm.parent().children().eq(0).bind("click",function(){
				window.history.back(-1);
			});
		 }
	}
}).directive("showTips",function(){
	return {
		restrict:"EA",
		templateUrl:'tips.html'
	}
}).directive("errSrc", function() {
	  return {
		    link: function(scope, element, attrs) {
		      element.bind('error', function() {
		        if (attrs.src != attrs.errSrc) {
		          attrs.$set('src', attrs.errSrc);
		        }
		      });
		    }
		  }
});




