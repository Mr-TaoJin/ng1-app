var plan  = angular.module("plan",['ui.router','utils']);

plan.controller("planCtrl",['$scope','DataHelper',"ObjUtils","$location","CookieUtils","Contants","DateUtils",'$timeout',function($scope,DataHelper,ObjUtils,$location,CookieUtils,Contants,DateUtils,$timeout){
	
	$scope.plan = [];//计划
	$scope.statics = {};//统计的
	$scope.plaType = 1;//计划类型
	$scope.pageNo = 1;//分页
	$scope.type = 1;//计划类型,1稳健2高收益
	var isBottom = false;
	$scope.infinite_isCmp = false;
	$scope.showPlanTab = false;//弹窗
	$scope.planDetail = {};
	
	//支付弹窗
	$scope.showPayTab = false;
	//支付提示
	$scope.payTips = false;
	$scope.pay = 0;
	
	$scope.swichType = function(t){
		$scope.type = t;
		$scope.loadPlanList();
	}
	
	//显示详情
	$scope.showPlanDeatil = function(i,k){
		if(k<0){
			return;
		}
		var plan  = $scope.plan[i];
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
		$scope.planDetail.issueInd = i;
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
	
	//支付宝支付
	$scope.payForZfb = function(){
		document.getElementById("issueId").value = $scope.planDetail.issueId;
		document.getElementById("formTab").submit();
		$scope.payTips = true;
	}
	
	//微信支付
	$scope.parForWx = function(){
		
		DataHelper.post(ObjUtils.doadmin+"/wx/pay/createqrcodeurlapp",{"issueId":$scope.planDetail.issueId}).success(function(data){
			if(data.status==1){
				var codeUrl = data.data.codeUrl;
				window.location.href=codeUrl;
			}
		});
	}
	
	//加载统计数据
	$scope.loadStatics = function(){
		DataHelper.post(ObjUtils.doadmin+"/app/plan/statistics").success(function(data){
			if(data.status==1){
				$scope.statics = data.data;
			}
		});
	}
	
	//加载计划列表
	$scope.loadPlanList = function(){
		DataHelper.post(ObjUtils.doadmin+"/app/plan/planlist",{"type":$scope.type,"pageNo":$scope.pageNo}).success(function(data){
			if(data.status==1){
				if(data.list!=null && data.list.length>0){
					for(var i =0;i<data.list.length;i++){
						var plan = data.list[i];
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
					}
					
					if($scope.pageNo!=1){
						Array.prototype.push.apply($scope.plan, data.list);
					}else{
						$scope.plan = data.list;
					}
					if($scope.pageNo<data.data.totalPage){
						$scope.pageNo++;
						isBottom = false;
					}else{
						isBottom = true;
					}
					
					$scope.plan = data.list;
				}else{
					$scope.plan =[];
				}
				
			}
		});
	}
	//获得元素
    var wai = document.getElementById("waiScrol");
    var content = document.getElementById("contentScrol");

    //监听滚动          
    wai.onscroll = function () {
        var scrollTop = wai.scrollTop,
            viewHeight = wai.clientHeight,
            height = content.offsetHeight;

        //判断是否滚动到底部
        if (((scrollTop + viewHeight) >= height) && !isBottom)                          
        {
            isBottom = true;
            console.log("到底了");
            $scope.infinite_isCmp = true;
            $scope.$apply();

            //模拟请求延时,将第二次延时2s后
            $timeout(function () {
            	$scope.loadPlanList();
            },200);
        }
    }
	$scope.loadStatics();
	$scope.loadPlanList();
}]);