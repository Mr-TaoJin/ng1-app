var betscore = angular.module('betscore',['ui.router']);

betscore.controller("betscoreCtrl",['$scope','DataHelper',"ObjUtils","$location","CookieUtils","Contants","$state",function($scope,DataHelper,ObjUtils,$location,CookieUtils,Contants,$state){
	$scope.scoreMatch = {};
	$scope.oldMatch = {};
	$scope.jt = "ion-ios-arrow-up";
	$scope.showObj = {};
	$scope.count = 0;
	//投注区的样式
	$scope.betcls = {};
	//投注区内容
	$scope.betContent = {};
	//下一步是否可以点击
	$scope.hasMacth = false;
	
	//下一步颜色
	$scope.nextColor = "hui_button";
	
	$scope.hideMatch = function(k){
		if($scope.jt == "ion-ios-arrow-up"){
			$scope.jt = "ion-ios-arrow-down";
			$scope.showObj[k] = false;
		}else{
			$scope.jt = "ion-ios-arrow-up";
			$scope.showObj[k] = true;
		}
	}
	$scope.flush = function(){
		DataHelper.getScript("http://i.sporttery.cn/odds_calculator/get_odds?i_format=json&i_callback=getDataCrs&poolcode[]=crs&_="+ (+new Date)).success(function(data){
			
		});
	}
	
	$scope.flush();
	setTimeout(function(){
		$scope.flush();
	}, 60*3*1000);
	
	window.getDataCrs = function(json){
		$scope.oldMatch = json["data"];
		var dd = "";
		var mt = [];
		var i =0;
		for(var key in $scope.oldMatch){
			var match = $scope.oldMatch[key];
			match.match_start_time = match.date + ' ' + match.time;
			match.book_end_time = match.b_date+' '+match.time;
			if(match.b_date != match.date){
				var date = new Date(match.b_date);
				if(date.getDay()==0 || date.getDay()==6){
					match.book_end_time = match.date+" 00:59:59";
					if(match.match_start_time < match.book_end_time){
						match.book_end_time = match.match_start_time;
					}
				}else{
					match.book_end_time = match.b_date+" 23:59:59";
				}
			}
			var date = match.date;
			date = date+"_"+ObjUtils.DateToWeek(date);
			if(date!=dd){
				if(dd==""){
					dd = date;
					mt = [];
					mt.push(match);
				}else{
					$scope.scoreMatch[dd] = mt;
					dd = date;
					mt = [];
					mt.push(match);
				}
				$scope.showObj[date]=true;
			}else{
				mt.push(match);
				if(i==$scope.oldMatch.length){
					$scope.matchObj[dd] = mt;
				}
			}
			i++;
			$scope.betcls[match.id] = "";
			$scope.betContent[match.id]="选择投注内容";
		}
	}
	
	//选择确定后可以提交订单的数据
	$scope.resultMatch = {};
	$scope.ishide = false;
	$scope.match = {};
	$scope.showTab = function(mid){
		//已选择的赛事放入
		$scope.chooseMatch = {};
		$scope.crs = ObjUtils.deepClone(Contants.crs);
		if($scope.resultMatch[mid]){
			$scope.chooseMatch[mid] = {};
			for(var j in $scope.resultMatch[mid]){
				$scope.chooseMatch[mid][j] = $scope.resultMatch[mid][j];
				$scope.crs[j] = "chose";
			}
		}
		$scope.ishide = !$scope.ishide;
		$scope.match = $scope.oldMatch["_"+mid];
	}
	
	
	$scope.chose = function(cs){
		if($scope.count<8 || ($scope.resultMatch[$scope.match.id]&&$scope.count==8)){
			if($scope.crs[cs]==''){
				$scope.crs[cs] = "chose";
				if(!$scope.chooseMatch[$scope.match.id]){
					$scope.chooseMatch[$scope.match.id] = {};
					$scope.chooseMatch[$scope.match.id][cs]=$scope.match.crs[cs];
				}else{
					$scope.chooseMatch[$scope.match.id][cs]=$scope.match.crs[cs];
				}
			}else{
				$scope.crs[cs] = "";
				delete $scope.chooseMatch[$scope.match.id][cs]
				if(ObjUtils.getlen($scope.chooseMatch[$scope.match.id])==0){
					delete $scope.chooseMatch[$scope.match.id];
				}
			}
		}else{
			ObjUtils.showTips("最多选择8场赛事");
		}
	}
	
	
	//取消选择
	$scope.removeTab = function(){
		$scope.ishide = !$scope.ishide;
		$scope.syncF();
		$scope.count = ObjUtils.getlen($scope.resultMatch);
	}
	
	//同步投注区样式
	$scope.betStyle = function(){
		for(var k in $scope.betcls){
			$scope.betcls[k] = "";
			if($scope.resultMatch[k]){
				$scope.betcls[k] = "bet-chose-con";
				$scope.betContent[k] = "";
				for(var kk in $scope.resultMatch[k]){
					var bf;
					if(kk.indexOf("-")!=-1){
						if(kk.indexOf("a")!=-1){
							bf= "负其他";
						}else if(kk.indexOf("d")!=-1){
							bf= "平其他";
						}else if(kk.indexOf("h")!=-1){
							bf= "胜其他";
						}
					}else{
						bf = kk.charAt(1)+":"+kk.charAt(3);
					}
					if($scope.betContent[k].split(" ").length<5){
						$scope.betContent[k] += " "+bf;
					}else if($scope.betContent[k].split(" ").length==5){
						$scope.betContent[k] += " ...";
					}else{
						break;
					}
				}
				$scope.betContent[k] = $scope.betContent[k].substring(1);
			}
		}
	}
	
	//同步样式选择
	$scope.syncF = function(){
		for(var k in $scope.crs){
			if(!$scope.resultMatch[$scope.match.id]){
				$scope.crs[k] = "";
			}else{
				if(!$scope.resultMatch[$scope.match.id][k]){
					$scope.crs[k] = "";
				}
			}
		}
	}
	
	//确定选择
	$scope.sureTab = function(){
		$scope.ishide = !$scope.ishide;
		$scope.resultMatch[$scope.match.id] = {};
		if(ObjUtils.getlen($scope.chooseMatch)>0){
			for(var kkk in $scope.chooseMatch[$scope.match.id]){
				$scope.resultMatch[$scope.match.id][kkk] = $scope.chooseMatch[$scope.match.id][kkk];
			}
		}
		$scope.syncF();
		if(ObjUtils.getlen($scope.resultMatch[$scope.match.id])==0){
			delete $scope.resultMatch[$scope.match.id];
		}
		$scope.count = ObjUtils.getlen($scope.resultMatch);
		$scope.betStyle();
		if($scope.count>0){
			$scope.hasMacth = true;
			$scope.nextColor = "";
		}else{
			$scope.hasMacth = false;
			$scope.nextColor = "hui-button";
		}
	}
	
	
	//所有选择结束开始下一步
	$scope.betNext = function(){
		$scope.userId = CookieUtils.getUserId();
		if($scope.userId==null || $scope.userId.length==0){
			$location.path("/login");
		}else{
			if($scope.count==0){
				ObjUtils.showTips("至少选择一场赛事");
			}else{
				console.log($scope.resultMatch);
				$state.go("/betorder",{"match":$scope.resultMatch});
			}
		}
	}
}]).directive("scoreDiv",[function(){
	return {
		restrict:"EA",
		templateUrl:"./modules/view/tdiv.html",
		scope: false
	}
}]).controller("betorderCtrl",['$scope','DataHelper',"ObjUtils","$location","CookieUtils","Contants","$stateParams","$state",function($scope,DataHelper,ObjUtils,$location,CookieUtils,Contants,$stateParams,$state){
	$scope.match = $stateParams.match;
	console.log($scope.match);
}]);