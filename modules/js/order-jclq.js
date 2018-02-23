var orderJclq = angular.module('orderJclq',['ui.router']);


orderJclq.controller("orderJclqCtrl",['$scope','DataHelper',"ObjUtils","$location","CookieUtils","Contants","DateUtils",'$timeout',function($scope,DataHelper,ObjUtils,$location,CookieUtils,Contants,DateUtils,$timeout){
	var scp = $scope;
	//變量
	scp.dataMatch={};//页面加载的比赛
	//联赛数据
	scp.matchGame={totalMatchCount:0};
	//原始数据
	scp.jsonData={};
	//定时刷新任务
	scp.timeoutval =0;
	//选择赛事数据对象
	scp.selectMatchMap = {};
	//选择赛事的长度
	scp.count = 0;
	//单关串关的切换标志
	scp.isDan = false;
	//赛事筛选显示
	scp.filterMacth = false;
	//所有的联赛名称
	scp.l_name_map = {}; 
	//跟单页面显示
	scp.isFollowOrder = false;
	//投注成功弹窗
	scp.betSuccess = false;
	//跟单页面显示的数据
	scp.showForOrder = {};
	
	scp.betOptCount=0;//投注选项个数
	scp.betCnMap= Contants.paramsMap;
	scp.betEnMap= Contants.betEnMap;
	
	//用户信息
	scp.userInfo= {"cashAmount":0};
	
	scp.loadUserInfo = function(){
		var param = {};
		param.userInfo = CookieUtils.getCookie(CookieUtils.userinfo);
		DataHelper.post(ObjUtils.doadmin+"/app/user/userinfo",param).success(function(data){
			if(data.status==1){
				if(data.betAmount!=null){
					scp.userInfo.cashAmount = parseFloat(data.betAmount).toFixed(2);
				}else{
					scp.userInfo.cashAmount =0;
				}
			}
		});
	}
	
	
	scp.betOrder = {};
	//确认投注
	scp.sureorder = function(){
		$scope.userId = CookieUtils.getUserId();
		if($scope.userId==null || $scope.userId.length==0){
			$location.path("/login");
		}
		
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
		scp.betOrder.mType = 2;
		scp.betOrder.lotteryId = Contants.paramsMap.lotteryType[scp.g_config.lottery_type];
		scp.betOrder.source = 1;
		scp.betOrder.totalPrice = scp.order.orderMoney;
		scp.betOrder.expectBonus = scp.order.orderAwardMax;
		scp.betOrder.content = [];
		scp.betOrder.mids = "";
		for(var k in scp.selectMatchMap){
			var bor = {};
			var match = scp.selectMatchMap[k];
			console.log(match)
			bor.mid = k;
			bor.num = match['m'].num;
			bor.lname = match['m'].l_cn_abbr;
			bor.home_team = match['m'].h_cn_abbr;
			bor.visiting_team = match['m'].a_cn_abbr;
			for(var kk in match){
				if(kk!='m'&&kk!='arr'){
					bor[kk] = match[kk];
					if(kk=='hilo'||kk=='hdc'){
							bor[kk]["pankou"] = match['m'][kk]['fixedodds'];
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
				if(data.errcode=="400105"){
					$location.path("/login");
				}else{
					ObjUtils.showTips("错误码:"+data.errcode);
				}
			}
		});
			
	}
	//关闭成功提示
	scp.kownForOrder = function(){
		scp.betSuccess = false;
		$location.path("/betrecord");
		
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
			console.log(scp.selectMatchMap[tk])
			for(var tkk in scp.selectMatchMap[tk]){
				if(tkk!='arr'&&tkk!='m'){
					if(scp.jsonData[tk][tkk].single!='1'){
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
				
				if(m['mnl']){
					scp.getSortArr(m['mnl'],arrBet,arrOdds,'mnl');
					if(scp.jsonData[k].mnl.single!='1'){
						flag = false;
					}
				}
				
				if(m['hdc']){
					scp.getSortArr(m['hdc'],arrBet,arrOdds,'hdc');
					if(scp.jsonData[k].hdc.single!='1'){
						flag = false;
					}
				}
				
				if(m['hilo']){
					scp.getSortArr(m['hilo'],arrBet,arrOdds,'hilo');
					if(scp.jsonData[k].hilo.single!='1'){
						flag = false;
					}
				}
				
				if(m['wnm']){
					scp.getSortArr(m['wnm'],arrBet,arrOdds,'wnm');
					if(scp.jsonData[k].wnm.single!='1'){
						flag = false;
					}
				}
				scp.showForOrder[k]['bet'] = arrBet;
				scp.showForOrder[k]['odds'] = arrOdds;
				scp.showForOrder[k]['m']=scp.jsonData[k];
				scp.selectMatchMap[k]['m']=scp.jsonData[k];
				if(ind>0&&ind<4&&!scp.isDan){
					var a = "0";
					if(ind==scp.count-1||ind==3){
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
			}
			if(!scp.passway["单关"]&&scp.count>2){
				delete scp.selectMatchMap[n];
				scp.setCount();
				scp.next();
			}else{
				ObjUtils.showTips("至少选择场赛事");
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
	//点击展示赛事筛选页
	scp.showFilterTab = function(){
		scp.filterMacth = true;
		scp.matchSize = ObjUtils.getlen(scp.jsonData);
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
				if(scp.l_name_map[k]){
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
	
	//确定筛选
	scp.srueFilterMatch = function(){
		scp.filterMacth = false;
		for(var d in scp.dataMatch){
			scp.dataMatch[d].show= true;
			scp.dataMatch[d].cls = 'ion-ios-arrow-up';
			var list = scp.dataMatch[d].list;
			for(var k in list){
				var obj = list[k];
				obj.show = scp.l_name_map[obj.l_cn_abbr];
			}
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
	
	//分析地址
	var path = $location.absUrl();
	scp.g_config={
			minute_before_playtime:10,// 提前10分钟截止
			show_single_only:false,// 单关开关
			lottery_type:path.split("-")[1]
	}
	scp.url = Contants.urlMap[scp.g_config.lottery_type];
	
	//全部和单关的切换
	scp.choseSelect = function(d){
		if(d){
			scp.isDan = true;
		}else{
			scp.isDan = false;
		}
		for(var k in scp.dataMatch){
			scp.dataMatch[k].show= true;
			scp.dataMatch[k].cls = 'ion-ios-arrow-up';
		}
		scp.selectMatchMap = {};
		scp.setCount();
		console.log(scp.dataMatch)
	}
	
	//显示或者影藏
	scp.showOrHide = function(d){
		if(scp.dataMatch[d].show){
			scp.dataMatch[d].cls = 'ion-ios-arrow-down';
		}else{
			scp.dataMatch[d].cls = 'ion-ios-arrow-up';
		}
		scp.dataMatch[d].show = !scp.dataMatch[d].show;
	}
	
	//弹窗内显示的胜分差数据
	scp.wnmMatch = {};
	//显示隐藏弹窗
	scp.showTab = false;
	
	//混合过关展示胜分差数据
	scp.showWnmTab = function(mid){
		scp.wnmMatch = scp.jsonData[mid];
		scp.showTab = true;
		//页面显示的变量
		scp.wnmSelectMap = {};
		if(scp.selectMatchMap[mid]&&scp.selectMatchMap[mid]['wnm']){
			scp.wnmSelectMap[mid] = {};
			scp.wnmSelectMap[mid]['wnm'] = ObjUtils.deepClone(scp.selectMatchMap[mid]['wnm']);
		}
		
	}
	
	//弹窗显示的胜分差，需要定义两个变量去缓冲
	
	//点击选择赛果
	scp.selectMatch = function(mid,r,b){
		var tt = scp.g_config.lottery_type;
		if(tt == 'hhgg') {
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
		if(!(scp.g_config.lottery_type=='hhgg'&&b=='wnm')){
			scp.setCount();
		}
	}

	scp.setCount = function(){
		scp.count = ObjUtils.getlen(scp.selectMatchMap);
	}
	
	//初始化数据
	scp.loadMatch = function(){
		DataHelper.getScript(scp.url);
	}
	
	//生成胜分差字符串
	scp.creteWnmStr = function(){
		if(scp.selectMatchMap[scp.wnmMatch.id] && scp.selectMatchMap[scp.wnmMatch.id]['wnm']){
			var wnm = scp.selectMatchMap[scp.wnmMatch.id]['wnm'];
			var arr = [];
			for(var key in wnm){
				arr.push(Contants.paramsMap['wnm'][key]);
			}
			Contants.sortbasketArrFun(arr);
			var arrStr = "";
			if(arr.length<4){
				for(var k = 0;k<arr.length;k++){
					arrStr += ","+arr[k];
				}
			}else{
				for(var k = 0;k<3;k++){
					arrStr += ","+arr[k];
				}
				arrStr += ",...";
			}

			arrStr = arrStr.substring(1);
			scp.selectMatchMap[scp.wnmMatch.id]['arr'] = arrStr;
		}else{
			if(scp.selectMatchMap[scp.wnmMatch.id]){
				if(!scp.selectMatchMap[scp.wnmMatch.id]['wnm']){
					if(scp.selectMatchMap[scp.wnmMatch.id]['arr']){
						delete scp.selectMatchMap[scp.wnmMatch.id]['arr'];
					}
				}
				if(scp.selectMatchMap[scp.wnmMatch.id] && JSON.stringify(scp.selectMatchMap[scp.wnmMatch.id])=='{}'){
					delete scp.selectMatchMap[scp.wnmMatch.id];
				}
			}
		}
		
	}
	//取消选择
	scp.removeSelect=function(){
		scp.showTab = false;
		if(scp.wnmSelectMap[scp.wnmMatch.id]&&scp.wnmSelectMap[scp.wnmMatch.id]['wnm']){
			if(!scp.selectMatchMap[scp.wnmMatch.id]){
				scp.selectMatchMap[scp.wnmMatch.id] = {};
			}
			scp.selectMatchMap[scp.wnmMatch.id]['wnm'] = scp.wnmSelectMap[scp.wnmMatch.id]['wnm'];
		}else{
			if(scp.selectMatchMap[scp.wnmMatch.id]&&scp.selectMatchMap[scp.wnmMatch.id]['wnm']){
				delete scp.selectMatchMap[scp.wnmMatch.id]['wnm'];
				if(JSON.stringify(scp.selectMatchMap[scp.wnmMatch.id])=='{}'){
					delete scp.selectMatchMap[scp.wnmMatch.id];
				}
			}
			//scp.selectMatchMap[scp.wnmMatch.id]['wnm'] = scp.wnmSelectMap[scp.wnmMatch.id]['wnm'];
		}
		scp.creteWnmStr();
		scp.setCount();
	}
	
	//确认胜分差选择
	scp.sureSelect = function(){
		scp.showTab = false;
		scp.creteWnmStr();
		console.log(scp.selectMatchMap)
		scp.setCount();
	}
	
	//回调函数
	window.getBasketData = function(json){
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
				
				m.book_end_time = DateUtils.date2Str(new Date(m.bookEndTimeLong),"yyyy-MM-dd HH:mm:ss");
				var key = m.b_date+","+m.num.substring(0,2);
				var list = dataMatch[key];
				if(!list){
					datearr.push(key);//排序用的
					list=[];
					dataMatch[key]=list;
				}
				m.single=false;
				if(m.mnl && m.mnl.single==1){
					m.single=true;
				}
				if(m.hdc && m.hdc.single==1){
					m.single=true;
				}
				if(m.wnm&&m.wnm.single==1){
					m.single=true;
				}
				if(m.hilo&&m.hilo.single==1){
					m.single=true;
				}
				
				m.h_img = "//m.surewin.com/static/image/teamlogos/png/"+m.h_id+".png";
				m.a_img = "//m.surewin.com/static/image/teamlogos/png/"+m.a_id+".png";
				m.err_img="//m.surewin.com/static/h5/img/logo-c.png?mid="+m.id+","+m.h_id+","+m.a_id+",1";
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
				item.cls = 'ion-ios-arrow-up';
				scp.dataMatch[datestr]=item;
			}
		}
		var delay=30*1000*60;
		/*if(scp.g_config.lottery_type=='had'){
			delay = 1000*60*2;
		}*/
		scp.timeoutval = $timeout(function () {
			scp.loadMatch();
	    }, delay);
		console.log(scp.jsonData);
	}
	scp.loadMatch();
	scp.loadUserInfo();
	
}]);