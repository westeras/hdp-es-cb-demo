'use strict';

angular.module('demo.search', ['ngRoute', 'elasticui'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/search', {
            templateUrl: 'search/search.html'
        });
    }])

    .controller('SearchCtrl', ['$scope', '$timeout', function($scope, $timeout) {

        // Function to get the data
        $scope.getData = function(){
          $scope.indexVM.refresh();
        };

        // Function to replicate setInterval using $timeout service.
        $scope.intervalFunction = function(){
          $timeout(function() {
            $scope.getData();
            $scope.intervalFunction();
          }, 10*1000);
        };

        // Kick off the interval
        $scope.intervalFunction();
    }])

    .constant('euiHost', 'http://elasticsearch.demo:9200/') // ACTION: change to cluster address
;
