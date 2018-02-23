var login  = angular.module("login",['ui.router','utils']);


login.controller("loginCtrl",["$rootScope",'$scope',"CookieUtils","ObjUtils","DataHelper","$location",function($rootScope,$scope,CookieUtils,ObjUtils,DataHelper,$location){
	
	$rootScope.user={};
	
	$scope.phone = CookieUtils.getCookie('username')==null||CookieUtils.getCookie('username')==''?"":CookieUtils.getCookie('username');

	$scope.password = CookieUtils.getCookie('password')==null||CookieUtils.getCookie('password')==''?"":CookieUtils.getCookie('password');;
	
	$scope.rem = true;
	$scope.logincheck = function(){

		if(ObjUtils.checkMobile($scope.phone)&&ObjUtils.checkPwd($scope.password)){
			//请求后台
			DataHelper.post(ObjUtils.doadmin+"/app/login/checklogin",{"username":$scope.phone,"pwd":$scope.password}).success(function(data){
				if(data.status==1){
					if($scope.rem){
						//将用户名密码写入cookie
						CookieUtils.setCookie("rmbUser", "true", 7); // 存储一个带7天期限的cookie
						CookieUtils.setCookie("username", $scope.phone, 7);
						CookieUtils.setCookie("password", $scope.password,7);
					}else{
						CookieUtils.setCookie("rmbUser", "false", -1);
						CookieUtils.setCookie("username", "",-1);
						CookieUtils.setCookie("password", "", -1);
					}
					CookieUtils.setCookie(data.data.name, data.data.loginStr, 7);
					$rootScope.user.phone = $scope.phone;
					$location.path("/index");
				}else{
					if(data.errcode=="400104"){
						ObjUtils.showTips("密码错误");
					}else if(data.errcode=="400103"){
						ObjUtils.showTips("手机号未注册");
					}else{
						ObjUtils.showTips("系统忙,稍后重试");
					}
				}
			});
		}
	}
	
	$scope.scls = "assertive";
	$scope.showred = function(){
		//var eml = $(".ion-ios-checkmark");
		if(!$scope.rem){
			$scope.scls = "assertive";
			$scope.rem = true;
		}else{
			$scope.scls = "";
			$scope.rem = false;
		}
	}
	
}]);


var codelogin  = angular.module("codelogin",['ui.router','utils']);

codelogin.controller("codeloginCtrl",["$rootScope",'$scope',"CookieUtils","ObjUtils","DataHelper","$location",function($rootScope,$scope,CookieUtils,ObjUtils,DataHelper,$location){
	$rootScope.user = {};
	$scope.phone = "";
	$scope.code = "";
	
	$scope.getCode = function(){
		if(ObjUtils.checkMobile($scope.phone)){
			DataHelper.post(ObjUtils.doadmin+"/app/login/getlogincode",{"mobile":$scope.phone}).success(function(data){
				if(data.status==1){
					var obj = document.getElementsByClassName("yzm-btn")[0];
					obj.setAttribute("disabled",true);
					obj.setAttribute("class","yzm-hui yzm-btn");;
					ObjUtils.codeTimer(obj);
				}else{
					if(data.errcode=="400107"){
						ObjUtils.showTips("手机号已注册");
					}else if(data.errcode=="400108"){
						ObjUtils.showTips("操作频繁");
					}else{
						ObjUtils.showTips("服务器忙，稍后重试");
					}
				}
			});
		}
	}
	
	//登录
	$scope.submitLogin = function(){
		if(ObjUtils.checkMobile($scope.phone)
				&&ObjUtils.isNull("验证码",$scope.code)){
			//请求后台
			DataHelper.post(ObjUtils.doadmin+"/app/login/checkcodelogin",{"mobile":$scope.phone,"mobilecode":$scope.code}).success(function(data){
				if(data.status==1){
					$rootScope.user.phone = $scope.phone;
					$location.path("/index");
				}else{
					if(data.errcode=="400102"){
						ObjUtils.showTips("验证码不正确");
					}else if(data.errcode=="400103"){
						ObjUtils.showTips("手机号未注册");
					}else{
						ObjUtils.showTips("系统忙,稍后重试");
					}
				}
			});
		}
	}
	
}]);

