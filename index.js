'use strict';

angular.module('myApp')
.config(['$stateProvider', '$urlRouterProvider',function ($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('home.index',{
            url:'/index',
            controller:'index',
            resolve:{
                jQuery: ['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load({
                        name: "jQuery",
                        files: [__uri('/js/jquery.min.js')]
                    })
                }]
            },
            templateUrl: __uri('./index.html')
        })	
}])
.controller('index',['jQuery',function (jQuery) {

	var _birth;      

    $scope.minYear = new Date().getFullYear()-100
    
    $scope.maxYear = new Date().getFullYear()+20;
    
    $scope.birthMsg = "请选择日期";
    
    $scope.$on('_date',function(event,date){
        $scope.birthMsg = date;
        $scope.isBirError = false;
        _birth = date;
        $scope.dateChosen = !!_birth;
    })

    $scope.showChoose = function(){
        var show = true;
        $scope.$broadcast("show", show)
    }
    
}])
    