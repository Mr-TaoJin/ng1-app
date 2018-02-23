var jczq = {
	vm :{},
	opts : {
		getOpts : function(){
			var o = jczq.opts.getDTG();
			jczq.vm.betOpts = o;
			var opts = o.conArr; 
			var ggType = o.ggmode;
			return {
				o : o,
				opts : opts,
				ggType : ggType
			};
		},
		getDTG : function(){//胆,拖,过关方式	
			if(jczq.vm.g_config.lottery_type.indexOf('had')==-1){
				return jczq.opts.getOtherDTG();
			}
			var obj = {};
				obj.conArr = []; //投注内容
				obj.tuo = [];//拖
				obj.dan = [];//胆
				obj.ggmode = [];//过关方式
				obj.freeTypes = [];//分解过关方式,所有串1过关
				obj.isShowhhgy = false;//不显示单一玩法
			var	detail = [],//投注详情
				details ={};//奖金明细
				details.dan = [],details.tuo = [];
			//过关方式
			var passway = jczq.vm.getPassWay();
			obj.freeTypes = Es.helper.getAllc1(passway);
			obj.ggmode = passway;
			for(var key in jczq.vm.selectMatchMap){
				var rqstr=0,spfstr=0,jqsstr=0,bqcstr=0,cbfstr=0,sfstr=0,rfsfstr=0,sfcstr=0,dxfstr=0;
				var sp,type,idx;
				var spf=[],rq=[],jqs=[],cbf=[],bqc=[],sf=[],rfsf=[],sfc=[],dxf=[],tzselect =[];max_min=[];
				var spf2=[],rq2=[],jqs2=[],cbf2=[],bqc2=[],sf2=[],rfsf2=[],sfc2=[],dxf2=[];
				var selectM = jczq.vm.selectMatchMap[key];
				var match = selectM.m;
				if(!match){
					continue;
				}
				for(var pool in selectM){
					if(!poolLimit[pool]){
						continue;
					}
					for(var bet in selectM[pool]){
						var text = jczq.vm.betCnMap[pool][bet];
						type = jczq.vm.betEnMap[pool][bet];
						/*if(pool=='hhad'){
							text = "让"+text;
						}*/
						sp = selectM[pool][bet];
						
						var typecode="spf";
						var lose ="";
						if(pool=="hhad"){
							lose = parseInt(match.hhad.fixedodds,10);
							rqstr++;
							lose = parseInt(lose, 10)>0 ? "+"+lose : lose;
							rq[rq.length] = "rq-"+type+'@'+lose+'#'+sp;
							rq2[rq2.length] = "spf-"+type+'@'+lose+'#'+sp;
						}	
						else if(pool=="had"){
							spfstr++;
							spf[spf.length] = "spf-"+type+'#'+sp;
							spf2[spf2.length] = "nspf-"+type+'#'+sp;
							typecode="nspf";
						}	
						else if(pool="ttg"){
							jqsstr++;
							jqs[jqs.length] = "jqs-"+type+'#'+sp;
							jqs2[jqs2.length] = "jqs-"+type+'#'+sp;
							typecode="jqs";
						}							
						else if(pool="crs"){
							cbfstr++;
							type = type.replace('-',"");
							cbf[cbf.length] = "bf-"+type.replace('-',"")+'#'+sp;
							type = type=='9-0' ? '3A':type=='0-9'? '0A':type=='9-9' ? '1A':type.replace('-',"");
							cbf2[cbf2.length] = "bf-"+type+'#'+sp;
							typecode="bf";
						}		
						else if(pool=="hafu"){
							bqcstr++;
							bqc[bqc.length] = "bqc-"+type.replace('-',"")+'#'+sp;
							bqc2[bqc2.length] = "bqc-"+type.replace('-',"")+'#'+sp;
							typecode="bqc";
						}else if(pool=="mnl"){
							sfstr++;
							sf[sf.length] = "sf-"+sfstr+'#'+sp;
							sf2[sf2.length] = "sf-"+sfstr+'#'+sp;
							typecode="sf";
						}
						else if(pool=="hdc"){
							lose = parseInt(match.hdc.fixedodds,10);
							lose = parseInt(lose, 10)>0 ? "+"+lose : lose;
							rfsfstr++;
							rfsf[rfsf.length] = "rfsf-"+rfsfstr+'@'+lose+'#'+sp;
							rfsf2[rfsf2.length] = "rfsf-"+rfsfstr+'@'+lose+'#'+sp;
							typecode="rfsf";
						}	
						else if(pool=="wnm"){
							sfcstr++;
							sfc[sfc.length] = "sfc-"+type+'#'+sp;
							sfc2[sfc2.length] = "sfc-"+type+'#'+sp;
							typecode="sfc";
						}
						else if(pool=="hilo"){
							dxfstr++;
							dxf[dxf.length] = "dxf-"+dxfstr+'#'+sp;
							dxf2[dxf2.length] = "dxf-"+dxfstr+'#'+sp;
							typecode="dxf";
						}
						tzselect[tzselect.length] = {"text":text,"type":typecode,"sp":sp,"bet":bet,"id":match.id,"value":type};//投注选项（SP值）
						max_min[max_min.length] = sp;
					}
				};
					var item = [];
					if(spfstr > 0)item.push("spf_"+key+"_"+spfstr);
					if(rqstr > 0 )item.push("rq_"+key+"_"+rqstr);
					if(jqsstr > 0)item.push("jqs_"+key+"_"+jqsstr);
					if(cbfstr > 0)item.push("cbf_"+key+"_"+cbfstr);
					if(bqcstr > 0)item.push("bqc_"+key+"_"+bqcstr);
					if(sfstr > 0)item.push("sf_"+key+"_"+sfstr);
					if(rfsfstr > 0)item.push("rfsf_"+key+"_"+rfsfstr);
					if(sfcstr > 0)item.push("sfc_"+key+"_"+sfcstr);
					if(dxfstr > 0)item.push("dxf_"+key+"_"+dxfstr);
					var isDan = selectM.isDan || false;
					isDan ? obj.dan.push(item) : obj.tuo.push(item);
					var item2 = [];
					if(spf.length > 0)item2[item2.length] =spf.join(",");
					if(rq.length > 0)item2[item2.length] =rq.join(",");
					if(cbf.length > 0)item2[item2.length] =cbf.join(",");
					if(jqs.length > 0)item2[item2.length] =jqs.join(",");
					if(bqc.length > 0)item2[item2.length] =bqc.join(",");
					if(sf.length > 0)item2[item2.length] =sf.join(",");
					if(rfsf.length > 0)item2[item2.length] =rfsf.join(",");
					if(sfc.length > 0)item2[item2.length] =sfc.join(",");
					if(dxf.length > 0)item2[item2.length] =dxf.join(",");
					var itemdan = item2.join("|");
					isDan ? details.dan.push(itemdan) : details.tuo.push(itemdan);
					var item3 = [];
					if(spf2.length > 0)item3[item3.length] =spf2.join(",");
					if(rq2.length > 0)item3[item3.length] =rq2.join(",");
					if(cbf2.length > 0)item3[item3.length] =cbf2.join(",");
					if(jqs2.length > 0)item3[item3.length] =jqs2.join(",");
					if(bqc2.length > 0)item3[item3.length] =bqc2.join(",");
					if(sf2.length > 0)item3[item3.length] =sf2.join(",");
					if(rfsf2.length > 0)item3[item3.length] =rfsf2.join(",");
					if(sfc2.length > 0)item3[item3.length] =sfc2.join(",");
					if(dxf2.length > 0)item3[item3.length] =dxf2.join(",");
					var itemdan2 = item3.join("|");
					isDan ? obj.conArr.push(itemdan2+"D") : obj.conArr.push(itemdan2);
					max_min.sort(function compare(a,b){return b - a});
					var det = {};
					det.week = match.num;//周三001
					det.time = match.date+" "+match.time;//03-31 14:30
					det.host = match.h_cn_abbr;//主队
					det.away = match.a_cn_abbr;//客队
					det.dan = isDan ? "√" : "×";//胆
					det.max = max_min[max_min.length-1];//最大值
					det.min = max_min[0];//最小值
					det.code = tzselect;//投注串
					det.id=match.id;
					detail[detail.length] = det;//奖金明细
			};
			obj.detail =  detail;
			obj.details = details;
			return obj;
		},
		getOtherDTG : function(){//胆,拖,过关方式
			var obj = {};
			obj.conArr = []; //投注内容
			obj.tuo = [];//拖
			obj.dan = [];//胆
			obj.ggmode = [];//过关方式
			obj.freeTypes = [];//分解过关方式,所有串1过关
			obj.isShowhhgy = false;//不显示单一玩法
			var	detail = [],//投注详情
			details ={};//奖金明细
			details.dan = [],details.tuo = [];
			//过关方式
			var passway = jczq.vm.getPassWay();
			obj.freeTypes = Es.helper.getAllc1(passway);
			obj.ggmode = passway;
			for(var key in jczq.vm.selectMatchMap){
				var rqstr=0,spfstr=0,jqsstr=0,bqcstr=0,cbfstr=0,sfstr=0,rfsfstr=0,sfcstr=0,dxfstr=0;
				var sp,type,idx;
				var spf=[],rq=[],jqs=[],cbf=[],bqc=[],sf=[],rfsf=[],sfc=[],dxf=[],tzselect =[];max_min=[];
				var spf2=[],rq2=[],jqs2=[],cbf2=[],bqc2=[],sf2=[],rfsf2=[],sfc2=[],dxf2=[];
				var selectM = jczq.vm.selectMatchMap[key];
				var match = selectM.m;
				if(!match){
					continue;
				}
				for(var i in poolCode){
					var pool = poolCode[i];
					if(!selectM[pool]){
						continue;
					}
					for(var bet in selectM[pool]){
						var text = jczq.vm.betCnMap[pool][bet];
						type = jczq.vm.betEnMap[pool][bet];
						/*if(pool=='hhad'){
							text = "让"+text;
						}*/
						sp = selectM[pool][bet];
						var typecode="spf";
						if(pool=="hhad"){
							var lose = parseInt(match.hhad.fixedodds);
							rqstr++;
							rq2[rq2.length] = "spf-"+type+'@'+lose+'#'+sp;
						}	
						else if(pool=="had"){
							spfstr++;
							spf2[spf2.length] = "nspf-"+type+'#'+sp;
							typecode="nspf";
						}	
						else if(pool=="ttg"){
							jqsstr++;
							jqs2[jqs2.length] = "jqs-"+type+'#'+sp;
							typecode="jqs";
						}							
						else if(pool=="crs"){
							cbfstr++;
							type = type=='9-0' ? '3A':type=='0-9'? '0A':type=='9-9' ? '1A':type.replace('-',"");
							cbf2[cbf2.length] = "bf-"+type+'#'+sp;
							typecode="bf";
						}		
						else if(pool=="hafu"){
							bqcstr++;
							bqc2[bqc2.length] = "bqc-"+type+'#'+sp;
							typecode="bqc";
						}
						else if(pool=="mnl"){
							sfstr++;
							sf2[sf2.length] = "sf-"+sfstr+'#'+sp;
							typecode="sf";
						}	
						else if(pool=="hdc"){
							lose = parseInt(match.hdc.fixedodds,10);
							lose = parseInt(lose, 10)>0 ? "+"+lose : lose;
							rfsfstr++;
							rfsf[rfsf.length] = "rfsf-"+rfsfstr+'@'+lose+'#'+sp;
							rfsf2[rfsf2.length] = "rfsf-"+rfsfstr+'@'+lose+'#'+sp;
							typecode="rfsf";
						}	
						else if(pool=="wnm"){
							sfcstr++;
							sfc[sfc.length] = "sfc-"+type+'#'+sp;
							sfc2[sfc2.length] = "sfc-"+type+'#'+sp;
							typecode="sfc";
						}
						else if(pool=="hilo"){
							dxfstr++;
							dxf[dxf.length] = "dxf-"+dxfstr+'#'+sp;
							dxf2[dxf2.length] = "dxf-"+dxfstr+'#'+sp;
							typecode="dxf";
						}
						tzselect[tzselect.length] = {"text":text,"type":typecode,"sp":sp,"bet":bet,"id":match.id,"value":type};//投注选项（SP值）
						max_min[max_min.length] = sp;
					}
				};
					var isDan = selectM.isDan || false;
					var item3 = [];
					if(spf2.length > 0)item3[item3.length] =spf2.join(",");
					if(rq2.length > 0)item3[item3.length] =rq2.join(",");
					if(cbf2.length > 0)item3[item3.length] =cbf2.join(",");
					if(jqs2.length > 0)item3[item3.length] =jqs2.join(",");
					if(bqc2.length > 0)item3[item3.length] =bqc2.join(",");
					if(sf2.length > 0)item3[item3.length] =sf2.join(",");
					if(rfsf2.length > 0)item3[item3.length] =rfsf2.join(",");
					if(sfc2.length > 0)item3[item3.length] =sfc2.join(",");
					if(dxf2.length > 0)item3[item3.length] =dxf2.join(",");
					var itemdan2 = item3.join("|");
					isDan ? obj.conArr.push(itemdan2+"D") : obj.conArr.push(itemdan2);
					max_min.sort(function compare(a,b){return b - a});
					var det = {};
					det.week = match.num;//周三001
					
					det.time = match.date+" "+match.time;//03-31 14:30
					det.host = match.h_cn_abbr;//主队
					det.away = match.a_cn_abbr;//客队
					det.dan = isDan ? "√" : "×";//胆
					det.max = max_min[max_min.length-1];//最大值
					det.min = max_min[0];//最小值
					det.code = tzselect;//投注串
					det.id=match.id;
					detail[detail.length] = det;//奖金明细
			};
			obj.detail =  detail;
			obj.details = details;
			return obj;
		}
	},
	award : {
		range : [],
		obj : {},
		//计算奖金范围
		countRange : function(opts, ggType, bs){
			jczq.award.range=Es.jc.getBonusRange(opts, ggType, false, bs);
			return jczq.award.range;
		}
	},
	bet : {
		reObj :{betNum:0, min:0, max:0},
		main : function(){
			var obj = jczq.opts.getOpts();
			jczq.award.obj = obj;
			var opts = obj.opts, ggType = obj.ggType;
			if(!ggType || ggType.length==0)return jczq.bet.clear();
			var bs = jczq.vm.order.betMul;
			if(bs>0){
				console.log(opts);
				jczq.bet.reObj.betNum = jczq.bet.count(opts, ggType); //注数
				var rang = jczq.award.countRange(opts, ggType, bs);
				jczq.bet.reObj.min = rang[0]; //最小奖金
				jczq.bet.reObj.max = rang[1]; //最大奖金
				return jczq.bet.reObj;
			}else return jczq.bet.clear();
		},
		//计算注数
		count : function(opts, ggType){
			var delSame = false; //去除单一玩法 - 暂不用到，默认false
			return Es.jc.getCodesCount(opts, ggType, delSame);
		},
		clear : function(){
			jczq.bet.reObj.betNum = 0;
			jczq.bet.reObj.min = 0;
			jczq.bet.reObj.max = 0;
			return jczq.bet.reObj;
		}
	}
};
var Handle = {
	forEach : function (o, f, z) {
        if (o) {
            for (var i = 0, j = o.length; i < j; i++) {
                if (false === f.call(z || o[i], o[i], i, o, j)) {
                    break;
                }
            }
        }
        return z || o;
    },
    isFunction : function (s) {
        return typeof(s)=='function' && s.call;
    },
    trim : function (s) {
        return s.replace(/^\s+|\s+$/g, '');
    },
    intt : function (n) {
        return parseInt(n, 10);
    },
    reduce:function (a, fn, b, o) {Handle.each(a,function(v, k, a, j) {if (b === undefined) {b = v;} else {b = fn.call(o || v, b, v, k, a, j);}});return b;},
    each:function(o, f, z) {return (o && Handle.arrayLike(o)) ? Handle.forEach(o, f, z) : Handle.forIn(o, f, z);},
    arrayLike:function (o) {return typeof o === 'object' && isFinite(o.length);},
    forIn:function (o, f, z) {var k,i = 0;if (o) {for (k in o) {if (Handle.has(o, k) && false === f.call(z || o[k], o[k], k, o, i++)) {break;}}}return z || o;},
    map : function (a, f, o) {
        return Handle.each(a, function (v, k, a, j) {
            this.push(f.call(o || v, v, k, a, j))
        }, [])
    },
    filter : function (a, f, o) {
		return Handle.forEach(a, function(v, k, a, j) {
			if (f.call(o || v, v, k, a, j)) {
				this.push(v)
			}
		}, [])
	}
};

var Es = {
		helper : {
			cache : {},
			NM2N1 : {'1*1':[1],'2*1':[2],'3*1':[3],'4*1':[4],'5*1':[5],'6*1':[6],'7*1':[7],'8*1':[8],'3*3':[2],'3*4':[2,3],'4*6':[2],'4*11':[2,3,4],'5*10':[2],'5*20':[2,3],'5*26':[2,3,4,5],'6*15':[2],'6*35':[2,3],'6*50':[2,3,4],'6*57':[2,3,4,5,6],'4*4':[3],'4*5':[3,4],'5*16':[3,4,5],'6*20':[3],'6*42':[3,4,5,6],'5*5':[4],'5*6':[4,5],'6*22':[4,5,6],'6*6':[5],'6*7':[5,6],'7*7':[6],'7*8':[6,7],'7*21':[5],'7*35':[4],'7*120':[2,3,4,5,6,7],'8*8':[7],'8*9':[7,8],'8*28':[6],'8*56':[5],'8*70':[4],'8*247':[2,3,4,5,6,7,8]},
			getN1 : function (nm){
				if (nm=='单关') {nm='1*1';}else{nm = nm.replace(/['串'\-x]/g,'*');}
				return Es.helper.NM2N1[nm];
			},
			getMinGgNum : function (types){
				var ntypes = [];
				for (var i =  types.length; i--;) {ntypes = ntypes.concat(Es.helper.getN1(types[i]));}
				ntypes.sort();
				return parseInt(ntypes[0], 10);
			},
			parseNM : function (nm){
				if (!(nm in Es.helper.cache)) {
					if (nm == '单关') {
						Es.helper.cache[nm] = [1, 1, [1]];
					}else{
						var tmp = Handle.trim(nm).split(/['串'\-x]/);
						Es.helper.cache[nm] = [Handle.intt(tmp[0]), Handle.intt(tmp[1]), Es.helper.getN1(nm)];
					}
				}
				return Es.helper.cache[nm];
			},
			countNM : function (code, n1s){
				code = Handle.map(code, function (){return Handle.intt(this);});
				return Handle.reduce(n1s, function (zs, type){
					var cl = MathUtil.cl(code, Handle.intt(type));
					return zs + Handle.reduce(cl, function (zs, g){return zs + MathUtil.a(g);}, 0);
				}, 0);
			},
			getCodesCount : function (d, t, n, del){
				if (n == '单关') {
					return Handle.reduce(t, function (s, l){return s + Handle.reduce(l, function (s, t){return s + Handle.intt(t);}, 0);}, 0);
				}
				var nm = Es.helper.parseNM(n), 
					group = MathUtil.dtl(d, t, nm[0]);
				return Handle.reduce(group, function (zs, g){
					var al = del ? MathUtil.al(g, function (c){
						var flag = '-' + c[0].split('-')[1];
						return Handle.some(c, function (){return this.indexOf(flag) === -1;});
					}) : MathUtil.al(g);
					return zs + Handle.reduce(al, function (zs, g){return zs + Es.helper.countNM(g, nm[2]);}, 0);
				}, 0);
			},
			getAllc1 : function (types){
				var g={}, g2=[];
				Handle.forEach(types, function (type){
					Handle.forEach(Es.helper.getN1(type), function (t){g[t] = true;});
				});
				for(var k in g){
					g2.push(k == 1 ? '单关' : (k +'串'+1));
				}
				g2.sort(function (a, b){return parseInt(a, 10) > parseInt(b, 10) ? 1 : -1;});
				return g2;
			},
			splitNM : function (code, n1s){
				return Handle.reduce(n1s, function (r, type){return r.concat(MathUtil.cl(code, Handle.intt(type)));}, []);
			},
			getSigleCodes : function (d, t, n, del){
				var nm = Es.helper.parseNM(n), group, len = nm[0], diff = len - (d.length + t.length);
				if (nm[1] > 1 && diff > 0) {for (var i =  diff; i--;) {t.push([0]);}}//多串中有子串，用0sp值的补全。
				group = MathUtil.dtl(d, t, len);
				return Handle.reduce(group, function (codes, g){
					var al = MathUtil.al(g);
					return codes.concat(Handle.reduce(al, function (rc, c){return rc.concat(Es.helper.splitNM(c, nm[2]));}, []));
				}, []);
			}
		},
		algo : {
			bonus : {
				minRec : [], maxRec : [], ggTypes : [], beishu : 1, cache : [],
				getBonusSum : function(list){
					var cl = {}, sum = 0, bs = Es.algo.bonus.beishu, bodetail = [];
					for (var i = 0, j = list.length; i < j; i++) {
						var code = list[i], b = 1, len = code.length;
						var ht = '';
//						for (var x = code.length; x--;) {b *= code[x]; ht += code[x]+"×";}
						for (var x = code.length; x--;) {
							ht += code[x]+"×";
							 var codessp = Number(getReaplceByVar(code[x]+""));
							 b *= codessp;
						}
						if (b) {
							var sinB = parseFloat(cauScale(2, b*2/Math.pow(10, code.length*2)));//单注单倍四舍六入五成双
							var val = parseFloat(cauScale(2, sinB*bs)); //打倍后
//							sum+=Math.round(b*100)/100*2*bs;
							sum+=val;
							if(bodetail[code.length]==null){
								bodetail[code.length] = ht + bs +"倍×2 = "+ val;
							}else{
								bodetail[code.length] += "|" + ht + bs +"倍×2 = "+ val;
							}
							if (!(len in cl)) {cl[len] = 0;}
							cl[len]++;
						}			
					}
					return {bonus: parseFloat(cauScale(2, sum)), codeCount: cl, bodetail: bodetail};
				},
				getHitSingleCodes : function (n, min){
					var HR = Es.helper, list = [], dl = [], tl = [], danSort = min ? Es.algo.bonus.minRec.slice() : Es.algo.bonus.maxRec.slice(), dir = min ? 1 : -1;
					danSort.sort(function (a, b){
						if (a.isdan === b.isdan) {return (a[0] > b[0] ? 1 : -1)*dir;}
							else{return a.isdan ? -1 : 1;}
					});
					Handle.forEach(danSort, function (o, i){
						if (i >= n) {
							var t = [0];
							t.isdan = o.isdan;
							t.sum = o.sum;
							o = t;
						}
						if (o.isdan) {dl.push(o);}else{tl.push(o);}
					});
					Handle.forEach(Es.algo.bonus.ggTypes, function (type){list = list.concat(HR.getSigleCodes(dl, tl, type));});
					return list;
				},
				getMaxBonus : function (opts, ggType){
					if (opts.length < 2 && ggType.indexOf('单关') == -1) {return 0;}
					Es.algo.bonus.ggTypes = ggType;
					Es.algo.bonus.maxRec = opts;
					return Es.algo.bonus.getBonusSum(Es.algo.bonus.getHitSingleCodes(opts.length)).bonus;
				},
				setBeishu : function (bs){
					Es.algo.bonus.beishu = bs;
					return this;
				},
				getHitList : function (min, max, ggType){
					var list = [], freeTypes, maxCodes, maxSum, minCodes, minSum;
					Es.algo.bonus.minRec = min;
					Es.algo.bonus.maxRec = max;
					Es.algo.bonus.ggTypes = ggType;
					freeTypes = Es.helper.getAllc1(Es.algo.bonus.ggTypes);
					cache = [];
					var i = Math.max(Es.algo.bonus.maxRec.length, Es.algo.bonus.minRec.length), ii=i,
						isSlide=document.getElementById('isjprizesuc'),
						min_hit = Es.helper.getMinGgNum(Es.algo.bonus.ggTypes);
					function getHitNums(c){
						return maxSum.codeCount[parseInt(c, 10) || 1]||0;
					}
					for (; i >= min_hit; i--) {
						if (isSlide && i<ii && i>min_hit) {continue;}
						maxCodes = Es.algo.bonus.getHitSingleCodes(i);
						maxSum = Es.algo.bonus.getBonusSum(maxCodes);
						minCodes = Es.algo.bonus.getHitSingleCodes(i, true);
						minSum = Es.algo.bonus.getBonusSum(minCodes);
						if (isSlide) {
							list.push({min: minSum.bonus,max: maxSum.bonus});
						}else{
							cache[i] = [minCodes, minSum, maxCodes, maxSum];
							list.push({
								num: i,
								hitNum: Handle.map(freeTypes, getHitNums),
								bs: Es.algo.bonus.beishu,
								min: minSum.bonus,
								mindetail: minSum.bodetail,
								max: maxSum.bonus,
								maxdetail: maxSum.bodetail
							});
						}
					}
					list.ggTypes = freeTypes;
					return list;
				}				
			}
		},
		jc : {
			checkMapBySfc:{},
			allSfc:function(){
				var algo = this, allSfc = [];
				for (var i = 0; i < 2; i++) {//0=s,1=f
					for (var j = 0; j < 6; j++) {
						allSfc.push({
							name: i+''+(j+1),
							diff: j*5+1,
							win: i == 1 ? 2 : 1
						});
					}
				}
				for (var i =  allSfc.length; i--;) {
					var curSfc = allSfc[i], item = {};
					item['sfc-'+curSfc.name]=1;
					item['sf-'+curSfc.win] = 1;
					item['dxf-1'] = 1;
					item['dxf-2'] = 1;
					Es.jc.checkMapBySfc[curSfc.name] = item;
				}
				return allSfc;
			},
			allBf : [{"name":"00","sum":0,"diff":0,"spf":1},{"name":"01","sum":1,"diff":1,"spf":0},{"name":"02","sum":2,"diff":2,"spf":0},{"name":"03","sum":3,"diff":3,"spf":0},{"name":"04","sum":4,"diff":4,"spf":0},{"name":"05","sum":5,"diff":5,"spf":0},{"name":"10","sum":1,"diff":1,"spf":3},{"name":"11","sum":2,"diff":0,"spf":1},{"name":"12","sum":3,"diff":1,"spf":0},{"name":"13","sum":4,"diff":2,"spf":0},{"name":"14","sum":5,"diff":3,"spf":0},{"name":"15","sum":6,"diff":4,"spf":0},{"name":"20","sum":2,"diff":2,"spf":3},{"name":"21","sum":3,"diff":1,"spf":3},{"name":"22","sum":4,"diff":0,"spf":1},{"name":"23","sum":5,"diff":1,"spf":0},{"name":"24","sum":6,"diff":2,"spf":0},{"name":"25","sum":7,"diff":3,"spf":0},{"name":"30","sum":3,"diff":3,"spf":3},{"name":"31","sum":4,"diff":2,"spf":3},{"name":"32","sum":5,"diff":1,"spf":3},{"name":"33","sum":6,"diff":0,"spf":1},{"name":"40","sum":4,"diff":4,"spf":3},{"name":"41","sum":5,"diff":3,"spf":3},{"name":"42","sum":6,"diff":2,"spf":3},{"name":"50","sum":5,"diff":5,"spf":3},{"name":"51","sum":6,"diff":4,"spf":3},{"name":"52","sum":7,"diff":3,"spf":3},{"name":"3A","sum":7,"spf":3},{"name":"1A","sum":7,"spf":1},{"name":"0A","sum":7,"spf":0}]
			, bfCheckMap : {
				"10":{"bf-10":1,"jqs-1":1,"nspf-3":1,"bqc-13":1,"bqc-33":1},
				"11":{"bf-11":1,"jqs-2":1,"nspf-1":1,"bqc-01":1,"bqc-31":1,"bqc-11":1},
				"12":{"bf-12":1,"jqs-3":1,"nspf-0":1,"bqc-00":1,"bqc-10":1,"bqc-30":1},
				"13":{"bf-13":1,"jqs-4":1,"nspf-0":1,"bqc-00":1,"bqc-10":1,"bqc-30":1},
				"14":{"bf-14":1,"jqs-5":1,"nspf-0":1,"bqc-00":1,"bqc-10":1,"bqc-30":1},
				"15":{"bf-15":1,"jqs-6":1,"nspf-0":1,"bqc-00":1,"bqc-10":1,"bqc-30":1},
				"20":{"bf-20":1,"jqs-2":1,"nspf-3":1,"bqc-13":1,"bqc-33":1},
				"21":{"bf-21":1,"jqs-3":1,"nspf-3":1,"bqc-03":1,"bqc-13":1,"bqc-33":1},
				"22":{"bf-22":1,"jqs-4":1,"nspf-1":1,"bqc-01":1,"bqc-31":1,"bqc-11":1},
				"23":{"bf-23":1,"jqs-5":1,"nspf-0":1,"bqc-00":1,"bqc-10":1,"bqc-30":1},
				"24":{"bf-24":1,"jqs-6":1,"nspf-0":1,"bqc-00":1,"bqc-10":1,"bqc-30":1},
				"25":{"bf-25":1,"jqs-7":1,"nspf-0":1,"bqc-00":1,"bqc-10":1,"bqc-30":1},
				"30":{"bf-30":1,"jqs-3":1,"nspf-3":1,"bqc-03":1,"bqc-13":1,"bqc-33":1},
				"31":{"bf-31":1,"jqs-4":1,"nspf-3":1,"bqc-03":1,"bqc-13":1,"bqc-33":1},
				"32":{"bf-32":1,"jqs-5":1,"nspf-3":1,"bqc-03":1,"bqc-13":1,"bqc-33":1},
				"33":{"bf-33":1,"jqs-6":1,"nspf-1":1,"bqc-01":1,"bqc-31":1,"bqc-11":1},
				"40":{"bf-40":1,"jqs-4":1,"nspf-3":1,"bqc-03":1,"bqc-13":1,"bqc-33":1},
				"41":{"bf-41":1,"jqs-5":1,"nspf-3":1,"bqc-03":1,"bqc-13":1,"bqc-33":1},
				"42":{"bf-42":1,"jqs-6":1,"nspf-3":1,"bqc-03":1,"bqc-13":1,"bqc-33":1},
				"50":{"bf-50":1,"jqs-5":1,"nspf-3":1,"bqc-03":1,"bqc-13":1,"bqc-33":1},
				"51":{"bf-51":1,"jqs-6":1,"nspf-3":1,"bqc-03":1,"bqc-13":1,"bqc-33":1},
				"52":{"bf-52":1,"jqs-7":1,"nspf-3":1,"bqc-03":1,"bqc-13":1,"bqc-33":1},
				"0A":{"bf-0A":1,"jqs-7":1,"nspf-0":1,"bqc-00":1,"bqc-10":1,"bqc-30":1},
				"1A":{"bf-1A":1,"jqs-7":1,"nspf-1":1,"bqc-01":1,"bqc-31":1,"bqc-11":1},
				"3A":{"bf-3A":1,"jqs-7":1,"nspf-3":1,"bqc-03":1,"bqc-13":1,"bqc-33":1},
				"05":{"bf-05":1,"jqs-5":1,"nspf-0":1,"bqc-00":1,"bqc-10":1,"bqc-30":1},
				"04":{"bf-04":1,"jqs-4":1,"nspf-0":1,"bqc-00":1,"bqc-10":1,"bqc-30":1},
				"03":{"bf-03":1,"jqs-3":1,"nspf-0":1,"bqc-00":1,"bqc-10":1,"bqc-30":1},
				"02":{"bf-02":1,"jqs-2":1,"nspf-0":1,"bqc-00":1,"bqc-10":1},
				"01":{"bf-01":1,"jqs-1":1,"nspf-0":1,"bqc-00":1,"bqc-10":1},
				"00":{"bf-00":1,"jqs-0":1,"nspf-1":1,"bqc-11":1}
			}
			, isHtgg : false,
			isHt : function(opts){
				//nspf-3#3.00,nspf-1#3.20,nspf-0#2.10|spf-3@+1#1.56,spf-1@+1#3.70,spf-0@+1#4.60|bf-10#8.25
				var str = '';
				for(var i=0; i<opts.length; i++){
					var opta = opts[i].split("|");
					for(var j=0; j<opta.length; j++){
						var optar = opta[j].split(",");
						for(var k=0; k<optar.length; k++){
							if(i==0 && j==0 && k==0)
								str=optar[k].split("-")[0];
							else if(str!=optar[k].split("-")[0]){
								return true;
							}
						}
					}
				}
				return false;
			},
			testRqSpfByBf : function (str, bf){
				var rq = parseInt(str.split('#')[0].split('@')[1], 10);
				if (rq > 0) {
					if(bf.name == '0A'){
						if (rq === 1) {
							return str.indexOf('spf-0') === 0 || str.indexOf('spf-1') === 0;
						}
						return str.indexOf('spf-') === 0;
					}
					if (bf.spf < 1) {
						if (rq < bf.diff) {
							return str.indexOf('spf-0') === 0;
						}else if(rq === bf.diff){
							return str.indexOf('spf-1') === 0;
						}
					}
					return str.indexOf('spf-3') === 0;
				}else{
					rq = Math.abs(rq);
					if(bf.name == '3A'){
						if (rq === 1) {
							return str.indexOf('spf-3') === 0 || str.indexOf('spf-1') === 0;
						}
						return str.indexOf('spf-') === 0;
					}
					if (bf.spf>0) {
						if (bf.diff > rq) {
							return str.indexOf('spf-3') === 0;
						}else if(bf.diff === rq){
							return str.indexOf('spf-1') === 0;
						}
					}
					return str.indexOf('spf-0') === 0;
				}		
			},
			testRfSfBySfc:function(str, sfc, def){
				var rf = parseInt(str.split('#')[0].split('@')[1], 10),
					isSf1 = str.indexOf('rfsf-1') === 0;
				return sfc.win === 1 ? ((rf+sfc.diff<0) ? !isSf1 : isSf1) :
					((rf-sfc.diff>0) ? isSf1 : !isSf1);
			},
			filterInvalidOpts : function (single, bf){
				var ret  = [], len = 0, filter;
				var lt;
				if(jczq.vm.g_config.lottery_type=='ht'||jczq.vm.g_config.lottery_type=='had'){
					lt ='spf';
					filter=Es.jc.bfCheckMap[bf.name];
				}else{
					lt ='rfsf-';
					filter=Es.jc.checkMapBySfc[bf.name];
				}
				function test(str){
					if (str.indexOf(lt) === 0) {
						if(jczq.vm.g_config.lottery_type=='ht'||jczq.vm.g_config.lottery_type=='had'){
							return Es.jc.testRqSpfByBf(str, bf);
						}else{
							return Es.jc.testRfSfBySfc(str, bf);
						}
					}
					return str.split('#')[0] in filter;
				}
				for (var i = 0, j = single.length; i < j; i++) {
					if(jczq.vm.g_config.lottery_type=='ht'||jczq.vm.g_config.lottery_type=='had'){
						var types = Handle.filter(single[i].split(','), test);
						if (types.length) {ret[len++] = types;}
					}else{
						var types = single[i].split(',').filter(test);
						if (types.length) {ret[len++] = types;}
					}
				}
				return ret;
			},
			getSgBound : function (str){
				var single = str.split('|'), minSum=9e9, maxSum=-1, isHhgg = Es.jc.isHtgg,
				minOpts, maxOpts, minBf, maxBf, dan = str.indexOf('D') > -1;
				if (isHhgg) {
					var ppp;
					if(jczq.vm.g_config.lottery_type=='ht'||jczq.vm.g_config.lottery_type=='had'){
						ppp = Es.jc.allBf;
					}else{
						ppp = Es.jc.allSfc();
					}
					//var allSfc = Es.jc.allSfc();
					Handle.forEach(ppp, function (bf){
						var optsAl = MathUtil.al(Es.jc.filterInvalidOpts(single, bf)), hits, sum;
						for (var i = 0, j = optsAl.length; i < j; i++) {
							hits = optsAl[i];
							sum = 0;
							for (var k =  hits.length; k--;) {
								hits[k] = parseFloat(hits[k].split('#')[1])||1;
								sum += hits[k];
							}
							if (sum > maxSum) {maxSum = sum; maxOpts=hits.slice();maxBf = bf.name;}
							if (sum < minSum) {minSum = sum; minOpts=hits.slice();minBf = bf.name;}
						}
					});
				}else{
					var optsAl = str.split(','), sp;
					for (var i = 0, j = optsAl.length; i < j; i++) {
						sp = parseFloat(optsAl[i].split('#')[1])||1;
						if (sp > maxSum) {maxSum = sp; maxOpts=[sp];}
						if (sp < minSum) {minSum = sp; minOpts=[sp];}
					}
				}
				minOpts.sum = minSum;
				minOpts.bf = minBf;
				maxOpts.sum = maxSum;
				maxOpts.bf = maxBf;
				minOpts.isdan = maxOpts.isdan = dan;
				return [minOpts, maxOpts];
			},
			getLimitOpts : function (opts){
				var minOpts=[], maxOpts=[], j = 0;
				Handle.forEach(opts, function (opt){
					if (opt) {
						var real = Es.jc.getSgBound(opt);
						minOpts[j] = real[0];
						maxOpts[j++] = real[1];
					}
				});
				minOpts.sort(function (a, b){return a.sum > b.sum ? 1 : -1;});
				maxOpts.sort(function (a, b){return a.sum > b.sum ? -1 : 1;});
				return {min: minOpts, max: maxOpts};
			},
			setBeishu : function (bs){
				Es.algo.bonus.setBeishu(bs);
			},
			getBfRange : function (opts){
				return Handle.map(opts, function (opt){
					var real = Es.jc.getSgBound(opt);
					return [real[0].bf, real[1].bf];
				});
			},
			getBonusRange : function (opts, ggType, noMin, bs){
				Es.jc.isHtgg = Es.jc.isHt(opts);
				if (bs) {Es.jc.setBeishu(bs);}
				if (noMin) {
					var t = Es.jc.getLimitOpts(opts);
					return [0, Es.algo.bonus.getMaxBonus(t.max, ggType)];	
				}else{
					var info = Es.jc.getHitList(opts, ggType);
					return [info[info.length-1].min,info[0].max];
				}
			},
			getHitList : function (opts, ggType){
				var real = Es.jc.getLimitOpts(opts);
				return Es.algo.bonus.getHitList(real.min, real.max, ggType);
			},
			getPlayNum : function (code){
				return Handle.map(code.split('|'), function (plays){
					return plays.split(',').length + '-' + plays.split('-')[0];
				});
			},
			getCodesCount : function (opts, ggType, del){
				var HR = Es.helper, zs = 0, dl = [], tl = [];
				Handle.forEach(opts, function (lc){
					var gc = Es.jc.getPlayNum(lc);
					gc.isdan =lc.indexOf('D') > -1;
					if (gc.isdan) {dl.push(gc);}else{tl.push(gc);}
				});
				Handle.forEach(ggType, function (type){zs += HR.getCodesCount(dl, tl, type, del);}, this);
				return zs;
			}
		}
};

var MathUtil = {
    c: function (len, m) {
        return (function (n1, n2, j, i, n) {
            for (; j <= m;) {
                n2 *= j++;
                n1 *= i--
            }
            return n1 / n2
        })(1, 1, 1, len, len)
    },
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
    p: function (n, m) {
        for (var i = n - m, c = 1; i < n;) {
            c *= ++i
        }
        return c
    },
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
    dt: function (d, t, m) {
        return d >= m ? 0 : MathUtil.c(t, m - d)
    },
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
    bl: function (ml, b) {
        var A, bs, B = 0,
            bl = [];
        for (var i = ml.length; i--;) {
            B += (1 / ml[i]);
        }
        A = b / B;
        for (i = ml.length; i--;) {
            bs = A / ml[i];
            bl[i] = bs;
        }
        return bl;
    },
    round2: function (n) {
        if (/\d+\.\d\d5/.test(n.toString())) {
            var m = n.toString().match(/\d+\.\d(\d)/);
            return (m && m[1] % 2 == 1) ? parseFloat(n).toFixed(2) : parseFloat(m[0])
        } else {
            return parseFloat(parseFloat(n).toFixed(2))
        }
    },
    a: function (A1) {
        var ret = 1;
        for (var i = 0, j = A1.length; i < j; i++) {
            ret *= A1[i]
        }
        return j ? ret : 0
    },
    al: function (A2, fn) {
        var n = 0,
            codes = [],
            code = [],
            isTest = Handle.isFunction(fn);

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
        if (A2.length) {
            each(A2, n);
        }
        return codes
    }
}

function getReaplceByVar(valu){
	return valu.indexOf(".")!=-1?(valu.substring(valu.indexOf(".")+1,valu.length).length < 2 ? valu.replace(".", "")+"0" :  valu.toString().replace(".", "")):(valu+"00");
}


/**
 * 四舍六入五成双 - 奖金计算方式
 * @param mod 精度-要处理的小数点位数（ 值必须大于0）
 * @param big 处理值（值必须大于0）
 * @returns
 */
function cauScale(mod,big){
	if(mod<=0) return big;
	if(big<=0) return big;
	var mathstr = big.toString();
	var dian = mathstr.indexOf(".");	
	if (dian > 0 && mathstr.length - dian - 1 > mod) {
		var base = mathstr.substring(0, dian);
		var adress = mathstr.substring(dian + 1, mathstr.length);
		if (adress.length <= mod) {
			base = base + "." + adress;
		} else if (adress.length >= mod + 1) {
			var v = parseInt(adress.substring(mod, mod + 1),10);//精确位小数后一位
			var v1 = parseInt(adress.substring(mod - 1, mod),10);//精确位小数。
			var m = 0;
			
			if (v >= 6) { //精确位后大于等于6，精确位进一
				m++;
			} else if (v <= 4) {//精确位后小于等于4，精确位后舍弃
				;
			} 
			else if (v == 5 && v1 % 2 == 0) {//精确位后为5时，精确位前为偶时，精确位后一位舍弃。
				;
			} else if (v == 5 && v1 % 2 == 1) {//精确位后为5时，精确位前为奇时，精确位进一
				m++;
			}
			var s = adress.substring(0,mod-1);	
			var fl = s+v1;
			if(m>0 && parseInt(s,10)>0){
				  fl = parseInt(fl,10)+1;
				  if(fl>=Math.pow(10,mod)){
				    base = parseInt(base,10)+1;
				    fl = fl%100;
				  }
				  big = base.toString()+"."+fl.toString();
			}
			else if(m>0 && parseInt(s,10)==0){
				  fl = v1+1;
				  if(fl>=Math.pow(10,mod)){
				    base = parseInt(base,10)+1;
				    fl = fl%100;
				  }else if(fl<10){
					var tempfl = '';
			    	for(var k=0; k<mod-1; k++){
			    		tempfl += '0'; 
			    	}
			    	fl = tempfl + fl;
				  }
				  else if(fl==10){
					var tempfl = '';
			    	for(var k=0; k<mod-2; k++){
			    		tempfl += '0'; 
			    	}
			    	fl = tempfl + fl;
				  }
				  big = base.toString()+"."+fl.toString();
			}
			else{				
				 big = base+"."+fl;
			}
		}
	}
	return big;
}
//加法  
Number.prototype.add = function(arg){  
    var r1,r2,m;  
    try{r1=this.toString().split(".")[1].length;}catch(e){r1=0;}  
    try{r2=arg.toString().split(".")[1].length;}catch(e){r2=0;}  
    m=Math.pow(10,Math.max(r1,r2));  
    return (this*m+arg*m)/m;  
};  
 
//减法  
Number.prototype.sub = function (arg){  
    return this.add(-arg);  
};  
 
//乘法  
Number.prototype.mul = function (arg)  
{  
    var m=0,s1=this.toString(),s2=arg.toString();  
    try{m+=s1.split(".")[1].length;}catch(e){}  
    try{m+=s2.split(".")[1].length;}catch(e){}  
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);  
};  
 
//除法  
Number.prototype.div = function (arg){  
    var t1=0,t2=0,r1,r2;  
    try{t1=this.toString().split(".")[1].length;}catch(e){}  
    try{t2=arg.toString().split(".")[1].length;}catch(e){}  
    with(Math){  
        r1=Number(this.toString().replace(".","")); 
        r2=Number(arg.toString().replace(".",""));  
        return (r1/r2)*pow(10,t2-t1);  
    }  
};
function min(obj){
   return Math.min.apply(Math, obj);
}
function max (obj){
  return Math.max.apply(Math, obj);
} 
