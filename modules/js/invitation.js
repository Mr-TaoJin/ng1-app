var invitation  = angular.module("invitation",['ui.router','utils']);

invitation.controller("invitationCtrl",['$scope','DataHelper',"ObjUtils","$location",function($scope,DataHelper,ObjUtils,$location){
	$scope.tt = document.getElementById("fourInput");
	$scope.tt.children[0].focus();
	$scope.one = "";
	$scope.two = "";
	$scope.three = "";
	$scope.four = "";
	
	$scope.tonext = function(t,n){
		if(t){
			if($scope[t]!=''){
				$scope.tt.children[n].focus();
			}else{
				if(n>1){
					$scope.tt.children[n-2].focus();
				}
			}
		}else{
			if($scope.four==""){
				$scope.tt.children[2].focus();
			}
		}
	}
	$scope.sureToReg = function(){
		$scope.invitationCode = $scope.one+$scope.two+$scope.three+$scope.four;
		if($scope.invitationCode.length<4){
			ObjUtils.showTips("请输入完整邀请码");
			var i = ObjUtils.returnArrIndex([$scope.one,$scope.two,$scope.three,$scope.four]);
			$scope.tt.children[i].focus();
		}else{
			//验证邀请码
			DataHelper.post(ObjUtils.doadmin+"/app/login/getinvitationcode",{"invatitioncode":$scope.invitationCode}).success(function(data){
				if(data.status==1){
					alert()
					$location.path("/reg");
					$location.search("invitationCode",$scope.invitationCode);
				}else{
					ObjUtils.showTips("邀请码不正确");
				}
			});
		}
	}
}]);