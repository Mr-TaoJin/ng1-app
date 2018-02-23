var reg  = angular.module("reg",['ui.router']);

reg.controller("regCtrl",['$scope','DataHelper',"ObjUtils","$location",function($scope,DataHelper,ObjUtils,$location){
	$scope.href = $location.absUrl();
	if($scope.href.indexOf("invitationCode")==-1){
		$location.path("/invitation");
	}
	$scope.invitationCode = $scope.href.split("?")[1].split("=")[1];
	$scope.phone = "";
	$scope.password = "";
	$scope.password2 = "";
	$scope.code="";
	$scope.getCode = function(){
		if(ObjUtils.checkMobile($scope.phone)){
			DataHelper.post(ObjUtils.doadmin+"/app/login/getphonecode",{"mobile":$scope.phone}).success(function(data){
				if(data.status==1){
					//alert("获取验证码成功");
					//$location.path("/index");
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
	$scope.reg = function(){
		if(ObjUtils.checkMobile($scope.phone)
				&&ObjUtils.checkPwd($scope.password)
				&&ObjUtils.checkPwd2($scope.password,$scope.password2)
				&&ObjUtils.isNull("验证码",$scope.code)
				&&ObjUtils.isNull("邀请码",$scope.invitationCode)){
			
			//验证通过开始注册
			DataHelper.post(ObjUtils.doadmin+"/app/login/reg",{"username":$scope.phone,"pwd":$scope.password,"mobilecode":$scope.code,"invitationCode":$scope.invitationCode}).success(function(data){
				if(data.status==1){
					//alert("注册成功");
					var userId = data.data.userId;
					if(userId!=null&&userId.length>0){
						$location.path("/setnickname");
						$location.search("userId",userId);
					}else{
						ObjUtils.showTips("注册参数错误");
					}
				}else{
					if(data.errcode=="400107"){
						ObjUtils.showTips("手机号已注册");
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