var personal  = angular.module("personal",['ui.router']);

personal.controller("personalCtrl",['$scope','DataHelper',"CookieUtils","ObjUtils","$location",function($scope,DataHelper,CookieUtils,ObjUtils,$location){
	$scope.userId = CookieUtils.getUserId();
	if($scope.userId==null || $scope.userId.length==0){
		$location.path("/login");
	}
	$scope.user={};
	DataHelper.post(ObjUtils.doadmin+"/app/user/userinfo").success(function(data){
		if(data.status==1){
			$scope.user.betAmount = parseFloat(data.betAmount).toFixed(2);
			$scope.user.cashAmount = parseFloat(data.cashAmount).toFixed(2);
			$scope.user.nickName = data.nickName;
			$scope.user.headImg = data.headPortrait;
			if(data.alipayId && data.alipayId!=null && data.alipayId!=''){
				$scope.user.alipayId = data.alipayId;
			}
			if(data.bankCardId && data.bankCardId!=null && data.bankCardId!=''){
				$scope.user.bankCardId = data.bankCardId;
			}
		}
	});
	
	$scope.toCashOut = function(){
		if($scope.user.alipayId&&$scope.user.bankCardId){
			ObjUtils.showTips("请先绑定收款账号");
			return;
		}
		$location.path("/cashout")
	}
	
	$scope.logout = function(){
		CookieUtils.deleteCookieUser();
		CookieUtils.deleteCookieUser();
		DataHelper.get(ObjUtils.doadmin+"/app/login/loginout").success(function(data){
		});
		$location.path("/index");
	}
}]).controller("rechargeCtrl",['$scope','DataHelper',"CookieUtils","ObjUtils","$location",function($scope,DataHelper,CookieUtils,ObjUtils,$location){
	$scope.userId = CookieUtils.getUserId();
	if($scope.userId==null || $scope.userId.length==0){
		$location.path("/login");
	}
	$scope.zfbTab = false;
	$scope.zfb= {"money":"","zfbnumber":'',"num":""};
	DataHelper.post(ObjUtils.doadmin+"/app/user/userinfo").success(function(data){
		if(data.status==1){
			if(data.alipayId && data.alipayId!=null && data.alipayId!=''){
				$scope.zfb.num = data.alipayId;
			}
		}else{
			//ObjUtils.showTips(data.msg);
		}
	});
	
	//提交支付宝
	$scope.recharge = function(t){
		if(t){
			if($scope.zfb.num!=''){
				$scope.zfb.zfbnumber = $scope.zfb.num;
			}
			if($scope.zfb.money==''||$scope.zfb.money<10){
				ObjUtils.showTips("请输入至少10元整充值金额");
			}else{
				if($scope.zfb.zfbnumber==''){
					ObjUtils.showTips("请输入支付宝账号");
				}else{
					$scope.zfbTab = true;
				}
			}
		}
	}
	//关闭弹窗
	$scope.closeTab = function(){
		$scope.zfbTab = false;
	}
	
	$scope.rechargeTipsTab = false;
	//支付宝充值
	$scope.tozfb = function(){
		window.location.href='https://ds.alipay.com/?scheme=alipays://platformapi/startapp?appId=09999988';
		DataHelper.post(ObjUtils.doadmin+"/app/user/recharge",{"money":$scope.zfb.money,"number":$scope.zfb.zfbnumber,"type":1}).success(function(data){
			if(data.flag){
				$scope.rechargeTipsTab = true;
			}else{
				ObjUtils.showTips(data.msg);
			}
		});
	}
	
	var btns = document.querySelectorAll('button');
	var clipboard = new Clipboard(btns);
    clipboard.on('success', function(e) {
        console.log(e);
    });

    clipboard.on('error', function(e) {
        console.log(e);
    });
}]).controller("setupCtrl",['$scope','DataHelper',"CookieUtils","ObjUtils","$location",function($scope,DataHelper,CookieUtils,ObjUtils,$location){
	$scope.userId = CookieUtils.getUserId();
	if($scope.userId==null || $scope.userId.length==0){
		$location.path("/login");
	}
	$scope.idNumber = '';
	$scope.user ={"idNumber":'',"name":''};
	$scope.pwd={"oldpwd":"","newpwd":"","pwd2":""};
	DataHelper.post(ObjUtils.doadmin+"/app/user/userinfo").success(function(data){
		if(data.status==1){
			if(data.idNumber && data.idNumber!=null && data.idNumber!=''){
				$scope.idNumber = data.idNumber;
			}
			$scope.user.nickName = data.nickName;
			$scope.user.headImg = data.headPortrait;
			if(data.alipayId && data.alipayId!=null && data.alipayId!=''){
				$scope.user.alipayId = data.alipayId;
			}
			if(data.bankCardId && data.bankCardId!=null && data.bankCardId!=''){
				$scope.user.bankCardId = data.bankCardId;
			}
		}
	});
	
	//修改密码
	$scope.updatePwd = function(){
		if($scope.pwd.oldpwd==''||$scope.pwd.oldpwd.length<6||$scope.pwd.oldpwd.length>16){
			ObjUtils.showTips("请输入6-16位旧密码");
			return;
		}
		
		if($scope.pwd.newpwd==''||$scope.pwd.newpwd.length<6||$scope.pwd.newpwd.length>16){
			ObjUtils.showTips("请输入6-16位新密码");
			return;
		}
		
		if($scope.pwd.pwd2==''){
			ObjUtils.showTips("请确认新密码");
			return;
		}
		
		if($scope.pwd.newpwd!=$scope.pwd.pwd2){
			ObjUtils.showTips("两次输入密码不一致");
			return;
		}
		
		DataHelper.post(ObjUtils.doadmin+"/app/user/updatepwd",{"oldPwd":$scope.pwd.oldpwd,"pwd":$scope.pwd.newpwd}).success(function(data){
			if(data.flag){
				$location.path("/setup");
			}else{
				ObjUtils.showTips(data.msg);
			}
		});
	}
	$scope.torealname = function(){
		if($scope.idNumber==''){
			$location.path("/realname");
		}
	}
	
	$scope.checkRealName = function(){
		if($scope.user.name==''||$scope.user.name.length>6||$scope.user.name.length<2){
			ObjUtils.showTips("请输入2-6字姓名");
			return;
		}
		
		if($scope.user.idNumber==''){
			ObjUtils.showTips("请输入身份证号码");
			return;
		}
		
		if(!ObjUtils.isIdCardNo($scope.user.idNumber)){
			ObjUtils.showTips("身份证号码格式错误");
			return;
		}
		
		DataHelper.post(ObjUtils.doadmin+"/app/user/realauthenrication",{"name":$scope.user.name,"idNumber":$scope.user.idNumber}).success(function(data){
			if(data.status==1){
				$location.path("/setup");
			}else{
				ObjUtils.showTips(data.msg);
			}
		});
	}
	
	$scope.type=1;
	$scope.choseType = function(t){
		$scope.type= t;
	}
	
	//点击到下一步
	$scope.next = function(){
		if($scope.type==1){//支付宝绑定
			$location.path("/zfbbind");
		}else{//银行卡绑定
			$location.path("/bankbind");
		}
	}
	
	$scope.zfbbind = {"name":"","alipayId":""};
	$scope.bankbind = {"name":"","bankId":"","bankName":""};
	
	$scope.bind = function(t){
		if(t==1){//支付宝绑定
			if($scope.zfbbind.name==''){
				ObjUtils.showTips("请输入真实姓名");
				return;
			}
			if($scope.zfbbind.alipayId==''){
				ObjUtils.showTips("请输入支付宝账号");
				return;
			}
			DataHelper.post(ObjUtils.doadmin+"/app/user/bindzfb",{"name":$scope.zfbbind.name,"alipayId":$scope.zfbbind.alipayId}).success(function(data){
				if(data.flag){
					$location.path("/setup");
				}else{
					if(data.errcode="400105"){
						ObjUtils.showTips("未登录");
					}
				}
			});
		}else{//绑定银行卡
			if($scope.bankbind.name==''){
				ObjUtils.showTips("请输入真实姓名");
				return;
			}
			if(!ObjUtils.checkBankCard($scope.bankbind.bankId)){
				return;
			}
			if($scope.bankbind.bankName==''){
				ObjUtils.showTips("请输入开户行");
				return;
			}
			DataHelper.post(ObjUtils.doadmin+"/app/user/bindbank",{"bankname":$scope.bankbind.bankName,"bankcard":$scope.bankbind.bankId,"bankcardUser":$scope.bankbind.name}).success(function(data){
				if(data.status==1){
					$location.path("/setup");
				}else{
					if(data.errcode="400105"){
						ObjUtils.showTips("未登录");
					}
				}
			});
		}
	}
}]).controller("cashoutCtrl",['$scope','DataHelper',"CookieUtils","ObjUtils","$location","$timeout",function($scope,DataHelper,CookieUtils,ObjUtils,$location,$timeout){
	$scope.userId = CookieUtils.getUserId();
	if($scope.userId==null || $scope.userId.length==0){
		$location.path("/login");
	}
	
	$scope.user= {"cashAmount":0,"money":""};
	DataHelper.post(ObjUtils.doadmin+"/app/user/userinfo").success(function(data){
		if(data.status==1){
			$scope.user.betAmount = parseFloat(data.betAmount).toFixed(2);
			$scope.user.cashAmount = parseFloat(data.cashAmount).toFixed(2);
			$scope.user.nickName = data.nickName;
			$scope.user.headImg = data.headPortrait;
			if(data.alipayId && data.alipayId!=null && data.alipayId!=''){
				$scope.user.alipayId = data.alipayId;
			}
			if(data.bankCardId && data.bankCardId!=null && data.bankCardId!=''){
				$scope.user.bankCardId = data.bankCardId;
			}
		}else{
			//ObjUtils.showTips(data.msg);
		}
	});
	
	//点击全部提现
	$scope.allCashout = function(){
		if($scope.user.cashAmount==0){
			ObjUtils.showTips("可提现金额不足");
			return;
		}
		$scope.user.money=$scope.user.cashAmount;
	}
	
	//确认提现
	$scope.cashoutToUser = function(){
		if($scope.user.money==''||$scope.user.money<50){
			ObjUtils.showTips("请输入最低50元整提现金额");
			return;
		}
		
		if(!$scope.user.alipayId&&!$scope.user.bankCardId){
			ObjUtils.showTips("请绑定收款账号");
			return;
		}
		
		var type,number;
		if($scope.user.alipayId){
			type = 1;
			number = $scope.user.alipayId;
		}else{
			type = 2;
			number = $scope.user.bankCardId;
		}
		DataHelper.post(ObjUtils.doadmin+"/app/user/cashout",{"cashout":$scope.user.money,"number":number,"type":type}).success(function(data){
			if(data.flag){
				ObjUtils.showTips("您的提现申请成功，我们会及时处理");
				$timeout(function () {
					$location.path("/personal");
			    }, 1500);
			}else{
				ObjUtils.showTips(data.msg);
			}
		});
	}
	
}]).controller("buyrecordCtrl",['$scope','DataHelper',"CookieUtils","ObjUtils","$location",function($scope,DataHelper,CookieUtils,ObjUtils,$location){
	$scope.userId = CookieUtils.getUserId();
	if($scope.userId==null || $scope.userId.length==0){
		$location.path("/login");
	}
	
	var isBottom = false;
    $scope.infinite_isCmp = false;
	
	$scope.record=[];
	
	$scope.type="1";//交易类型
	
	$scope.pageNo = 1;//分页
	
	$scope.pages = 0;
	
	$scope.url = {
			"1":ObjUtils.doadmin+"/app/user/orderbuyrecord",
			"2":ObjUtils.doadmin+"/app/user/buyrecord"
	}
	
	$scope.g_type = {
			"101":"投注",
			"102":"中奖",
			"666":"返现",
			"998":"提现",
			"999":"充值"
	}
	
	//切换交易类型
	$scope.changeType = function(t){
		if(!t){
			t='1';
		}
		$scope.pageNo = 1;
		$scope.type =t;
		$scope.loadRecord();
	}
	
	$scope.loadRecord=function(){
		DataHelper.post($scope.url[$scope.type],{"pageNo":$scope.pageNo}).success(function(data){
			if(data.flag){
				if(data.list!=null && data.list.length>0){
					for(var k in data.list){
						var rd = data.list[k];
						rd.cashType = $scope.g_type[rd.cashType];
						if(rd.cashNumber>0){
							rd.cashNumberStr = "+￥"+parseFloat(rd.cashNumber).toFixed(2);
						}else{
							rd.cashNumberStr = "-￥"+(parseFloat(rd.cashNumber).toFixed(2)*-1);
						}
						if(typeof rd.insertTime != 'string'){
							rd.insertTime = ObjUtils.stringToDate(rd.insertTime,'yyyy-MM-dd hh:mm:ss');
						}
					}
					if($scope.pageNo==1){
						$scope.record = data.list;
					}else{
						Array.prototype.push.apply($scope.record, data.list);
					}
					$scope.pages = parseInt(data.args.total);
					if($scope.pageNo<$scope.pages){
						$scope.pageNo++;
						isBottom = false;
					}else{
						isBottom = true;
					}
				}else{
					$scope.record = [];
				}
				
			}else{
				//ObjUtils.showTips(data.msg);
			}
		});
	}
	$scope.loadRecord();
	
	
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
            $scope.infinite_isCmp = true;
            $scope.$apply();

            //模拟请求延时,将第二次延时2s后
            $timeout(function () {
            	$scope.loadRecord();
            },200);
        }
    }
}]).controller("betRecordCtrl",['$scope','DataHelper',"CookieUtils","ObjUtils","$location","Contants","$timeout",function($scope,DataHelper,CookieUtils,ObjUtils,$location,Contants,$timeout){
	$scope.userId = CookieUtils.getUserId();
	if($scope.userId==null || $scope.userId.length==0){
		$location.path("/login");
	}
	
	var isBottom = false;
    $scope.infinite_isCmp = false;
	
    
	$scope.pageNo = 1;
	$scope.filter = {"lotteryType":'',"lotteryTypeStr":"全部彩种","winStatus":-1,"winStatusStr":"中奖状态","showLottery":false,"showWinStatus":false};
	$scope.map = {
			"lott":{
				"":"全部彩种",
				"1":"竞彩足球",
				"2":"竞彩篮球"
			},
			"win":{
				"":"中奖状态",
				"-1":"待开奖",
				"0":"未中奖",
				"1":"已中奖"
			}
		}
	
	//订单
	$scope.order = [];
	//是否显示详情
	$scope.showDetail = false;
	$scope.showTicket = false;
	$scope.showMx = false;
	$scope.showTab = function(t){
		if(t){
			$scope.filter.showLottery = !$scope.filter.showLottery;
			$scope.filter.showWinStatus = false;
		}else{
			$scope.filter.showWinStatus = !$scope.filter.showWinStatus;
			$scope.filter.showLottery = false;
		}
	}
	
	$scope.searchBy = function(t,v){
		if(t){
			$scope.filter.showLottery = false;
			$scope.filter.lotteryType = v;
			$scope.filter.lotteryTypeStr = $scope.map.lott[v];
		}else{
			$scope.filter.showWinStatus = false;
			$scope.filter.winStatus = v;
			$scope.filter.winStatusStr = $scope.map.win[v];
		}
		$scope.pageNo =1;
		$scope.loadList();
	}
	
	//点击显示详情
	$scope.showDetailFun = function(o){
		$scope.showDetail = true;
		$scope.detail = o;
		if($scope.detail.ticketUrl && $scope.detail.ticketUrl!=null){
			var arr = $scope.detail.ticketUrl.split("uploadfiles");
			if(arr.length>1){
				$scope.detail.ticketUrl = arr[0]+"lwc"+arr[1];
			}
		}
	}
	
	//返回
	$scope.goToBack = function(){
		$scope.showDetail = false;
	}
	
	//继续投注
	$scope.toBet = function(path){
		$location.path("/index");
	}
	
	//显示奖金优化内容
	$scope.showJjyhDetail = function(){
		$scope.jjyhDetail = $scope.detail.jjyhcontentJson;
		for(var key in $scope.jjyhDetail){
			for(var kk in $scope.jjyhDetail[key].matches){
				var mm = $scope.jjyhDetail[key].matches[kk];
				var bet = {};
				var tt ="";
				for(var k in Contants.urlMap.lotteryArr){
					if(mm[Contants.urlMap.lotteryArr[k]]){
						bet = mm[Contants.urlMap.lotteryArr[k]];
						tt = Contants.urlMap.lotteryArr[k];
						break;
					}
				}
				var t = "";
				var o = "";
				for(var h in bet){
					t = h;
					o = bet[h];
				}
				var prefix = "";
				var bstr = Contants.paramsMap[tt][t];
				if(tt=="hhad"){
					prefix = mm.let_points;
					bstr = bstr.replace("让","");
				}
				mm.text = mm.home_team+","+prefix+bstr+","+o;
				console.log(mm.text);
			}
		}
		$scope.showMx = true;
	}
	
	//关闭奖金优化
	$scope.closeJjjTab = function(){
		$scope.showMx = false;
	}
	
	$scope.loadList = function(){
		DataHelper.post("/app/user/getbetorder",{"pageNo":$scope.pageNo,"winStatus":$scope.filter.winStatus,"mtype":$scope.filter.lotteryType}).success(function(data){
			if(data.flag){
				if(data.list!=null &&data.list.length>0){
					for(var k in data.list){
						var v = data.list[k];
						if(typeof v.insertTime != 'string'){
							v.insertTime = ObjUtils.stringToDate(v.insertTime,'yyyy-MM-dd hh:mm:ss');
						}
						v.insertTime = v.insertTime.substring(5,16);
						v.lotteryType = Contants.paramsMap.lott[v.lotteryType];
						v.typePath = Contants.paramsMap.lotteryTypePath[v.lotteryId];
						v.lotteryId = Contants.paramsMap.lotteryTypeStr[v.lotteryId];
						if(v.winStatus==1){
							v.winStatusStr = "已中奖";
						}else if(v.winStatus==0){
							v.winStatusStr = "未中奖";
						}else{
							v.winStatusStr = "待开奖";
						}
						
						if(v.issueStatus==1){
							v.issueStatusStr = "部分出票";
						}else if(v.issueStatus==0){
							v.issueStatusStr = "出票中";
						}else if(v.issueStatus==2){
							v.issueStatusStr = "出票成功";
						}else{
							v.issueStatusStr = "出票失败";
						}
						v.actualBetMoney = v.actualBetMoney==null?v.orderMoney:v.actualBetMoney;
						v.count = ObjUtils.getlen(v.contentJson);
						v.showResult={};
						for(var key in Contants.paramsMap.lotteryArr){
							var wf = Contants.paramsMap.lotteryArr[key];
							for(var ind in v.contentJson){
								if(!v.contentJson[ind].text){
									v.contentJson[ind].text = {};
								}
								if(!v.contentJson[ind].showResult){
									v.contentJson[ind].showResult = {};
								}
								v.contentJson[ind].resultMap = {"had":v.contentJson[ind].spfresult,"crs":v.contentJson[ind].score,"ttg":v.contentJson[ind].zjqresult,
										"hafu":v.contentJson[ind].bqcresult,"mnl":v.contentJson[ind].spfresult,"hdc":v.contentJson[ind].rqspfresult,"hilo":v.contentJson[ind].dxfresult,"wnm":v.contentJson[ind].sfcresult};
								if(v.contentJson[ind].rqspfresult){
									v.contentJson[ind].resultMap["hhad"]="让"+v.contentJson[ind].rqspfresult;
								}
								if(v.contentJson[ind].spfresult&&wf=="mnl"){
									if(v.contentJson[ind].spfresult=="负"){
										v.contentJson[ind].resultMap["mnl"]="客胜";
									}else{
										v.contentJson[ind].resultMap["mnl"]="主胜";
									}
								}
								if(v.contentJson[ind].spfresult&&wf=="hdc"){
									if(v.contentJson[ind].rqspfresult=="负"){
										v.contentJson[ind].resultMap["hdc"]="客让胜";
									}else{
										v.contentJson[ind].resultMap["hdc"]="主让胜";
									}
								}
								if(v.contentJson[ind][wf]){
									v.contentJson[ind].showResult[wf] = v.contentJson[ind].resultMap[wf];
									for(var kw in v.contentJson[ind][wf]){
										if(kw!='winBet'&&kw!="pankou"){
											var txt = Contants.paramsMap[wf][kw];
											if(kw==v.contentJson[ind][wf]['winBet']){
												v.contentJson[ind].text[txt] = "W"+v.contentJson[ind][wf][kw];
											}else{
												v.contentJson[ind].text[txt] = v.contentJson[ind][wf][kw];
											}
										}
									}
								}
							}
						}
					}
					if($scope.pageNo!=1){
						Array.prototype.push.apply($scope.order, data.list);
					}else{
						$scope.order = data.list;
					}
					if($scope.pageNo<data.args.totalPage){
						$scope.pageNo++;
						isBottom = false;
					}else{
						isBottom = true;
					}
				}else{
					$scope.order = [];
				}
			}else{
				//ObjUtils.showTips(data.msg);
			}
		});
	}
	$scope.loadList();
	  
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
            	$scope.loadList();
            },200);
        }
    }
	
}]).controller("myPlanCtrl",['$scope','DataHelper',"CookieUtils","ObjUtils","$location","Contants","$timeout",function($scope,DataHelper,CookieUtils,ObjUtils,$location,Contants,$timeout){
	$scope.userId = CookieUtils.getUserId();
	if($scope.userId==null || $scope.userId.length==0){
		$location.path("/login");
	}
	
	var isBottom = false;
    $scope.infinite_isCmp = false;
    
	$scope.showSetMoney = false;//显示设置金额弹窗
	$scope.pageNo = 1;//分页
	$scope.status = "ing";//进行中
	$scope.plan = [];
	
	$scope.showPlanTab = false;//弹窗
	$scope.planDetail = {};
	
	var betMap = {"3":"h","1":"d","0":"a"};
	//一键投注
	$scope.betOnekey = function(){
		var bet = $scope.planDetail.bet;
		var planMoney = $scope.planDetail.earnMoney;
		var dataMap = {};
		var odds = 1;
		for(var key in bet.contentJson){
			var obj = bet.contentJson[key];
			dataMap[obj.mid] = {}
			if(obj.bet.indexOf("r")!=-1){
				dataMap[obj.mid]['hhad']={};
				dataMap[obj.mid]['hhad'][betMap[obj.bet.substring(1)]] = obj.odd;
			}else{
				dataMap[obj.mid]['had']={};
				dataMap[obj.mid]['had'][betMap[obj.bet]] = obj.odd;
			}
			odds *= obj.odd;
		}
		odds = odds.toFixed(2);
		var betMul = parseInt(planMoney/odds/2)+1;
		var result = {"betMul":betMul,"dataMap":dataMap};
		var param = angular.toJson(result);
		$location.path('order-had').search({"oneKey":param});
	}
	
	
	//设置的money
	$scope.planMoney = '';
	
	//设置盈利金额
	$scope.setEarnMoney = function(id){
		$scope.showSetMoney = true;
		$scope.id = id;
	}
	
	//切换状态
	$scope.switchType = function(t){
		$scope.status = t;
		$scope.pageNo = 1;
		$scope.loadList();
	}
	
	//确定设置金额
	$scope.sureSetMoney = function(){
		if($scope.planMoney==''){
			ObjUtils.showTips("请输入盈利金额");
			return;
		}
		DataHelper.post("/app/plan/setmoney",{"planEarnMoney":$scope.planMoney,"id":$scope.id}).success(function(data){
			if(data.status==1){
				ObjUtils.showTips("设置成功");
				$scope.showSetMoney = false;
				$scope.loadList();
			}
		});
	}
	
	//显示详情
	$scope.showPlanDeatil = function(i,k){
		if(k<0){
			return;
		}
		var plan  = $scope.plan[i];
		var detail = plan.contentList[k];
		console.log(detail);
		if(detail.winStatus<-1){
			return;
		}
		$scope.planDetail.earnMoney = plan.planEarnMoney;
		$scope.planDetail.issueId = plan.id;
		$scope.planDetail.issueInd = i;
		$scope.planDetail.issueNo = plan.issueNo;
		$scope.planDetail.ljMoney = plan.cumulativeBetMoney;
		$scope.planDetail.price = plan.price;
		$scope.planDetail.index = k;
		$scope.planDetail.bet = detail;
		$scope.showPlanTab = true;
	}
	
	$scope.loadList = function(){
		DataHelper.post("/app/plan/myplan",{"pageNo":$scope.pageNo,"status":$scope.status}).success(function(data){
			if(data.status==1){
				if(data.list!=null && data.list.length>0){
					for(var i =0;i<data.list.length;i++){
						var plan = data.list[i];
						plan.issueType = plan.issueType==1?"稳健型":"高收益性";
						var contentArr = plan.contentList;
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
            	$scope.loadList();
            },200);
        }
    }
    
    $scope.loadList();
}]).controller("setnicknameCtrl",['$scope','DataHelper',"CookieUtils","ObjUtils","$location","$timeout","Upload",function($scope,DataHelper,CookieUtils,ObjUtils,$location,$timeout,Upload){
	//
	$scope.user = {"nickname":"","uploadImg":''};
	
	var userId = $location.search().userId;
	
	$scope.upload = function (file) {
        $scope.fileInfo = file;
        console.log(file);
        Upload.upload({
            //服务端接收
            url: ObjUtils.doadmin+"/app/user/setnickname",
            //上传的同时带的参数
            data: {"nickname":$scope.user.nickname,"userId":userId},
            //上传的文件
            file: file
        }).progress(function (evt) {
            //进度条
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progess:' + progressPercentage + '%' + evt.config.file.name);
        }).success(function (data, status, headers, config) {
            //上传成功
            console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
            $scope.uploadImg = data;
            $location.path("/index");
        }).error(function (data, status, headers, config) {
            //上传失败
            console.log('error status: ' + status);
            ObjUtils.showTips(data.msg);
        });
    }
	//去首页
	$scope.tohomePage = function(){
		if($scope.user.nickname==''){
			ObjUtils.showTips("请输入昵称");
			return;
		}
		if($scope.user.nickname.length>6||$scope.user.nickname.length<3){
			ObjUtils.showTips("请输入3-6位昵称");
			return;
		}
		if(userId==null || userId==''){
			ObjUtils.showTips("您未注册成功");
			return;
		}
		DataHelper.post(ObjUtils.doadmin+"/app/user/setnickname",{"nickname":$scope.user.nickname,"userId":userId}).success(function(data){
			if(data.flag){
				//$timeout(function () {
					$location.path("/index");
			    //}, 1500);
			}else{
				ObjUtils.showTips(data.msg);
			}
		});
		 //$scope.upload($scope.file);
		
	}
}]);
