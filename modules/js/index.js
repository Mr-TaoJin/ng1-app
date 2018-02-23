var index = angular.module("index",['ui.router','utils']);

index.controller("indexCtrl",['$scope',"ObjUtils","DataHelper","CookieUtils","$ionicSlideBoxDelegate","$location",function($scope,ObjUtils,DataHelper,CookieUtils,$ionicSlideBoxDelegate,$location){
	$scope.plan = {};
	
	$scope.showPlanTab = false;//弹窗
	$scope.planDetail = {};
	
	//支付弹窗
	$scope.showPayTab = false;
	//支付提示
	$scope.payTips = false;
	$scope.pay = 0;
	
	$scope.banner= [];
	
	$scope.loadBanner = function(){
		
			DataHelper.post(ObjUtils.doadmin+"/app/index/banlist").success(function(data){
				console.log(data)
				if(data.flag){
					var list = data.list;
					if(list!=null && list.length>0){
						$scope.banner = list;
						/*var imgBanner = $("#bannerImg");
					$.each($scope.banner,function(k,v){
						imgBanner.append('<ion-slide><a><img src="'+v.imageAttr.substring(1)+'"/></a></ion-slide>');
					});*/
						$ionicSlideBoxDelegate.loop(true); //解决轮播至最后一个不轮播的问题
						$ionicSlideBoxDelegate.update(); //解决图片加载不出来的问题
					}
				}
			});
	}
	$scope.loadBanner();
	
	//显示详情
	$scope.showPlanDeatil = function(k){
		if(k<0){
			return;
		}
		var plan  = $scope.plan;
		var detail = plan.issueContentList[k];
		if(!plan.buy&&detail.winStatus<0){
			$scope.showPayTab = true;
			$scope.pay = parseFloat(plan.price).toFixed(2);
			return;
		}
		console.log(detail);
		if(detail.winStatus<-1){
			return;
		}
		$scope.planDetail.issueId = plan.id;
		$scope.planDetail.issueNo = plan.issueNo;
		$scope.planDetail.ljMoney = plan.cumulativeBetMoney;
		$scope.planDetail.price = plan.price;
		$scope.planDetail.index = k;
		$scope.planDetail.bet = detail;
		$scope.showPlanTab = true;;
	}
	
	//点击打开支付弹窗
	$scope.showPayTabFun = function(id,price){
		$scope.planDetail.issueId = id;
		$scope.pay = parseFloat(price).toFixed(2);
		$scope.showPayTab = true;
	}
	
	$scope.closePayTab = function(){
		$scope.showPayTab = false;
		$scope.loadIssue();
	}
	
	//支付宝支付
	$scope.payForZfb = function(){
		var userId = CookieUtils.getUserId();
		if(userId!=null && userId.length>0){
			document.getElementById("issueId").value = $scope.planDetail.issueId;
			document.getElementById("formTab").submit();
			$scope.payTips = true;
		}else{
			$location.path("/login");
		}
	}
	
	//微信支付
	$scope.parForWx = function(){
		var userId = CookieUtils.getUserId();
		if(userId!=null && userId.length>0){
			DataHelper.post(ObjUtils.doadmin+"/wx/pay/createqrcodeurlapp",{"issueId":$scope.planDetail.issueId}).success(function(data){
				if(data.status==1){
					var codeUrl = data.data.codeUrl;
					window.location.href=codeUrl;
				}
			});
		}else{
			$location.path("/login");
		}
		
	}
	
	$scope.loadIssue = function(){
		DataHelper.post(ObjUtils.doadmin+"/app/plan/nearplan").success(function(data){
			if(data.status==1){
				if(data.data.issue!=null){
					var plan = data.data.issue;
					var contentArr = plan.issueContentList;
					if(contentArr!=null && contentArr.length>0){
						if(contentArr.length<5){
							var len = contentArr.length;
							for(var j=0;j<5-len;j++){
								var conObj = {};
								if(plan.status==1){
									conObj.winStatus = -3;
								}else{
									conObj.winStatus = -2;
								}
								contentArr.push(conObj);
							}
						}
						
						for(var k in contentArr){
							//if(contentArr[k].winStatus==1)
							switch (contentArr[k].winStatus) {
							case -3:
								contentArr[k].winStr = "停";
								break;
							case -2:
								contentArr[k].winStr = "未出";
								break;
							case -1:
								contentArr[k].winStr = "有单";
								break;
							case 0:
								contentArr[k].winStr = "未中";
								break;
							case 1:
								contentArr[k].winStr = "中奖";
								break;
							default:
								contentArr[k].winStr = "未出";
								break;
							}
							if(contentArr[k].insertTime){
								contentArr[k].insertTime = contentArr[k].insertTime.substring(5,16);
							}else{
								contentArr[k].insertTime = "-";
							}
							if(contentArr[k].content){
								
							}
						}
					}
					$scope.plan = plan
				}else{
					$scope.plan =null;
				}
			}
		});
	}
	
	$scope.loadIssue();
}]);

