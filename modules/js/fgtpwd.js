var fgtpwd  = angular.module("fgtpwd",['ui.router','utils']);


fgtpwd.controller("fgtpwdCtrl",['$scope',"ObjUtils","DataHelper","$location","$timeout",function($scope,ObjUtils,DataHelper,$location,$timeout){

	$scope.phone="";
	$scope.mobilecode="";
	$scope.password="";
	$scope.password2="";
	
	$scope.getCode = function(){
		if(ObjUtils.checkMobile($scope.phone)){
			DataHelper.post(ObjUtils.doadmin+"/app/login/fgtpwdcode",{"mobile":$scope.phone}).success(function(data){
				if(data.status==1){
					//alert("获取验证码成功");
					//$location.path("/index");
					var obj = $(".yzm-btn.light-bg");
					obj.attr("disabled",true);
					obj.removeClass("light-bg").removeClass("red").addClass("yzm-hui");
					ObjUtils.codeTimer(obj);
				}else{
					if(data.errcode=="400103"){
						ObjUtils.showTips("手机号未注册");
					}else if(data.errcode=="400108"){
						ObjUtils.showTips("操作频繁");
					}else{
						ObjUtils.showTips("服务器忙，稍后重试");
					}
				}
			});
		}
	}
	
	
	$scope.fgtpwd = function(){
		if(ObjUtils.checkMobile($scope.phone)
				&&ObjUtils.isNull("验证码",$scope.mobilecode)
				&&ObjUtils.checkPwd($scope.password)
				&&ObjUtils.checkPwd2($scope.password,$scope.password2)){
			//验证通过开始找回密码
			DataHelper.post(ObjUtils.doadmin+"/app/login/fgtpwd",{"phone":$scope.phone,"pwd":$scope.password,"mobilecode":$scope.mobilecode}).success(function(data){
				if(data.status==1){
					ObjUtils.showTips("修改成功");
					$timeout(function () {
						$location.path("/index");
				    }, 1500);
				}else{
					if(data.errcode=="400103"){
						ObjUtils.showTips("手机号未注册");
					}else if(data.errcode=="400102"){
						ObjUtils.showTips("验证码错误");
					}else{
						ObjUtils.showTips("服务器忙，稍后重试");
					}
				}
			});
		}
	}
}]);




