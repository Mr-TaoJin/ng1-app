var Yobj={
		alert:function(msg){
			OP.vm.errMsg=msg;
		}
}
var OP = {math: {},	fn: {},	jczq: {},vm:{},
	maxBs: 50000,
	getMaxBs: function (){
		return OP.maxBs;
	},
	dict_ggtype_id : {"2*1":"1","3*1":"3","4*1":"7","5*1":"15","6*1":"26","7*1":"41","8*1":"48"},

	SingleList:{
		codeInfo: {},
		vs:{},
		init: function (vs){
			OP.SingleList.vs = OP.VS;
			OP.SingleList.isfilter = false;
			OP.SingleList.filtercode = '';
			OP.SingleList.ggtype = [];
			/*OP.vm.passway.forEach(function(passway){
				var pass = passway.str.replace("x","*");
				OP.SingleList.ggtype.push(pass);
			});*/
			var passway = OP.vm.getPassWay();
			passway.forEach(function(passwayx){
				var pass = passwayx.replace("x","*");
				OP.SingleList.ggtype.push(pass);
			});
			OP.SingleList.ismix = false;
			OP.SingleList.maxPrize = OP.SingleList.minPrize = 0;
			OP.SingleList.split2Single();
			return OP.SingleList;
		},
		split2Single: function (){//拆分为单注
			var data = OP.SingleList.vs.codeList,//用vs的数据
				filter = false,
				dan = [], tuo = [],
				codelist = [];
			for (var i = 0, j = data.length; i < j; i++) {
				if (data[i].isdan) {
					dan.push(data[i]);
				}else{
					tuo.push(data[i]);
				}
			}
			OP.SingleList.ggtype.forEach(function (str){
				var gt = parseInt(str, 10);
				if (gt) {
					var tmp = OP.math.dtl(dan, tuo, gt);//拆分成长度为指定n串1的组合
					tmp.forEach(function (nd){
						codelist = codelist.concat(OP.math.al(nd, filter));//每个组合扫描为单注
					});
				}
			});
			OP.SingleList.codeList = codelist;// 单注集
		},
		createList: function (){
			var	prizeList = [];
			var	im = parseInt(OP.vm.order.orderMoneyJjyh, 10);
			OP.SingleList.codeList.forEach(function (item){
				var spx = 1;
				sg = [],
				code = [],
				fscode = [];
				item.map(function (o){
					spx *= parseFloat(o.sp) || 1;
					var v=o.value;
					sg.push(o.vsid+'_'+(o.type=='JQS' ? 'j' + o.value : (o.type=='BQC' ? (o.value+'').charAt(1) : o.value))+'|');//以|结尾，避免_3与_30重合
					code.push('['+o.type+']'+o.vsid + '=' + o.value);
					fscode.push(o.ccid+'|'+o.pname+'|'+o.subplayid+'['+o.value+']');
				});
				item.code = code.join(',');
				item.fscode = fscode.join('/');
				item.sg = sg.join(',');
				item.ggtype = item.length + '*1';
				item.spx = OP.math.round(spx*2);
				item.bs=0;
				prizeList.push(item.spx);
			});
			var cList = OP.SingleList.codeList;
			//按单注奖金降序
			OP.SingleList.codeList.sort(function (a, b){
				return a.spx > b.spx ? 1 : -1;
			});
			prizeList.sort(function (a,b){
				return parseInt(b) < parseInt(a) ? 1 : -1;
			});
			if (cList.length > 1) {
				if (cList[0].spx == cList[1].spx) {
					OP.SingleList.hasMinSameSP = true;
				}
				if (cList[cList.length -1].spx == cList[cList.length -2].spx) {
					OP.SingleList.hasMaxSameSP = true;
				}
			}
			OP.SingleList.prizeList = prizeList;
			OP.SingleList.isOver = prizeList.length > 2000000;
			OP.SingleList.getCodeInfo();
		},
		getCodeInfo: function (){//统计表格信息
			var codes = [],
				data,
				min = 0,
				allbs = 0,
				wholeBs = OP.vm.order.betMul,
				dict_ggtype_id = OP.dict_ggtype_id,
				zero = 0;
			OP.SingleList.codeList.forEach(function(item){
				var prize = 0, bs,
				bs = item.bs;
				prize =bs == 0 ? 0 : (item.spx * bs).toFixed(2);
				allbs += parseInt(bs); 
				if (bs > 0) {
					if (min > 0) {
						min = Math.min(prize, min);
					}else{
						min = parseFloat(prize);
					}				
				}else{
					zero++;
				}
				prize = parseFloat(prize);
			});
			
			var maxMin = OP.SingleList.isOver ? [0, 0] : OP.SingleList.getPrizeRange();
			OP.SingleList.maxPrize = parseFloat(maxMin[1],10)||0;
			OP.SingleList.minPrize = min;
			OP.SingleList.allbs=allbs;
			
			OP.vm.order.orderMoney = OP.SingleList.allbs * 2;
			OP.vm.order.orderAwardMin = OP.SingleList.minPrize.toFixed(2);
			OP.vm.order.orderAwardMax = OP.SingleList.maxPrize.toFixed(2);
			OP.vm.jjyhlist=OP.SingleList.codeList;
			console.log(OP.vm.jjyhlist);
		},
		lastListBs: 0,
		setBs2List: function (bsArr){
			if (bsArr[0] == 0 && OP.SingleList.lastListBs == 0) {
				return;
			}
			/*bsArr.sort(function (a,b){
				return parseInt(b) > parseInt(a) ? 1 : -1;
			});*/
			OP.SingleList.lastListBs = bsArr[0];
			
			var im =  parseInt(OP.vm.order.orderMoneyJjyh, 10);
			OP.SingleList.codeList.forEach(function (item,i){
				var bs = bsArr[i];
				item.bs = bs;
				item.prize = (item.spx * bs).toFixed(2);
			});
			OP.SingleList.lastMoneySet = im;
			OP.SingleList.getCodeInfo();
			
		},
		reset: function (){//所有倍数置0
			OP.SingleList.setBs2List(OP.SingleList.fillList(OP.SingleList.codeList, 0));
		},
		fillList: function (len, val){
			var arr = [];
			for (var i = len; i--;) {
				arr[i] = val;
			}
			return arr;
		},
		getPrizeRange: function (){//计算奖金范围
			var allSg= OP.SingleList.vs.allSg, 
				maxPrize = 0,
				minPrize = 0,
				isInCode = OP.SingleList.isInCode,
				list = OP.SingleList.codeList,
				prizes = [];
			allSg.forEach(function (g){
				g = g.join('|')+'|';
				var pz = 0;
				for (var i = 0, j = list.length; i < j; i++) {
					var vss = list[i].sg;
					if (isInCode(g, vss)) {
						var prize = (parseFloat(list[i].prize) || 0);
						pz+=prize;
						if (prize > 0) {
							if (minPrize == 0) {
								minPrize = prize;
							}else{
								minPrize = Math.min(prize, minPrize);
							}			
						}
					}
				}
				prizes.push(pz);
			});
			maxPrize = Math.max.apply(Math, prizes).toFixed(2);
			return [minPrize, maxPrize];
		},
		isInCode: function (_long, _shot){
			_shot = _shot.split(',');
			for (var i =  _shot.length; i--;) {
				if (_long.indexOf(_shot[i]) == -1) {
					return false;
				}
			}
			return true;
		},
		getMinBsList: function (total, surplus){// 多余倍数的处理方式
			var arr = [],
				diff,
				money = total*2,
				pl = OP.SingleList.prizeList,
				sum = 0;
			if (pl.length < 2) {
				return [total];
			}
			pl.forEach(function (p){
				var bs = Math.ceil(money/p);//首先保证投入平衡
				arr.push(bs);
				sum += bs;
			});
			if (sum > total) {//超出预算倍数
				var bl = total/sum, cur, sd,
					diff = sum - total;
				for (var i = 0, j = arr.length; i < j; i++) {
					cur = Math.floor(arr[i]*bl);
					sd = Math.min(diff, Math.max(1, arr[i] - cur));
					if (sd < arr[i]) {
						arr[i] -= sd;
						diff -= sd;
					}
					if (diff <= 0) {
						return arr;
					}
				}
				if (diff) {//如果没有扣清
					while(true){
						var hasOp = false;
						for (var i = 0, j = arr.length; i < j; i++) {
							if (arr[i] > 1) {
								arr[i]--;
								diff--;
								hasOp = true;
							}
							if (diff <= 0) {
								return arr;
							}
						}
						if (!hasOp) {
							return arr;
						}
					}
				}
			}else{
				diff = total - sum;
				if (diff > 0) {
					if (surplus == 'hot') {//加在sp最大项上
						arr[0] += diff;
					}else{
						arr[arr.length - 1] += diff;
					}
				}
			}
			return arr;
		},
		getAverage: function (bs){
			var avlist = [bs];
			if(OP.SingleList.codeList.length > 1){
				if (OP.SingleList.prizeList.length >= bs) {
					avlist = OP.SingleList.fillList(OP.SingleList.prizeList.length, 1);//如果有一个倍数小于1，就全部设为1;
				}else{
					avlist = OP.math.asm(OP.SingleList.prizeList, bs);
					OP.fn.arrRound(avlist, bs);//取整
				}
			}
			OP.SingleList.setBs2List(avlist);
		},
		getCold: function (bs){
			var baselist = OP.SingleList.getMinBsList(bs);
			if (OP.SingleList.hasMaxSameSP) {
				Yobj.alert('您好，您的方案正在进行博冷优化，方案中最冷的号码有多个，系统会默认只选择排列在最前的第一注进行优化。如和您的期望不同，请手动设置您期望号码的倍数。');
			}
			OP.SingleList.setBs2List(baselist);
		},
		getHot: function (bs){
			var baselist = OP.SingleList.getMinBsList(bs, 'hot');
			if (OP.SingleList.hasMinSameSP) {
				Yobj.alert('您好，您的方案正在进行博热优化，方案中最热的号码有多个，系统会默认只选择排列在最前的第一注进行优化。如和您的期望不同，请手动设置您期望号码的倍数。');
			}
			OP.SingleList.setBs2List(baselist);
		},
		changeType: function (type){
			var onlyAv = OP.SingleList.ggtype.length > 1 || parseInt(OP.SingleList.ggtype[0]) !== OP.VS.length;			
			/*if (onlyAv) {
				Yobj.alert('您好，组合过关只支持平均优化!');
				return;
			}*/
			var fm = ['getAverage', 'getCold', 'getHot'],
				put = parseInt(OP.vm.order.orderMoneyJjyh),	
				fn = fm[type],
				minMoney;
			if (fn) {				
				minMoney = OP.SingleList.codeList.length*2;
				if (minMoney > put) {
					return Yobj.alert('您好，本次计划投注金额至少为'+minMoney+'元。');
				}
				OP.SingleList[fn](put/2);
			}
		}
	},
	VS:{
		init: function (){
			var codeList = [];
			OP.vm.betOpts.detail.forEach(function(item){
				line=[];
				line.isdan=false;
				line.id = item.id;
				item.code.forEach(function(code){
					var opt = code;
					opt.pname = item.week;
					opt.vsid=item.id;
					opt.ccid=item.id;
					opt.name=item.host;
					opt.subplayid=code.type;
					line.push(opt);
					var t=opt.type.toUpperCase(), v=opt.value;
					if (t=='BQC') {v=v.slice(-1);}
					if (t=='NSPF' || t=='BQC') {t='SPF';}
					if (!line[t]) {line[t] = [];}
					line[t].push(v);
				});
				codeList.push(line);
			});
			
			OP.VS.codeList = codeList;
			OP.VS.length = codeList.length;
			OP.VS.getAllSG(codeList);
			return OP.VS;
		},
		jqs2bf: [
			["00"],
			["01","10"],
			["02","20","11"],
			["03","30","12","21","21","12"],
			["04","40","13","31","22","31","13"],
			["05","50","14","41","23","32","32","23","41","14"],
			["15","51","24","42","33","42","24","51","15"],
			["25","52","34","43","43","34","52","25"]
		],
		getAllSG: function (codeList){//所有比分赛果
			var hits = [],
				group = [],
				jqsmap = OP.VS.jqs2bf;
			function jqs2bf(jqs){
				var x=[];
				for (var i =  jqs.length; i--;) {
					x=x.concat(jqsmap[jqs[i]]||[]);
				}
				return x;
			}
			codeList.forEach(function (a){
				var s, p, f, bs={}, j2b;
				if ('JQS' in a) {
					j2b = jqs2bf(a.JQS);
					if (!('BF' in a)) {a.BF=[];}
					a.BF=a.BF.concat(j2b);
				}
				if ('BF' in a) {
					for (var i =  a.BF.length; i--;) {
						var v=a.BF[i],v2,
							b=v.charAt(1) == 'A' ? (v.charAt(0)-1) : (v.charAt(0)-v.charAt(1));
						if (b==0) {p=1;v2=1;}else if(b>0){s=1;v2=3;}else{f=1;v2=0;}
						bs[v]=a.id+'_'+v+'|'+a.id+'_'+v2+'|'+a.id+'_j'+(parseInt(v.charAt(0))+parseInt(v.charAt(1)));
					}
				}
				if ('SPF' in a) {
					for (var i =  a.SPF.length; i--;) {
						var v=a.SPF[i];
						if (v=='3' && !s) {bs['10']=a.id+'_10|'+a.id+'_3'+'|'+a.id+'_j1';}
						if (v=='1' && !p) {bs['00']=a.id+'_00|'+a.id+'_1'+'|'+a.id+'_j0';}
						if (v=='0' && !f) {bs['01']=a.id+'_01|'+a.id+'_0'+'|'+a.id+'_j1';}
					}				
				}
				var vs=[];
				for(var k in bs){vs.push(bs[k]);}
				hits.push(vs);
			});
			group = OP.math.al(hits);
			OP.VS.allSg = group;
		}
	}
};
OP.math.asm = function(D, E){	
	var A, B = 0, C = [];
	for (var i =  D.length; i--;) {B += (1/D[i]);}
	A = E/B;
	for (var i =  D.length; i--;) {
		bs = A/D[i];
		C[i] = bs;
	}
	return C;
};
OP.math.round = function (n) {
	if (/\d+\.\d\d5/.test(n.toString())) {
		var match_ret = n.toString().match(/\d+\.\d(\d)/);
		if (match_ret[1] % 2 == 1) {
			return parseFloat(n).toFixed(2);
		} else {
			return parseFloat(match_ret[0]);
		}
	} else {
		return parseFloat(parseFloat(n).toFixed(2));
	}
};
OP.math.al = function (A2, fn){
	var n = 0,
		codes = [],
		code = [],
		isTest = typeof fn == 'function',
		stop;
	if (A2.length) {
		each(A2, n);
	}	
	function each(A2, n){
		if (n >= A2.length) {
			if (!isTest || false !== fn(code)) {
				codes.push(code.slice());
			}				
			code.length = n - 1;
		}else{
			var cur = A2[n];
			for (var i = 0, j = cur.length; i < j; i++) {
				code.push(cur[i]);
				each(A2, n+1);
			}
			if (n) {
				code.length = n - 1;
			}
		}
	}
	return codes;
};
OP.math.cl = function(arr, n, z) {
	var r = [];
	fn([], arr, n);
	return r;
	function fn(t, a, n) {
		if (n === 0 || z && r.length == z) {return r[r.length] = t;}
		for (var i = 0, l = a.length - n; i <= l; i++) {
			if (!z || r.length < z) {
				var b = t.slice();
				b.push(a[i]);
				fn(b, a.slice(i + 1), n - 1);
			}
		}
	}
};
OP.math.dtl = function (d, t, n, z) {
	var r = [];
	if (d.length <= n) {
		r = OP.math.cl(t, n - d.length, z);
		for (var i = r.length; i--;) {r[i] = d.concat(r[i]);}
	}
	return r;
};
OP.fn.arrRound = function (list, total){
	var v, diff = 0,
		sum = 0;
	for (var i =  list.length; i--;) {
		v = list[i] = Math.max(1, Math.round(list[i]));
		sum += v;
	}
	diff = sum - total;
	if (diff > 0) {//超出预设从大的斟减
		while(true){
			var hasOp = false;
			for (i = 0, j = list.length; i < j; i++) {
				if (list[i] > 1) {
					list[i] -= 1;
					diff--;
					if (diff === 0) {
						return list;
					}
					hasOp = true;
				}
			}
			if (!hasOp) {
				break;
			}
		}
	}else if(diff < 0){// 不足预设
		for (i =  list.length; i--;) {
			list[i] += 1;
			diff++;
			if (diff === 0) {
				break;
			}
		}
	}
	return list;
};

OP.main=function(vm){
	OP.vm = vm;
	OP.VS.init();
	OP.SingleList.init();
	OP.SingleList.createList();
	OP.SingleList.changeType(0);
};
OP.changebs=function(num, item){
	item.bs += num;
	item.prize = item.bs*item.spx;
	if (item.prize > 0) {
		item.prize = parseFloat(OP.math.round(item.prize)).toFixed(2);
	}
	OP.SingleList.getCodeInfo();
}
OP.changeType=function(type){
	OP.SingleList.changeType({'avg':0,'hot':2,'cold':1}[type]);
}