angular.module("myApp", ['ionic'])
    .controller("myController", function($scope, $ionicSlideBoxDelegate) {
      $scope.model = {
         activeIndex: "0",
      };
      /**
       * 单击分页器，跳到指定的幻灯片
       */
      $scope.toSlideIndex = function(index) {
         $scope.model.activeIndex = index;
      };
      /**
       * 第一次轻击幻灯片，停止轮播
       * 第二次轻击幻灯片，开始轮播
       * 依次循环
       */
      $scope.even = 0;
      $scope.stopOrStart = function() {
         if($scope.even == 0) {
             $ionicSlideBoxDelegate.stop();
             $scope.even=1;
         } else {
             $ionicSlideBoxDelegate.start();
             $scope.even=0;
         }
 
      }
  });