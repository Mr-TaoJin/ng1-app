
//首页
index.config(['$stateProvider',function ($stateProvider) {
	$stateProvider.state('index',{
		url:"/index",
		templateUrl:"./modules/view/index.html"
	})
	
}]);

//找回密码
fgtpwd.config(['$stateProvider',function ($stateProvider) {
	
	$stateProvider.state('fgtpwd',{
		url:"/fgtpwd",
		templateUrl:"./modules/view/fgtpwd.html"
	})
	
}]);

//登录
login.config(['$stateProvider',function ($stateProvider) {

	$stateProvider.state('login',{
		url:"/login",
		templateUrl:"./modules/view/login.html"
	})

}]);

//验证码登录
codelogin.config(['$stateProvider',function ($stateProvider) {

	$stateProvider.state('codelogin',{
		url:"/codelogin",
		templateUrl:"./modules/view/codelogin.html"
	})

}]);

//个人中心
personal.config(['$stateProvider',function ($stateProvider) {
	$stateProvider.state('personal',{
		url:"/personal",
		templateUrl:"./modules/view/personal.html"
	}).state("recharge",{//充值
	   url:"/recharge",
	   templateUrl:"./modules/view/recharge.html"
	}).state("zfbrecharge",{//支付寶充值
	   url:"/zfbrecharge",
	   templateUrl:"./modules/view/zfbrecharge.html"
	}).state("wxrecharge",{//微信充值
	   url:"/wxrecharge",
	   templateUrl:"./modules/view/wxrecharge.html"
	}).state("setup",{//設置
	   url:"/setup",
	   templateUrl:"./modules/view/setup.html"
	}).state("realname",{//實名認證
	   url:"/realname",
	   templateUrl:"./modules/view/realname.html"
	}).state("uppwd",{//修改密碼
	   url:"/uppwd",
	   templateUrl:"./modules/view/uppwd.html"
	}).state("outbind",{//修改密碼
	   url:"/outbind",
	   templateUrl:"./modules/view/outbind.html"
	}).state("zfbbind",{//修改密碼
	   url:"/zfbbind",
	   templateUrl:"./modules/view/zfbbind.html"
	}).state("bankbind",{//修改密碼
	   url:"/bankbind",
	   templateUrl:"./modules/view/bankbind.html"
	}).state("cashout",{//修改密碼
	   url:"/cashout",
	   templateUrl:"./modules/view/cashout.html"
	}).state("buyrecord",{//修改密碼
	   url:"/buyrecord",
	   templateUrl:"./modules/view/buyrecord.html"
	}).state("betrecord",{//修改密碼
	   url:"/betrecord",
	   templateUrl:"./modules/view/betrecord.html"
	}).state("myplan",{//修改密碼
	   url:"/myplan",
	   templateUrl:"./modules/view/myplan.html"
	}).state("setnickname",{//修改密碼
	   url:"/setnickname",
	   templateUrl:"./modules/view/setnickname.html"
	});
}]);

//注册
reg.config(['$stateProvider',function ($stateProvider) {
	$stateProvider.state('reg',{
		url:"/reg",
		templateUrl:"./modules/view/reg.html"
	});
}]);

//邀请码
invitation.config(['$stateProvider',function ($stateProvider) {
	$stateProvider.state('invitation',{
		url:"/invitation",
		templateUrl:"./modules/view/invitation.html"
	});
}]);

//比分直播
score.config(['$stateProvider',function($stateProvider){
	$stateProvider.state("score",{
	   url:"/score",
	   templateUrl:"./modules/view/score.html"
	}).state("football",{//足球
	   url:"/football",
	   templateUrl:"./modules/view/footscore.html"
	}).state("basketball",{//足球
	   url:"/basketball",
	   templateUrl:"./modules/view/basketscore.html"
	});
}]);

//比分
betscore.config(['$stateProvider',function($stateProvider){
	$stateProvider.state("betscore",{
	   url:"/betscore",
	   templateUrl:"./modules/view/betscore.html"
	})/*.state("betorder",{
		   url:"/betorder/:match",
		   templateUrl:"./modules/view/betorder.html"
	})*/;
}]);



//竞彩足球
orderJczq.config(['$stateProvider',function($stateProvider){
	/*$stateProvider.state("order-jczq",{
	   url:"/order-jczq",
	   templateUrl:"./modules/view/order-jczq.html"
	})*/
	$stateProvider.state("order-had",{
		   url:"/order-had",
		   templateUrl:"./modules/view/order-jczq.html"
		}).state("order-ttg",{
		   url:"/order-ttg",
		   templateUrl:"./modules/view/order-jczq.html"
		}).state("order-crs",{
		   url:"/order-crs",
		   templateUrl:"./modules/view/order-jczq.html"
		}).state("order-hafu",{
		   url:"/order-hafu",
		   templateUrl:"./modules/view/order-jczq.html"
		}).state("order-ht",{
		   url:"/order-ht",
		   templateUrl:"./modules/view/order-jczq.html"
		});
}]);

//竞彩篮球
orderJclq.config(['$stateProvider',function($stateProvider){
	$stateProvider.state("order-mnl",{
	   url:"/order-mnl",
	   templateUrl:"./modules/view/order-jclq.html"
	}).state("order-hdc",{
	   url:"/order-hdc",
	   templateUrl:"./modules/view/order-jclq.html"
	}).state("order-wnm",{
	   url:"/order-wnm",
	   templateUrl:"./modules/view/order-jclq.html"
	}).state("order-hilo",{
	   url:"/order-hilo",
	   templateUrl:"./modules/view/order-jclq.html"
	}).state("order-hhgg",{
	   url:"/order-hhgg",
	   templateUrl:"./modules/view/order-jclq.html"
	})
}]);

plan.config(['$stateProvider',function($stateProvider){
	$stateProvider.state("plan",{
		   url:"/plan",
		   templateUrl:"./modules/view/plan.html"
		})
	}]);

shopping.config(['$stateProvider',function($stateProvider){
	$stateProvider.state("shopping",{
		url:"/shopping",
		templateUrl:"./modules/view/shopping/shopping.html"
	}).state('recommending',{
		url:'/recommending',
		templateUrl:"./modules/view/shopping/recommending.html"
	}).state('recommendend',{
		url:'/recommendend',
		templateUrl:"./modules/view/shopping/recommendend.html"
	}).state('activitying',{
		url:'/activitying',
		templateUrl:"./modules/view/shopping/activitying.html"
	}).state('activityend',{
		url:'/activityend',
		templateUrl:"./modules/view/shopping/activityend.html"
	}).state('details',{
		url:'/details',
		templateUrl:"./modules/view/shopping/details.html"
	})
}]);

personalCenter.config(['$stateProvider',function($stateProvider){
	$stateProvider.state('personal-center',{
		url:"/personal-center",
		templateUrl:"./modules/view/personal/personal-center.html"
	}).state('setdata',{
		url:'/setdata',
		templateUrl:"./modules/view/personal/setdata.html"
	}).state('setname',{
		url:'/setname',
		templateUrl:"./modules/view/personal/setname.html"
	}).state('settel',{
		url:'/settel',
		templateUrl:"./modules/view/personal/settel.html"
	}).state('recording',{
		url:'/recording',
		templateUrl:"./modules/view/personal/recording.html"
	}).state('recordend',{
		url:'/recordend',
		templateUrl:"./modules/view/personal/recordend.html"
	})
}])

goldManagement.config(['$stateProvider',function($stateProvider){
	$stateProvider.state('goldManagement',{
		url:"/goldManagement",
		templateUrl:"./modules/view/management/goldManagement.html"
	}).state('topup',{
		url:'/topup',
		templateUrl:"./modules/view/management/topup.html"
	}).state('withdrawal',{
		url:'/withdrawal',
		templateUrl:"./modules/view/management/withdrawal.html"
	}).state('my-envelope',{
		url:'/my-envelope',
		templateUrl:"./modules/view/management/my-envelope.html"
	})
}])