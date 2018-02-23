var util = angular.module("utils",[]);

util.service("DataHelper",['$http',function($http){
	
	var DataHelper = {};

	DataHelper.get = function(url,param){
		return $http.get(url,param);
	}
	
	DataHelper.post = function(url,param){
		return $http.post(url,param);
	}
	
	DataHelper.getScript = function(url){
		return $http.jsonp(url);
	}


	return DataHelper;

}]);
util.service("UserUtils",['DataHelper',function(DataHelper,$cookies,$cookieStore){
	var UserUtils = {};
	UserUtils.getUserInfo = function(){
		if($cookies.getUserId()!=null&&$cookies.getUserId().length>0){
			DataHelper.get("/app/user/userinfo").success(function(data){
				if(data.status==1){
					return data;
				}else{
					return null;
				}
			});
		}else{
			return null;
		}
	}
}]);
util.service("CookieUtils",[function($cookies,$cookieStore){
	var CookieUtils = {};
	
	CookieUtils.userinfo = "ld_ulk";
	CookieUtils.validcode4h5="ld_lg";
	CookieUtils.setCookie = function(name, value, expires, isEncode){
		var expires_date;
		if (expires) {
			expires = expires * 1000 * 60 * 60 * 24;
			var today = new Date();
			expires_date = new Date(today.getTime() + (expires));
		}
		if (isEncode) {
			value = encodeURI(value);
		}
		document.cookie = name + '=' + value + ((expires) ? ';expires=' + expires_date.toGMTString() : '') + ';path=/'
				+ ((CookieUtils.getDomain()) ? ';domain=' + CookieUtils.getDomain() : '');
	}
	
	CookieUtils.getCookie = function(name, isEncode){
		var start = document.cookie.indexOf(name + "=");
		if (start == -1)
			return null;
		var len = start + name.length + 1;
		var end = document.cookie.indexOf(';', len);
		if (end == -1)
			end = document.cookie.length;
		var retValue = "";
		if (isEncode) {
			// retValue = decodeURI (document.cookie.substring(len, end))getCookie;
			retValue = unescape(document.cookie.substring(len, end));
		} else {
			retValue = document.cookie.substring(len, end);
		}

		return retValue;
	}
	
	CookieUtils.deleteCookie = function(name){
		if (CookieUtils.getCookie(name)!=null && CookieUtils.getCookie(name)!="") {
			document.cookie = name + '=;expires=Thu, 01-Jan-1970 00:00:01 GMT';
		}
		return CookieUtils.getCookie(name);
	}
	
	CookieUtils.deleteCookieUser = function(){
		CookieUtils.deleteCookie(CookieUtils.userinfo);
	}
	
	CookieUtils.getDomain = function() {
		var h = window.location.href.substr(7);
		var end = h.indexOf("/");
		var temp = h.substr(0, end).split(".");
		var len = temp.length;
		return "." + temp[len - 2] + "." + temp[len - 1];
	}
	
	CookieUtils.getUserloginInfo = function(name) {
		var userLoginInfo = CookieUtils.getCookie(name);
		if (userLoginInfo != null && userLoginInfo != '' && userLoginInfo != "\"\"" && userLoginInfo != "null" && userLoginInfo.length != 0) {
			return decodeURIComponent(userLoginInfo).split('_');
		}
		return null;
	}
	
	CookieUtils.getUserId = function() {
		return CookieUtils.getUserloginInfo(CookieUtils.userinfo) != null ? CookieUtils.getUserloginInfo(CookieUtils.userinfo)[1] : '';
	}
	
	CookieUtils.getUserName = function() {
		return CookieUtils.getUserloginInfo(CookieUtils.userinfo) != null ? CookieUtils.getUserloginInfo(CookieUtils.userinfo)[3] : '';
	}
	
	CookieUtils.getValidcode = function(){
		return CookieUtils.getCookie(CookieUtils.validcode4h5);
	}
	return CookieUtils;
}]);
/*util.service("UserInfoUtils",['DataHelper',"CookieUtils",function(DataHelper,CookieUtils){
	var UserInfoUtils = {};
	UserInfoUtils.user = {};
	DataHelper.post(ObjUtils.doadmin+"/app/user/userinfo").success(function(data){
		if(data.status==1){
			if(data.idNumber && data.idNumber!=null && data.idNumber!=''){
				$scope.idNumber = data.idNumber;
			}
			$scope.user.nickName = data.nickName;
			cashAmount
			$scope.user.headImg = data.headPortrait;
			if(data.alipayId && data.alipayId!=null && data.alipayId!=''){
				$scope.user.alipayId = data.alipayId;
			}
			if(data.bankCardId && data.bankCardId!=null && data.bankCardId!=''){
				$scope.user.bankCardId = data.bankCardId;
			}
		}
	});
	return UserInfoUtils;
}]);*/
util.service("ObjUtils",function(){

	var ObjUtils = {};
	
	ObjUtils.doadmin = "";
	
	ObjUtils.getlen = function(n){
		return Object.keys(n).length;
	} 

	ObjUtils.checkMobile = function(m){
		if(m==""){
			ObjUtils.showTips("用户名不能为空");
			return false;
		}
		if(!(/^1[34578]\d{9}$/.test(m))){
			ObjUtils.showTips("用户名格式错误");
			return false;
		}
		return true;
	}

	ObjUtils.isIdCardNo=function(num) {
		isIDCard1=/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
		isIDCard2=/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}[0-9Xx]{1}$/; 
		if(isIDCard1.test(num)||isIDCard2.test(num)){
			return true;
		}else{
			return false;
		}
	}
	
	ObjUtils.checkPwd = function(p){
		if(p==""){
			ObjUtils.showTips("密码不能为空");
			return false;
		}
		if(p.length<6||p.length>16){
			ObjUtils.showTips("请输入6到16位密码");
			return false;
		}
		return true;
	}
	
	ObjUtils.checkPwd2 = function(p,p2){
		if(p2==""){
			ObjUtils.showTips("请确认密码");
			return false;
		}
		if(p!=p2){
			ObjUtils.showTips("两次输入密码不一致");
			return false;
		}
		return true;
	}
	
	ObjUtils.checkBankCard = function(n){
		if(n==""){
			ObjUtils.showTips("请确认银行卡号");
			return false;
		}
		if(!(/^([1-9]{1})(\d{14}|\d{15}|\d{18})$/.test(n))){
			ObjUtils.showTips("银行卡格式错误");
			return false;
		}
		return true;
	}
	
	ObjUtils.isNull = function(st,s){
		if(s==""){
			ObjUtils.showTips(st+"不能为空");
			return false;
		}
		return true;
	}
	
	ObjUtils.DateToWeek = function(dateStr){
		if(dateStr.length > 10) {
	        dateStr = dateStr.substring(0, 10);
	    }
	    var weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
		var myDate = new Date(Date.parse(dateStr.replace(/-/g, "/"))); 
		var day = weekDay[myDate.getDay()];
		return day;
	}
	
	ObjUtils.stringToDate = function(date,format){
		if(!date){
			date = new Date(date);
		}
		if(!format){
			format="yyyy-MM-dd hh:mm:ss";
		}
        var map = {
            "M": date.getMonth() + 1, //月份 
            "d": date.getDate(), //日 
            "h": date.getHours(), //小时 
            "m": date.getMinutes(), //分 
            "s": date.getSeconds(), //秒 
            "q": Math.floor((date.getMonth() + 3) / 3), //季度 
            "S": date.getMilliseconds() //毫秒 
        };
        format = format.replace(/([yMdhmsqS])+/g, function(all, t) {
            var v = map[t];
            if (v !== undefined) {
                if (all.length > 1) {
                    v = '0' + v;
                    v = v.substr(v.length - 2);
                }
                return v;
            } else if (t ==='y') {
                return (date.getFullYear() + '').substr(4 - all.length);
            }
            return all;
        });
        return format;
	}
	
	//验证码倒计时
	var second = 60;
	
	ObjUtils.codeTimer = function(obj){
		if(second <= 0){
	    	$(obj).attr("disabled",false);
	    	$(obj).addClass("light-bg").addClass("red").removeClass("yzm-hui");
	        $(obj).text("获取验证码");
	        second = 60;
	        return;
	    }
	    second--;
	    $(obj).text(second + "s重新获取");
	    setTimeout(function () {
	    	ObjUtils.codeTimer(obj);
	    }, 1000);
	}
	
	ObjUtils.returnArrIndex = function(arr){
		for(var i=0;i<arr.length;i++){
			if(arr[i]==""){
				return i;
			}
		}
	}
	
	ObjUtils.showTips = function(tips){
		/*var obj = document.getElementsByClassName("popup-showing")[0];
		obj.style.visibility = "visible";
		obj.style.display = "";
		obj.getElementsByClassName("popup-body")[0].innerText = tips;
		setTimeout(function(){
			obj.style.visibility = "hidden";
		}, 1500);*/
		$("#showTips").show();
		$("#showTips .popup-body").text(tips);
		setTimeout(function(){
			$("#showTips").hide();
		}, 1500);
	}
	

	ObjUtils.deepClone = function(obj){
	    var result={},oClass=ObjUtils.isClass(obj);
	    for(key in obj){
	        var copy=obj[key];
	        if(ObjUtils.isClass(copy)=="Object"){
	            result[key]=arguments.callee(copy);//递归调用
	        }else if(ObjUtils.isClass(copy)=="Array"){
	            result[key]=arguments.callee(copy);
	        }else{
	            result[key]=obj[key];
	        }
	    }
	    return result;
	}
	
	ObjUtils.isClass = function(o){
	    if(o===null) return "Null";
	    if(o===undefined) return "Undefined";
	    return Object.prototype.toString.call(o).slice(8,-1);
	}
	return ObjUtils;

});

util.service('DateUtils', ['$filter', function ($filter) {  
    return {  
        date2Str: function (date, format) {  
            if (angular.isDate(date) && angular.isString(format)) {  
                return $filter('date')(date, format);  
            }  
        },  
        str2Date: function (string) {  
            if (angular.isString(string)) {  
                return new Date(string.replace(/-/g, "/"));  
            }  
        }  
    };  
}]);  


util.service("Contants",function(){
	var Contants = {};
	//五大联赛
	Contants.fiveMatch = {
			"英超":1,
			"意甲":1,
			"德甲":1,
			"西甲":1,
			"法甲":1
	};
	Contants.fiveMatchIdMap = {"25":"英超 ","40":"意甲","37":"德甲" ,"62":"西甲" ,"32":"法甲" };
	Contants.crs = {
			"0100":"",
			"0200":"",
			"0201":"",
			"0300":"",
			"0301":"",
			"0302":"",
			"0400":"",
			"0401":"",
			"0402":"",
			"0500":"",
			"0501":"",
			"0502":"",
			"-1-h":"",
			"0000":"",
			"0101":"",
			"0202":"",
			"0303":"",
			"-1-d":"",
			"0001":"",
			"0002":"",
			"0102":"",
			"0003":"",
			"0103":"",
			"0203":"",
			"0004":"",
			"0104":"",
			"0204":"",
			"0005":""
	};
	
	
	Contants.urlMap = {
			'had':"http://i.sporttery.cn/odds_calculator/get_odds?i_format=json&i_callback=getDataForFootBall&poolcode[]=hhad&poolcode[]=had",
			'ttg':"http://i.sporttery.cn/odds_calculator/get_odds?i_format=json&i_callback=getDataForFootBall&poolcode[]=ttg",
			'crs':"http://i.sporttery.cn/odds_calculator/get_odds?i_format=json&i_callback=getDataForFootBall&poolcode[]=crs",
			'hafu':"http://i.sporttery.cn/odds_calculator/get_odds?i_format=json&i_callback=getDataForFootBall&poolcode[]=hafu",
			'ht':"http://i.sporttery.cn/odds_calculator/get_odds?i_format=json&i_callback=getDataForFootBall&poolcode[]=hhad&poolcode[]=had&poolcode[]=hafu&poolcode[]=crs&poolcode[]=ttg",
			"mnl":"http://i.sporttery.cn/odds_calculator/get_odds?i_format=json&i_callback=getBasketData&poolcode[]=mnl&_="+(new Date),
			"hdc":"http://i.sporttery.cn/odds_calculator/get_odds?i_format=json&i_callback=getBasketData&poolcode[]=hdc&_="+(new Date),
			"wnm":"http://i.sporttery.cn/odds_calculator/get_odds?i_format=json&i_callback=getBasketData&poolcode[]=wnm&_="+(new Date),
			"hilo":"http://i.sporttery.cn/odds_calculator/get_odds?i_format=json&i_callback=getBasketData&poolcode[]=hilo&_="+(new Date),
			"hhgg":"http://i.sporttery.cn/odds_calculator/get_odds?i_format=json&i_callback=getBasketData&poolcode[]=mnl&poolcode[]=hdc&poolcode[]=wnm&poolcode[]=hilo&_="+(new Date)
	}
	
	Contants.paramsMap = {
			'lotteryType':{
				'had':'51',
				'hhad':'56',
				'crs':'52',
				'ttg':'53',
				'hafu':'54',
				'ht':'59',
				'mnl':'62',
				'hdc':'61',
				'wnm':'63',
				'hilo':'64',
				'hhgg':'69'
			},
			'lotteryTypePath':{
				'51':'had',
				'56':'hhad',
				'52':'crs',
				'53':'ttg',
				'54':'hafu',
				'59':'ht',
				'62':'mnl',
				'61':'hdc',
				'63':'wnm',
				'64':'hilo',
				'69':'hhgg'
			},
			"lotteryArr":['had','hhad','crs','ttg','hafu','mnl','hdc','wnm','hilo'],
			'lotteryTypeStr':{
				'51':'胜平负',
				'56':'让球胜平负',
				'52':'比分',
				'53':'总进球',
				'54':'半全场',
				'59':'混合过关',
				'62':'胜负',
				'61':'让分胜负',
				'63':'胜分差',
				'64':'大小分',
				'69':'混合过关'
			},
			"lott":{
				"1":"竞足",
				"2":"竞篮"
			},
		'hafu':{'hh':'胜胜','hd':'胜平','ha':'胜负','dh':'平胜','dd':'平平','da':'平负','ah':'负胜','ad':'负平','aa':'负负'},
		'had':{'h':'胜','d':'平','a':'负'},
		'hhad':{'h':'胜','d':'平','a':'负'},
		'ttg':{"s0":'0',"s1":'1',"s2":'2',"s3":'3',"s4":'4',"s5":'5',"s6":'6',"s7":'7+'},
		'crs':{"0000":"0:0","0001":"0:1","0002":"0:2","0003":"0:3","0004":"0:4","0005":"0:5",
				"0100":"1:0","0101":"1:1","0102":"1:2","0103":"1:3","0104":"1:4","0105":"1:5",
				"0200":"2:0","0201":"2:1","0202":"2:2","0203":"2:3","0204"	:"2:4","0205":"2:5",
				"0300":"3:0","0301":"3:1","0302":"3:2","0303":"3:3",
				"0400":"4:0","0401":"4:1","0402":"4:2","0500":"5:0",
				"0501":"5:1","0502":"5:2","-1-a":"负其它","-1-d":"平其它","-1-h":"胜其它"},
		'mnl':{'h':"主胜",'a':"客胜"},
		'hdc':{'h':"主让胜",'a':"客让胜"},
		'hilo':{'h':"大分",'l':'小分'},
		'wnm':{"w1":"主胜1-5","w2":"主胜6-10","w3":"主胜11-15","w4":"主胜16-20","w5":"主胜21-25"
			,"w6":"主胜26","l1":"客胜1-5","l2":"客胜6-10","l3":"客胜11-15","l4":"客胜16-20","l5":"客胜21-25","l6":"客胜26+"},
		'hafuArr1':['hh','hd','ha'],
		'hafuArr2':['dh','dd','da'],
		'hafuArr3':['ah','ad','aa'],
		'crsArr1':['0100','0200','0201','0300','0301'],
		'crsArr2':['0302','0400','0401','0402','0500'],
		'crsArr3':['0501','0502','-1-h'],
		'crsArr4':["0000","0101","0202","0303","-1-d"],
		'crsArr5':['0001','0002','0102','0003','0103'],
		'crsArr6':['0203','0004','0104','0204','0005'],
		'crsArr7':['0105','0205','-1-a' ],
		'hadArr':['h','d','a'],
		'hhadArr':['h','d','a'],
		'ttgArr1':['s0','s1','s2','s3'],
		'ttgArr2':['s4','s5','s6','s7'],
		'mnlArr':['h','a'],
		'hdcArr':['h','a'],
		'hiloArr':['h','l'],
		'wnmArr1':['w1','w2','w3','w4','w5','w6'],
		'wnmArr2':['l1','l2','l3','l4','l5','l6'],
		'sortMap':{}
	};
	Contants.betEnMap={
			'hafu':{'hh':'33','hd':'31','ha':'30','dh':'13','dd':'11','da':'10','ah':'03','ad':'01','aa':'00'},
			'had':{'h':'3','d':'1','a':'0'},
			'hhad':{'h':'3','d':'1','a':'0'},
			'ttg':{"s0":'0',"s1":'1',"s2":'2',"s3":'3',"s4":'4',"s5":'5',"s6":'6',"s7":'7'},
			'crs':{"0000":"00","0001":"01","0002":"02","0003":"03","0004":"04","0005":"05",
					"0100":"10","0101":"11","0102":"12","0103":"13","0104":"14","0105":"15",
					"0200":"20","0201":"21","0202":"22","0203":"23","0204"	:"24","0205":"25",
					"0300":"30","0301":"31","0302":"32","0303":"33",
					"0400":"40","0401":"41","0402":"42","0500":"50",
					"0501":"51","0502":"52","-1-a":"0A","-1-d":"1A","-1-h":"3A"},
			'mnl':{
				'h':'3','a':'0'
			},
			'hdc':{
				'h':'3','a':'0'
			},
			'wnm':{
				'w1':'01','w2':'02','w3':'03','w4':'04','w5':'05','w6':'06',
				'l1':'11','l2':'12','l3':'13','l4':'14','l5':'15','l6':'16'
			},
			'hilo':{
				'h':'3','l':'0'
			}
	}
	Contants.titleMap={'had':'竞彩足球胜平负-让球胜平负','hhad':'竞彩足球胜平负-让球胜平负','ttg':'竞彩足球总球球',
			'crs':'竞彩足球比分','hafu':'竞彩足球半全场','ht':'竞彩足球混合过关'};
	Contants.footsortbyarr=['hadArr','hhadArr','hafuArr1','hafuArr2','hafuArr3','ttgArr1','ttgArr2','crsArr1','crsArr2','crsArr3','crsArr4','crsArr5','crsArr6','crsArr7'];
	Contants.basketsortbyarr=['mnlArr','hdcArr','hiloArr','wnmArr1','wnmArr2'];
	var sortidx = 0;
	for(var i in Contants.footsortbyarr){
		var sortkey = Contants.footsortbyarr[i];
		var lotteryType =  sortkey.split('Arr')[0];//玩法
		var prefix="";//名称前加前缀
		if(lotteryType=='hhad'){//让球
			prefix = '让';
		}
		var keyArr = Contants.paramsMap[sortkey];//官方投注选项英文代码对应的数组
		var nameMap = Contants.paramsMap[lotteryType];//对应玩法的中文组
		for(var j in keyArr){
			var item = keyArr[j];//投注选项官方名称(英文代码)
			var keyName = prefix+nameMap[item];//对应的中文意思 
			Contants.paramsMap.sortMap[keyName]=sortidx++;//给设置一个序号
		}
	}
	
	for(var i in Contants.basketsortbyarr){
		var sortkey = Contants.basketsortbyarr[i];
		var lotteryType =  sortkey.split('Arr')[0];//玩法
		var keyArr = Contants.paramsMap[sortkey];//官方投注选项英文代码对应的数组
		var nameMap = Contants.paramsMap[lotteryType];//对应玩法的中文组
		for(var j in keyArr){
			var item = keyArr[j];//投注选项官方名称(英文代码)
			var keyName = nameMap[item];//对应的中文意思 
			Contants.paramsMap.sortMap[keyName]=sortidx++;//给设置一个序号
		}
	}
	
	Contants.sortFootArrFun = function(sortArr){
		sortArr.sort(function(a,b){
			var k= Contants.paramsMap.sortMap[a]-Contants.paramsMap.sortMap[b];
			if(isNaN(k)){
				console.log(Contants.paramsMap.sortMap);
				console.log(a);
				console.log(b);
			}
			return k;
		});
	}
	
	Contants.sortbasketArrFun = function(sortArr){
		sortArr.sort(function(a,b){
			var k=  Contants.paramsMap.sortMap[a]- Contants.paramsMap.sortMap[b];
			if(isNaN(k)){
				console.log(Contants.paramsMap.sortMap);
				console.log(a);
				console.log(b);
			}
			return k;
		});
	}
	return Contants;
});

util.service("MathUtil",function(){
	var MathUtil = {
			//数字数组的倒序
			sortDesc:function(a,b){
				return b-a;
			},
			//组合取个数 c(4,2)=6
		    c: function (len, m) {
		        return (function (n1, n2, j, i, n) {
		            for (; j <= m;) {
		                n2 *= j++;
		                n1 *= i--
		            }
		            return n1 / n2
		        })(1, 1, 1, len, len)
		    },
		    //组合取数组，z 表示取前多少个,为0时全取
		    cl: function (arr, n, z) {
		        var r = [];

		        function fn(t, a, n) {
		            if (n === 0 || z && r.length == z) {
		                r[r.length] = t;
		                return t
		            }
		            for (var i = 0, l = a.length - n; i <= l; i++) {
		                if (!z || r.length < z) {
		                    var b = t.slice();
		                    b.push(a[i]);
		                    fn(b, a.slice(i + 1), n - 1)
		                }
		            }
		        }
		        fn([], arr, n);
		        return r
		    },
		    //排列取个数
		    p: function (n, m) {
		        for (var i = n - m, c = 1; i < n;) {
		            c *= ++i
		        }
		        return c
		    },
		    //排列取数组
		    pl: function (arr, n, z) {
		        var r = [];

		        function fn(t, a, n) {
		            if (n === 0 || z && r.length == z) {
		                r[r.length] = t;
		                return t
		            }
		            for (var i = 0, l = a.length; i < l; i++) {
		                if (!z || r.length < z) {
		                    fn(t.concat(a[i]), a.slice(0, i).concat(a.slice(i + 1)), n - 1)
		                }
		            }
		        }
		        fn([], arr, n);
		        return r
		    },
		    //有胆码时组合个数 胆个数，托个数,总个数
		    dt: function (d, t, m) {
		        return d >= m ? 0 : MathUtil.c(t, m - d)
		    },
		    //有胆码时组合取数组 d 胆数组，t 托数组,n 总个数，z 取前几个
		    dtl: function (d, t, n, z) {
		        var r = [];
		        if (d.length <= n) {
		            r = MathUtil.cl(t, n - d.length, z);
		            for (var i = r.length; i--;) {
		                r[i] = d.concat(r[i])
		            }
		        }
		        return r;
		    },
		    //计算返奖率
		    b:function(m1,b){
		    	var B=0;
		    	if(!b){
		    		b=1;
		    	}
		    	for (var i in m1) {
		            B += (1 / ml[i]);
		        }
		    	return b/B;
		    },
		    //根据赔率和返还率计算打出概率 g 为返还率，通常情况下是1
		    bl: function (ml, g) {
		        var A, bs, B = 0,
		            bl = [];
		        B=this.b(m1,g);
		        A = g / B;
		        for (i = ml.length; i--;) {
		            bs = A / ml[i];
		            bl[i] = bs;
		        }
		        return bl;
		    },
		    //4舍六入五成双，保留2位小数
		    round2: function (n) {
		        if (/\d+\.\d\d5/.test(n.toString())) {
		            var m = n.toString().match(/\d+\.\d(\d)/);
		            return (m && m[1] % 2 == 1) ? parseFloat(n).toFixed(2) : parseFloat(m[0]);
		        } else {
		            return parseFloat(parseFloat(n).toFixed(2));
		        }
		    },
		    //取数组的积,计算奖金时需要
		    a: function (A1) {
		        var ret = 1;
		        for (var i in A1) {
		            ret *= A1[i];
		        }
		        return ret ;
		    },
		    //数组合并排列，A2 是二维数组，fn 是处理每个元素
		    al: function (A2, fn) {
		        var n = 0,
		            codes = [],
		            code = [],
		            isTest = typeof fn == "function";

		        function each(A2, n) {
		            if (n >= A2.length) {
		                if (!isTest || false !== fn(code)) {
		                    codes.push(code.slice())
		                }
		                code.length = n - 1;
		            } else {
		                var cur = A2[n];
		                for (var i = 0, j = cur.length; i < j; i++) {
		                    code.push(cur[i]);
		                    each(A2, n + 1);
		                }
		                if (n) {
		                    code.length = n - 1;
		                }
		            }
		        }
		        if (A2.length>0) {
		            each(A2, n);
		        }
		        return codes
		    }
		};
	return MathUtil;
})
