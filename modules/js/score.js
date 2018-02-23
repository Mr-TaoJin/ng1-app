var score = angular.module('score',['ui.router']);

score.controller("scoreCtrl",['$scope',function($scope){
	
}])
.controller("scoreresultCtrl",['$scope',"DataHelper","$location","Contants",function($scope,DataHelper,$location,Contants){
	
	$scope.match = [];
	$scope.dateArr = [];
	$scope.complate = 0;
	$scope.processing = 0;
	$scope.resultSize = 0;
	$scope.nextcls = "";
	$scope.nextdisabled = false;
	$scope.cls = {"football":"","basketball":""};
	var path = $location.absUrl();
	$scope.type= path.split("#/")[1];
	if($scope.type==null){
		$scope.type = "football";
	}
	$scope.cls[$scope.type] = "toggle-active";
	$scope.loadMatch = function(type,date){
		if(!date){
			date = "";
		}
		//查询赛果数据
		DataHelper.post("/app/result/match",{"date":date,"sport":type}).success(function(data){
			if(data.flag){
				if(data.list!=null&&data.list.length>0){
					$scope.match =data.list; 
					console.log(data)
					for(var i in $scope.match){
						var m = $scope.match[i];
						if(m.full_score==null || m.full_score==""){
							m.full_score = "-";
							m.half_score = "-";
							m.spf_result = "-";
							m.rqspf_result = "-";
							m.zjq_result = "-";
							m.bqc_result = "-";
							m.let_points = "";
						}else{
							if($scope.type=="basketball"){
								if(m.spf_result.indexOf("胜")!=-1){
									m.spf_result = "主"+m.spf_result;
								}else{
									m.spf_result = "客胜";
								}
							}
							m.zjq_result = m.zjq_result+"球";
							m.bqc_result = m.bqc_result.charAt(0)+"-"+m.bqc_result.charAt(1);
							if(m.let_points>0){
								m.bf_cls = "cx-rz";
								m.let_points = "+"+m.let_points;
							}else{
								m.bf_cls = "cx-rf";
							}
						}
					}
				}
				$scope.dateArr= data.args.dateArr;
				if($scope.dateArr[2]==null){
					$scope.nextcls = "nonext";
					$scope.nextdisabled = true;
				}else{
					$scope.nextcls = "";
					$scope.nextdisabled = false;
				}
				$scope.complate = data.args.complate;
				$scope.processing = data.args.processing;
				$scope.resultSize = data.args.resultSize;
			}
		});
	}
	
	$scope.match4Date = function(tt){
		if(tt==1){
			$scope.loadMatch($scope.type,$scope.dateArr[0]);
		}else{
			if($scope.dateArr[2]!=null && $scope.dateArr[2]!=''){
				$scope.loadMatch($scope.type,$scope.dateArr[2]);
			}
		}
	}
	$scope.loadMatch($scope.type);
}]);

