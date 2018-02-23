var  orderJczq= angular.module("orderJczq",['ui.router','utils']);

var matchNumWeek={"周一":1,"周二":2,"周三":3,"周四":4,"周五":5,"周六":6,"周日":7};
var poolLimit = { "hhad": 8, "had": 8, "crs": 4, "ttg": 6, "hafu": 4, "mnl": 8, "hdc": 8, "wnm": 4, "hilo": 8 };
var poolCode = { "nspf": "had", "spf": "hhad", "bf": "crs", "zjq": "ttg", "bqc": "hafu", "sf": "mnl", "rfsf": "hdc", "sfc":"wnm", "dxf":"hilo" };
var poolId = { "hhad":56, "had": 51, "crs": 52, "ttg": 53, "hafu": 54,'ht':59, "mnl": 62, "hdc": 61, "wnm": 63, "hilo":64,'lqht':69 };
var optionAry = [[], [], [["2x1", "2"]], [["3x1", "3"], ["3x3", "2"], ["3x4", "23"]], [["4x1", "4"], ["4x4", "3"], ["4x5", "34"], ["4x6", "2"], ["4x11", "234"]], [["5x1", "5"], ["5x5", "4"], ["5x6", "45"], ["5x10", "2"], ["5x16", "345"], ["5x20", "23"], ["5x26", "2345"]], [["6x1", "6"], ["6x6", "5"], ["6x7", "56"], ["6x15", "2"], ["6x20", "3"], ["6x22", "456"], ["6x35", "23"], ["6x42", "3456"], ["6x50", "234"], ["6x57", "23456"]], [["7x1", "7"], ["7x7", "6"], ["7x8", "67"], ["7x21", "5"], ["7x35", "4"], ["7x120", "234567"]], [["8x1", "8"], ["8x8", "7"], ["8x9", "87"], ["8x28", "6"], ["8x56", "5"], ["8x70", "4"], ["8x247", "2345678"]]];


orderJczq.controller('OrderJcZqCtrl', ['$timeout','DataHelper','$scope','DateUtils',"Contants","ObjUtils","$location","CookieUtils",function($timeout,DataHelper,$scope,DateUtils,Contants,ObjUtils,$location,CookieUtils){
	var scp = $scope;
	var path = $location.absUrl();
	var ltype = path.split("-")[1];
	if(ltype.indexOf("?oneKey")!=-1){
		ltype = ltype.split("?oneKey")[0];
	}
	scp.g_config={
			minute_before_playtime:10,// 提前10分钟截止
			show_single_only:false,// 单关开关
			lottery_type:ltype
	}
	scp.p_config = ObjUtils.deepClone(scp.g_config);
	

	scp.dataMatch={};//存放数据的变量
	scp.jsonData = {};//原始数据
	scp.nowTime=new Date().getTime();//当前时间
	scp.timeoutval=0;//定时任务
	scp.matchGame={totalMatchCount:0};//联赛
	//选择赛事数据对象
	scp.selectMatchMap = {};
	//选择赛事的长度
	scp.count = 0;
	
	//是否单关
	scp.isDan = false;
	//显示隐藏弹窗
	scp.showTab = false;
	//赛事筛选显示
	scp.filterMacth = false;
	//跟单页面显示
	scp.isFollowOrder = false;
	//所有的联赛名称
	scp.l_name_map = {}; 
	//页面显示的变量tab
	scp.tabSelectMap = {};
	//弹窗需要显示的赛事
	scp.tabMatch = {};
	
	//投注成功弹窗
	scp.betSuccess = false;
	//跟单页面显示的数据
	scp.showForOrder = {};
	
	scp.betOptCount=0;//投注选项个数
	scp.betCnMap= Contants.paramsMap;
	scp.betEnMap= Contants.betEnMap;
	
	//奖金优化显示
	scp.showJjyhTab =false;
	
	//奖金优化所需最小金额
	scp.minJjyhMoney=0;
	
	//用户信息
	scp.userInfo= {"cashAmount":0};
	
	scp.loadUserInfo = function(){
		DataHelper.post(ObjUtils.doadmin+"/app/user/userinfo").success(function(data){
			if(data.status==1){
				scp.userInfo.cashAmount = parseFloat(data.betAmount).toFixed(2);
			}
		});
	}
	
	
	//一键投注传递过来的数据
	scp.oneKeyLoad = function(){
		if($location.search()&&ObjUtils.getlen($location.search())>0){
			scp.oneKeyMap = eval("("+$location.search().oneKey+")");
			var betMul = scp.oneKeyMap.betMul;
			var dataMap = scp.oneKeyMap.dataMap;
			//vm.jsonData vm.choseMatch
			var isNext = true;
			for(var key in dataMap){
				if(dataMap[key]['had']){
					scp.selectMatchMap[key] = {};
					for(var kk in dataMap[key]['had']){
						if(scp.jsonData[key]){
							scp.selectMatchMap[key]['had'] = {};
							scp.selectMatchMap[key]['had'][kk] = scp.jsonData[key]['had'][kk];
						}
					}
				}
				if(dataMap[key]['hhad']){
					scp.selectedMatch[key] = {};
					for(var kk in dataMap[key]['hhad']){
						if(scp.jsonData[key]){
							scp.selectMatchMap[key]['hhad'] = {};
							scp.selectMatchMap[key]['hhad'][kk] = scp.jsonData[key]['hhad'][kk];
						}
					}
				}
				if(scp.jsonData[key]){
					scp.selectMatchMap[key].m = scp.jsonData[key];
				}
				if(!scp.selectMatchMap[key]||ObjUtils.getlen(scp.selectMatchMap[key])==0){
					isNext = false;
				}
			}
			scp.count = ObjUtils.getlen(scp.selectMatchMap[key]);
			if(isNext){
				//scp.selectMatchMap.length = scp.betOptCount;
				scp.next();
			}
			$location.search('oneKey',null); 
		}
	}
	
	scp.betOrder = {};
	//确认投注
	scp.sureorder = function(){
		$scope.userId = CookieUtils.getUserId();
		if($scope.userId==null || $scope.userId.length==0){
			$location.path("/login");
			return;
		}
		
		if(scp.isFollowOrder&&!scp.showJjyhTab){//非奖金优化投注
			if(scp.order.betMul==''||scp.order.betMul==0){
				ObjUtils.showTips("至少投注一倍");
				return;
			}
			scp.betOrder.passType = scp.getPassWay();
			if(scp.betOrder.passType.length==0){
				ObjUtils.showTips("请选择至少一种过关方式");
				return;
			}
			for(var p in scp.betOrder.passType){
				if(scp.betOrder.passType[p]=="单关"){
					scp.betOrder.passType[p] = "101";
				}else{
					scp.betOrder.passType[p] = scp.betOrder.passType[p].replace("x","0");
				}
			}
			scp.betOrder.passType = scp.betOrder.passType.join(",");
			
			if(scp.userInfo.cashAmount<scp.order.orderMoney){
				ObjUtils.showTips("您的余额不足");
				return;
			}
			scp.betOrder.isJjyh = 0;
			scp.betOrder.mul = scp.order.betMul;
			scp.betOrder.mType = 1;
			scp.betOrder.lotteryId = Contants.paramsMap.lotteryType[scp.g_config.lottery_type];
			scp.betOrder.source = 1;
			scp.betOrder.totalPrice = scp.order.orderMoney;
			scp.betOrder.expectBonus = scp.order.orderAwardMax;
			scp.betOrder.content = [];
			scp.betOrder.mids = "";
			for(var k in scp.selectMatchMap){
				var bor = {};
				var match = scp.selectMatchMap[k];
				bor.mid = k;
				bor.num = match['m'].num;
				bor.lname = match['m'].l_cn_abbr;
				bor.home_team = match['m'].h_cn_abbr;
				bor.visiting_team = match['m'].a_cn_abbr;
				for(var kk in match){
					if(kk!='m'&&kk!='arr'){
						bor[kk] = match[kk];
						if(kk=='hhad'){
							bor[kk]["pankou"] = match['m'].hhad['fixedodds'];
						}
					}
				}
				scp.betOrder.content.push(bor);
				scp.betOrder.mids += ","+k;
			}
			scp.betOrder.mids = scp.betOrder.mids.substring(1);
			DataHelper.post(ObjUtils.doadmin+"/app/order/betsubmit",{"order":angular.toJson(scp.betOrder)}).success(function(data){
				if(data.status==1){
					scp.betSuccess = true;
				}else{
					ObjUtils.showTips(data.errcode);
				}
			});
			
		}else{//奖金优化投注
			if(scp.order.orderMoney==''||scp.order.orderMoney<scp.minJjyhMoney){
				ObjUtils.showTips("至少投注"+scp.minJjyhMoney+"元");
				return;
			}
			if(scp.userInfo.cashAmount<scp.order.orderMoney){
				ObjUtils.showTips("您的余额不足");
				return;
			}
			
			scp.betOrder.passType = scp.getPassWay();
			for(var p in scp.betOrder.passType){
				if(scp.betOrder.passType[p]=="单关"){
					scp.betOrder.passType[p] = "101";
				}else{
					scp.betOrder.passType[p] = scp.betOrder.passType[p].replace("x","0");
				}
			}
			scp.betOrder.passType = scp.betOrder.passType.join(",");
			scp.betOrder.isJjyh = 1;
			//scp.betOrder.mul = scp.order.betMul;
			scp.betOrder.mType = 1;
			scp.betOrder.lotteryId = Contants.urlMap.lotteryType[scp.g_config.lottery_type];
			scp.betOrder.source = "app";
			scp.betOrder.totalPrice = scp.order.orderMoneyJjyh;
			scp.betOrder.expectBonus = scp.order.orderAwardMax;
			scp.betOrder.isTicket = scp.isTicket?1:0;
			scp.betOrder.content = [];//标准投注內容
			scp.betOrder.mids = "";
			for(var k in scp.selectMatchMap){
				var bor = {};
				var match = scp.selectMatchMap[k];
				bor.mid = k;
				bor.num = match['m'].num;
				bor.lname = match['m'].l_cn_abbr;
				bor.home_team = match['m'].h_cn_abbr;
				bor.visiting_team = match['m'].a_cn_abbr;
				for(var kk in match){
					if(kk!='m'&&kk!='arr'){
						bor[kk] = match[kk];
						if(kk=='hhad'){
							bor[kk]["pankou"] = match['m'].hhad['fixedodds'];
						}
					}
				}
				scp.betOrder.content.push(bor);
				scp.betOrder.mids += ","+k;
			}
			scp.betOrder.mids = scp.betOrder.mids.substring(1);
			
			scp.betOrder.jjyhcontent = [];//奖金优化內容
			for(var k in scp.jjyhlist){
				var jjyh = scp.jjyhlist[k];
				var orderMatch = {};
				orderMatch['passway']= jjyh['ggtype'].replace("*","0");
				orderMatch['mul'] = jjyh['bs'];
				orderMatch['winStatus'] = -1;
				orderMatch.matches = [];
				for(var kk in jjyh){
					if(typeof jjyh[kk] == "object"){
						var match = {};
						match.mid = jjyh[kk].id;
						match.num = jjyh[kk].pname;
						match.home_team=scp.jsonData[match.mid]['h_cn_abbr'];
						match.visiting_team=scp.jsonData[match.mid]['a_cn_abbr'];
						var lt = Contants.betEnMap.lotteryType[jjyh[kk].type];
						if(lt=="hhad"){
							match.let_points = scp.jsonData[match.mid]['hhad']['fixedodds'];
						}
						match[lt] = {};
						match[lt][jjyh[kk].bet]=jjyh[kk].sp;
						orderMatch.matches.push(match);
					}
				}
				scp.betOrder.jjyhcontent.push(orderMatch);
			}
			DataHelper.post(ObjUtils.doadmin+"/app/bet/order",{"order":angular.toJson(scp.betOrder)}).success(function(data){
				if(data.flag){
					scp.betSuccess = true;
				}else{
					ObjUtils.showTips(data.msg);
				}
			});
			
		}
	}
	//关闭成功提示
	scp.kownForOrder = function(){
		scp.betSuccess = false;
		$location.path("/betrecord");
		
	}
	
	//平均，博热，博冷
	scp.jjyhChange=function(type){
		if(scp.jjyh.type==type){
			return;
		}
		scp.jjyh.type=type;
		OP.changeType(type);
	}
	
	//奖金优化
	//展开奖金优化页面
	scp.showJjyh = function(){
		var passway = scp.getPassWay();
		if(passway.length==0){
			ObjUtils.showTips("请选择一个串关进行奖金优化");
		}else if(passway[0]=="单关"&&passway.length==1){
			//ObjUtils.showTips("奖金优化不支持组合过关");
			ObjUtils.showTips("请选择一个串关进行奖金优化");
		}else if(passway.length>1){
			//ObjUtils.showTips("奖金优化不支持组合过关");
			ObjUtils.showTips("奖金优化不支持多种串关方式");
		}else if(scp.order.betMul<=1){
			ObjUtils.showTips("奖金优化方案倍数必须大于1");
		}else if(scp.betOptCount==ObjUtils.getlen(scp.selectMatchMap)>0){
			ObjUtils.showTips("必须有一场比赛为复式组合");
		}else if(scp.order.betnum==0){
			ObjUtils.showTips("暂时不支持注数为0的奖金优化");
		}else if(scp.order.betnum>500){
			ObjUtils.showTips("暂时不支持注数大于500的奖金优化");
		}else if(passway.length==1){
			scp.showJjyhTab = true;
			scp.isFollowOrder = false;
			scp.jjyh={type:'avg'};
			scp.jjyh.passway = parseInt(passway[0].charAt(0));
			scp.jjyhCalc();
		}else{
			ObjUtils.showTips("最多选择一种串关,你选择了"+passway.join(" "));
		}
	}
	
	//改变单项位数
	scp.jjyhChangebs = function(num,item){
		if(item.bs==''&&num==''){
			item.bs=1;
		}
		if(item.bs<1){
			item.bs = 1;
		}
		if(item.bs>99999){
			item.bs = 99999;
		}
		item.bs = parseInt(item.bs);
		OP.changebs(num,item);
		scp.order.orderMoneyJjyh = scp.order.orderMoney;
	}
	
	//奖金优化计算
	scp.jjyhCalc = function(num){
		var jjyhMoney = parseInt(scp.order.orderMoneyJjyh);
		if(jjyhMoney==0 || isNaN(jjyhMoney)||jjyhMoney<scp.minJjyhMoney){
			/*ObjUtils.showTips("奖金优化金额不能为空");
			return;*/
			jjyhMoney = scp.minJjyhMoney;
		}
		if(jjyhMoney%2!=0){
			ObjUtils.showTips("奖金优化金额必须为偶数");
			return;
		}
		if(!num || isNaN(num)){
			num = 0;
		}
		scp.order.orderMoneyJjyh = jjyhMoney+parseInt(num)*scp.minJjyhMoney;
		if(scp.order.orderMoneyJjyh<0 || isNaN(scp.order.orderMoneyJjyh)){
			scp.order.orderMoneyJjyh=scp.order.orderMoney;
		}
		OP.main(scp);
		scp.minJjyhMoney = scp.jjyhlist.length*2;
	}
	
	//奖金优化返回
	scp.backToFollowOrder = function(){
		scp.isFollowOrder = true;
		scp.showJjyhTab = false;
	}
	
	//跟单页点击返回
	scp.backToSelectMacth = function(){
		scp.isFollowOrder = false;
		for(var k in scp.selectMatchMap){
			if(scp.selectMatchMap[k]['m']){
				delete scp.selectMatchMap[k]['m'];
			}
		}
	}
	
	//获取投注倍数焦点
	window.scrollToTopForIp = function(obj){
		
	}
	

	//得到投注选项个数
	scp.getBetOptCount = function(){
		if(scp.selectMatchMap && ObjUtils.getlen(scp.selectMatchMap)>0){
			for(var k in scp.selectMatchMap){
				for(var kk in scp.selectMatchMap[k]){
					scp.betOptCount++;
				}
			}
		}
	}
	
	//投注倍数限制
	scp.limitNum = function(){
		if(scp.order.betMul==''){
			scp.order.betMul = 0;
		}	
		if(scp.order.betMul>100000){
			scp.order.betMul = 100000;
		}
		scp.order.betMul = parseInt(scp.order.betMul);
		scp.calcMoney();
	}
	
	//倍数加减
	scp.addOrSub = function(t){
		if(t==1){
			if(scp.order.betMul>1){
				scp.order.betMul= scp.order.betMul-1;
			}
		}else{
			if(scp.order.betMul<100000){
				scp.order.betMul= scp.order.betMul+1;
			}
		}
		scp.calcMoney();
	}
	
	scp.getPassWay=function(){
		var passwayArr = [];
		for(var i in scp.passway){
			if(scp.passway[i]=="1"){
				var p = i.replace("串","x");
				passwayArr.push(p);
			}
		}
		return passwayArr;
	}
	
	//计算投注额和奖金区间
	scp.calcMoney = function(num){
		if(!num || isNaN(num)){
			num = 0;
		}
		scp.order.betMul = parseInt(scp.order.betMul)+parseInt(num);
		if(scp.order.betMul<0 || isNaN(scp.order.betMul)){
			scp.order.betMul=0;
		}
		var passway  = scp.getPassWay();
		if(passway.length==0||scp.selectMatchMap.length==0 || scp.order.betMul==0){
			scp.order.orderMoney=0;
			scp.order.orderAwardMin=0;
			scp.order.orderAwardMax=0;
		    return;
		}
		jczq.vm =scp;
		if(scp.isDan && scp.passway["单关"] && scp.passway["单关"]=="1"){
		    var betnum=scp.betOptCount;
		    scp.order.betnum=betnum;
		    scp.order.orderMoney=betnum*scp.order.betMul*2;
		    scp.order.orderAwardMin=0;
		    scp.order.orderAwardMax=0;
	    	for(var mid in scp.selectMatchMap){
	    		var selectedM = scp.selectMatchMap[mid];
	    		for(var pool in selectedM){
	    			if(poolLimit[pool] && selectedM[pool]){//玩法
	    				var minsp=10000,maxsp=0;
	    				for(var bet in selectedM[pool]){
	    					var sp = parseFloat(selectedM[pool][bet]);
	    					if(sp < minsp){
	    						minsp = sp;
	    					}
	    					if(sp > maxsp ){
	    						maxsp = sp;
	    					}
	    				}
	    				//取最小的奖金（一场比赛,同一个玩法,只有一个投注结果中奖)
	    				scp.order.orderAwardMin += minsp*2*scp.order.betMul ;
	    				scp.order.orderAwardMax += maxsp*2*scp.order.betMul;//取每玩法的最大奖金合计
	    			}
	    		}
	    	}
	    	scp.order.orderAwardMin= scp.order.orderAwardMin.toFixed(2);
	    	scp.order.orderAwardMax=scp.order.orderAwardMax.toFixed(2);
		    return;
	   }
		
		var reObj = jczq.bet.main();
//		var reObj = getOrderInfo();
		scp.order.betnum = reObj.betNum; 
		scp.order.followMoney=scp.order.betnum*2;
		scp.order.orderMoney = (scp.order.betnum*scp.order.betMul*2);
		scp.order.orderAwardMin = reObj.min.toFixed(2);
		scp.order.orderAwardMax = reObj.max.toFixed(2);
		scp.order.orderMoneyJjyh=scp.order.orderMoney;
	}
	
	//点击下一步
	scp.next = function(){
		scp.showForOrder = {};
		//订单计算后数据
		scp.order={betMul:10,betnum:0,orderMoney:0,orderMoneyJjyh:0,orderAwardMin:0,orderAwardMax:0,followAllow:true,followMoney:0};
		var isSingle = true;
		for(var tk in scp.selectMatchMap){
			for(var tkk in scp.selectMatchMap[tk]){
				if(tkk!='arr'&&tkk!='m'){
					if(scp.jsonData[tk][tkk].single&&scp.jsonData[tk][tkk].single!='1'){
						isSingle = false;
					}
				}
			}
		}
		if(scp.count<1){
			ObjUtils.showTips("至少选择一场赛事");
		}else if(scp.count==1&&!isSingle){
			ObjUtils.showTips("非单关赛事至少选择两场赛事");
		}else{
			scp.getBetOptCount();
			scp.isFollowOrder = true;
			scp.passway = {};
			if(scp.count==1||scp.isDan){
				scp.passway["单关"]="1";
			}else{
				scp.passway["单关"]="0";
			}
			var ind = 0;
			var flag = true;
			for(var k in scp.selectMatchMap){
				var m = scp.selectMatchMap[k];
				scp.showForOrder[k] = {};
				var arrBet = [];
				var arrOdds = [];
				
				if(m['had']){
					scp.getSortArr(m['had'],arrBet,arrOdds,'had');
					if(scp.jsonData[k].had.single!='1'){
						flag = false;
					}
				}
				
				if(m['hhad']){
					scp.getSortArr(m['hhad'],arrBet,arrOdds,'hhad');
					if(scp.jsonData[k].hhad.single!='1'){
						flag = false;
					}
				}
				
				if(m['crs']){
					scp.getSortArr(m['crs'],arrBet,arrOdds,'crs');
					if(scp.jsonData[k].crs.single!='1'){
						flag = false;
					}
				}
				
				if(m['ttg']){
					scp.getSortArr(m['ttg'],arrBet,arrOdds,'ttg');
					if(scp.jsonData[k].ttg.single!='1'){
						flag = false;
					}
				}
				
				if(m['hafu']){
					scp.getSortArr(m['hafu'],arrBet,arrOdds,'hafu');
					if(scp.jsonData[k].hafu.single!='1'){
						flag = false;
					}
				}
				scp.showForOrder[k]['bet'] = arrBet;
				scp.showForOrder[k]['odds'] = arrOdds;
				scp.showForOrder[k]['m']=scp.jsonData[k];
				scp.selectMatchMap[k]['m']=scp.jsonData[k];
				if(ind>0&&ind<8&&!scp.isDan){
					var a = "0";
					if(ind==scp.count-1||ind==7){
						a="1";
					}
					scp.passway[(ind+1)+"串1"] = a;
				}
				ind++;
				
				if(!flag){
					delete scp.passway["单关"];
				}
			}
			scp.calcMoney();
		}
	}
	
	scp.deleteSelectMacth = function(n){
		if(scp.passway["单关"]&&scp.count>1){
			delete scp.selectMatchMap[n];
			scp.setCount();
			scp.next();
		}else{
			if(scp.passway["单关"]){
				ObjUtils.showTips("单关至少选择一场赛事");
			}else{
				if(!scp.passway["单关"]&&scp.count>2){
					delete scp.selectMatchMap[n];
					scp.setCount();
					scp.next();
				}else{
					ObjUtils.showTips("至少选择两场赛事");
				}
			}
		}
		
	}
	
	//选择串关方式
	scp.chosePassway = function(k){
		if(scp.passway[k]=="1"){
			scp.passway[k] = "0";
		}else{
			scp.passway[k] = "1";
		}
		scp.calcMoney();
	}
	
	//排序
	scp.getSortArr = function(obj,arrBet,arrOdds,lotteryType){
		var arrMnl = [];
		var objOdds = {};
		for(var kk in obj){
			arrMnl.push(kk);
			objOdds[kk] = obj[kk];
		}
		Contants.sortbasketArrFun(arrMnl);
		var oArr = [];
		for(var ko in arrMnl){
			oArr.push(objOdds[arrMnl[ko]]);
			arrMnl[ko]=Contants.paramsMap[lotteryType][arrMnl[ko]];
		}
		Array.prototype.push.apply(arrBet, arrMnl);
		Array.prototype.push.apply(arrOdds, oArr);
	}
	
	//混合过关展示数据
	scp.showMatchTab = function(mid){
		scp.tabMatch = scp.jsonData[mid];
		scp.showTab = true;
		//页面显示的变量
		scp.tabSelectMap = {};
		if(scp.g_config.lottery_type=='ht'){
			for(var k in Contants.JczqLotteryTypeArr){
				if(scp.selectMatchMap[mid]&&scp.selectMatchMap[mid][Contants.JczqLotteryTypeArr[k]]){
					scp.tabSelectMap[mid] = {};
					scp.tabSelectMap[mid][Contants.JczqLotteryTypeArr[k]] = ObjUtils.deepClone(scp.selectMatchMap[mid][Contants.JczqLotteryTypeArr[k]]);
				}
			}
		}else{
			if(scp.selectMatchMap[mid]&&scp.selectMatchMap[mid][scp.g_config.lottery_type]){
				scp.tabSelectMap[mid] = {};
				scp.tabSelectMap[mid][scp.g_config.lottery_type] = ObjUtils.deepClone(scp.selectMatchMap[mid][scp.g_config.lottery_type]);
			}
		}
		
	}
	
	//设置赛事数量
	scp.setCount = function(){
		scp.count = ObjUtils.getlen(scp.selectMatchMap);
	}
	
	//选择联赛
	scp.selectLname = function(l){
		scp.l_name_map[l] = !scp.l_name_map[l];
	}
	//筛选按钮
	scp.allSelect = function(tt){
		switch (tt) {
		case 1:
			for(var k in scp.l_name_map){
				scp.l_name_map[k] = "1";
			}
			break;
		case 2:
			for(var k in scp.l_name_map){
				if(scp.l_name_map[k]=='1'){
					scp.l_name_map[k] = "0";
				}else{
					scp.l_name_map[k] = "1";
				}
			}
			break;
		default:
			break;
		}
	}
	
	//赛事筛选返回
	scp.showBack = function(){
		scp.filterMacth = false;
		for(var d in scp.dataMatch){
			var list = scp.dataMatch[d].list;
			for(var k in list){
				var obj = list[k];
				scp.l_name_map[obj.l_cn_abbr] = obj.show;
			}
		}
	}
	
	//确定筛选
	scp.srueFilterMatch = function(){
		for(var d in scp.dataMatch){
			scp.dataMatch[d].show= true;
			var list = scp.dataMatch[d].list;
			for(var k in list){
				var obj = list[k];
				obj.show = scp.l_name_map[obj.l_cn_abbr];
			}
			var hasChild = false;
			for(var kk in list){
				if(list[kk].show=="1"){
					hasChild = true;
				}
			}
			scp.dataMatch[d].hasChild = hasChild;
		}
		scp.filterMacth = false;
	}
	
	//点击展示赛事筛选页
	scp.showFilterTab = function(){
		scp.filterMacth = true;
		scp.matchSize = ObjUtils.getlen(scp.jsonData);
	}
	
	//全部和单关的切换
	scp.choseSelect = function(d){
		if(d){
			scp.isDan = true;
		}else{
			scp.isDan = false;
		}
		for(var k in scp.dataMatch){
			scp.dataMatch[k].show= true;
			if(scp.isDan){
				var hasChild = false;
				for(var key in scp.dataMatch[k].list){
					if(scp.dataMatch[k].list[key].single){
						hasChild = true;
					}
				}
				scp.dataMatch[k].hasChild = hasChild;
			}else{
				scp.dataMatch[k].hasChild = true;
			}
		}
		scp.selectMatchMap = {};
		scp.setCount();
	}
	
	//显示或者影藏
	scp.showOrHide = function(d){
		scp.dataMatch[d].show = !scp.dataMatch[d].show;
	}
	
	//常量URL
	scp.urlMap=Contants.urlMap;
	
	scp.loadMatch = function(){
		var url=Contants.urlMap[scp.p_config.lottery_type];
		DataHelper.getScript(url);
	}
	
	//生成显示字符串
	scp.creteWnmStr = function(){
		var arrStr = "";
		var arr = [];
		if(scp.g_config.lottery_type=='ht'){
			var ltArr = Contants.JczqLotteryTypeArr;
			for(var k in ltArr){
				if(scp.selectMatchMap[scp.tabMatch.id] && scp.selectMatchMap[scp.tabMatch.id][ltArr[k]]){
					var wnm = scp.selectMatchMap[scp.tabMatch.id][ltArr[k]];
					for(var key in wnm){
						arr.push(Contants.paramsMap[ltArr[k]][key]);
					}
					//arrStr = arrStr.substring(1);
				}else{
					if(scp.selectMatchMap[scp.tabMatch.id]){
						if(!scp.selectMatchMap[scp.tabMatch.id][ltArr[k]]){
							if(scp.selectMatchMap[scp.tabMatch.id]['arr']&&ObjUtils.getlen(scp.selectMatchMap[scp.tabMatch.id])==1){
								delete scp.selectMatchMap[scp.tabMatch.id]['arr'];
							}
						}
						if(scp.selectMatchMap[scp.tabMatch.id] && JSON.stringify(scp.selectMatchMap[scp.tabMatch.id])=='{}'){
							delete scp.selectMatchMap[scp.tabMatch.id];
						}
					}
				}
			}
		}else{
			if(scp.selectMatchMap[scp.tabMatch.id] && scp.selectMatchMap[scp.tabMatch.id][scp.g_config.lottery_type]){
				var wnm = scp.selectMatchMap[scp.tabMatch.id][scp.g_config.lottery_type];
				for(var key in wnm){
					arr.push(Contants.paramsMap[scp.g_config.lottery_type][key]);
				}
				//arrStr = arrStr.substring(1);
			}else{
				if(scp.selectMatchMap[scp.tabMatch.id]){
					if(!scp.selectMatchMap[scp.tabMatch.id][scp.g_config.lottery_type]){
						if(scp.selectMatchMap[scp.tabMatch.id]['arr']&&ObjUtils.getlen(scp.selectMatchMap[scp.tabMatch.id])==1){
							delete scp.selectMatchMap[scp.tabMatch.id]['arr'];
						}
					}
					if(scp.selectMatchMap[scp.tabMatch.id] && JSON.stringify(scp.selectMatchMap[scp.tabMatch.id])=='{}'){
						delete scp.selectMatchMap[scp.tabMatch.id];
					}
				}
			}
		}
		if(arr.length>0){
			Contants.sortbasketArrFun(arr);
			if(arr.length<4){
				for(var k = 0;k<arr.length;k++){
					arrStr += arr[k]+",";
				}
			}else{
				for(var k = 0;k<3;k++){
					arrStr += arr[k]+",";
				}
				arrStr += "...,";
			}
			arrStr = arrStr.substring(0,arrStr.length-1);
			scp.selectMatchMap[scp.tabMatch.id]['arr'] = arrStr;
		}
	}
	
	//取消选择
	scp.removeSelect=function(){
		scp.showTab = false;
		if(scp.g_config.lottery_type=='ht'){
			var ltArr = Contants.JczqLotteryTypeArr;
			for(var k in ltArr){
				var lt = ltArr[k];
				if(scp.tabSelectMap[scp.tabMatch.id]&&scp.tabSelectMap[scp.tabMatch.id][lt]){
					if(!scp.selectMatchMap[scp.tabMatch.id]){
						scp.selectMatchMap[scp.tabMatch.id] = {};
					}
					scp.selectMatchMap[scp.tabMatch.id][lt] = scp.tabSelectMap[scp.tabMatch.id][lt];
				}else{
					if(scp.selectMatchMap[scp.tabMatch.id]&&scp.selectMatchMap[scp.tabMatch.id][lt]){
						delete scp.selectMatchMap[scp.tabMatch.id][lt];
						if(JSON.stringify(scp.selectMatchMap[scp.tabMatch.id])=='{}'){
							delete scp.selectMatchMap[scp.tabMatch.id];
						}
					}
				}
			}
		}else{
			if(scp.tabSelectMap[scp.tabMatch.id]&&scp.tabSelectMap[scp.tabMatch.id][scp.g_config.lottery_type]){
				if(!scp.selectMatchMap[scp.tabMatch.id]){
					scp.selectMatchMap[scp.tabMatch.id] = {};
				}
				scp.selectMatchMap[scp.tabMatch.id][scp.g_config.lottery_type] = scp.tabSelectMap[scp.tabMatch.id][scp.g_config.lottery_type];
			}else{
				if(scp.selectMatchMap[scp.tabMatch.id]&&scp.selectMatchMap[scp.tabMatch.id][scp.g_config.lottery_type]){
					delete scp.selectMatchMap[scp.tabMatch.id][scp.g_config.lottery_type];
					if(JSON.stringify(scp.selectMatchMap[scp.tabMatch.id])=='{}'){
						delete scp.selectMatchMap[scp.tabMatch.id];
					}
				}
			}
		}
		scp.creteWnmStr();
		scp.setCount();
	}
	
	//确认选择
	scp.sureSelect = function(){
		scp.showTab = false;
		scp.creteWnmStr();
		scp.setCount();
	}
	
	//点击选择赛果
	scp.selectMatch = function(mid,r,b){
		if(scp.count>=8&&!scp.selectMatchMap[mid]){
			ObjUtils.showTips("至多选择8场赛事");
			return;
		}
		var tt = scp.g_config.lottery_type;
		if(tt == 'ht'||b=='hhad') {
			tt = b;
		}
		if(!scp.selectMatchMap[mid]){
			scp.selectMatchMap[mid] = {};
			scp.selectMatchMap[mid][tt] = {};
			scp.selectMatchMap[mid][tt][r] = scp.jsonData[mid][tt][r];
		}else{
			if(!scp.selectMatchMap[mid][tt]){
				scp.selectMatchMap[mid][tt] = {};
				scp.selectMatchMap[mid][tt][r] = scp.jsonData[mid][tt][r];
			}else{
				if(scp.selectMatchMap[mid][tt][r]){
					delete scp.selectMatchMap[mid][tt][r];
					if(ObjUtils.getlen(scp.selectMatchMap[mid][tt])==0){
						delete scp.selectMatchMap[mid][tt];
						if(ObjUtils.getlen(scp.selectMatchMap[mid])==0){
							delete scp.selectMatchMap[mid];
						}
					}
				}else{
					scp.selectMatchMap[mid][tt][r] = scp.jsonData[mid][tt][r];
				}
			}
		}
		if(scp.g_config.lottery_type=='had'||scp.g_config.lottery_type=='ttg'){
			scp.setCount();
		}
	}
	
	//回掉函数
	window.getDataForFootBall = function (json){
		if(json.data){
			var dataMatch = {};
			var datearr=[];
			scp.nowTime=new Date().getTime();
			for(var id in json.data){
				var m = json.data[id];
				m.match_start_time = m.date + ' ' + m.time;
				var date = DateUtils.str2Date(m.match_start_time);
				var hour = date.getHours();
				if(date.getDay()==0 || date.getDay()==6){
					if(hour > 1 && hour < 9){
						m.book_end_time = m.date+" 01:00:00";
					}else{
						m.book_end_time = m.match_start_time;
					}
				}else{
					if(hour > 0 && hour < 9){
						m.book_end_time = m.date+" 00:00:00";
					}else{
						m.book_end_time = m.match_start_time;
					}
				}
				if(m.match_start_time < m.book_end_time){
					m.book_end_time = m.match_start_time;
				}
				m.bookEndTimeLong=DateUtils.str2Date(m.book_end_time).getTime();
				m.bookEndTimeLong = m.bookEndTimeLong-scp.g_config.minute_before_playtime*60*1000;
				if(m.bookEndTimeLong<scp.nowTime){//截止
					continue;
				}
				
				
				if(!scp.matchGame[m.l_id]){
					scp.matchGame[m.l_id]={};
					scp.matchGame[m.l_id].matchCount = 0;
				}
				scp.matchGame[m.l_id]['l_id'] = m.l_id;
				scp.matchGame[m.l_id]['l_cn_abbr']=m.l_cn_abbr;
				scp.matchGame[m.l_id]['l_cn']=m.l_cn;
				scp.matchGame[m.l_id]['selected']=true;
				scp.matchGame[m.l_id].matchCount++;
				scp.matchGame.totalMatchCount++;
				
				m.book_end_time = DateUtils.date2Str(new Date(m.bookEndTimeLong),"yyyy-MM-dd hh:mm:ss");
				var key = m.b_date+","+m.num.substring(0,2);
				var list = dataMatch[key];
				if(!list){
					datearr.push(key);//排序用的
					list=[];
					dataMatch[key]=list;
				}
				m.single=false;
				if(m.had && m.had.single==1){
					m.single=true;
				}
				if(m.hhad && m.hhad.single==1){
					m.single=true;
				}
				if(m.ttg&&m.ttg.single==1){
					m.single=true;
				}
				if(m.crs&&m.crs.single==1){
					m.single=true;
				}
				if(m.hafu&&m.hafu.single==1){
					m.single=true;
				}
				
				m.h_img = "//m.surewin.com/static/image/teamlogos/png/"+m.h_id+".png";
				m.a_img = "//m.surewin.com/static/image/teamlogos/png/"+m.a_id+".png";
				m.err_img="//m.surewin.com/static/image/teamlogos/png/logo-c.png?mid="+m.id+","+m.h_id+","+m.a_id+",1";
				m.h_order=m.h_order==""?"":"["+m.h_order.replace(/\D/g,'')+"]";
				m.a_order=m.a_order==""?"":"["+m.a_order.replace(/\D/g,'')+"]";
				scp.jsonData[m.id]=m;
				scp.l_name_map[m.l_cn_abbr] = "1";
				list.push(m);
			}
			for(var i=0;i<datearr.length;i++){
				var datestr = datearr[i];
				var list = dataMatch[datestr];
				var keyArr = datestr.split(",");
				var date = keyArr[0];
				var week = keyArr[1];
				var item = {};
				item.date = date;
				item.week = week;
				item.list = list;
				item.show=true;
				item.hasChild = true;
				if(list!=null&&list.length>0){
					scp.dataMatch[datestr]=item;
				}
			}
		}
		var delay=10*1000*60;
		if(scp.g_config.lottery_type=='had'){
			delay = 1000*60*2;
		}
		scp.timeoutval = $timeout(function () {
			scp.loadMatch();
	    }, delay);
		scp.oneKeyLoad();
	}
	
	scp.loadMatch();
	scp.loadUserInfo();
}]);
