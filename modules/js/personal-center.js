/**
 * Created by Administrator on 2018/1/9.
 */
var personalCenter=angular.module('personalCenter',['ui.router']);

personalCenter.controller("personalCenterCtrl",['$scope',function($scope){

}])
.controller("setdataCtrl",['$scope','$ionicActionSheet',function($scope,$ionicActionSheet){
    //上拉菜单
    $scope.showUp = function(){
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: '相机' },
                { text: '相册' }
            ],
            //destructiveText: 'Delete',
            //titleText: 'Modify your album',
            cancelText: '取消',
            cancel: function() {
                // add cancel code..
            },
            buttonClicked: function(index) {
                console.log(index)
                return true;
            }
        });
    }
}])
.controller('setnameCtrl',['$scope',function(){

}])
.controller('settelCtrl',['$scope',function(){

}])
.controller('recordingCtrl',['$scope',function(){

}])
.controller('recordendCtrl',['$scope',function(){

}])