'use strict';

angular.module('demo.search', ['ngRoute', 'elasticui'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/search', {
            templateUrl: 'search/search.html',
            controller: 'SearchCtrl'
        });
    }])

    .controller('SearchCtrl', [function() {

    }])

    .constant('euiHost', 'http://elasticsearch.demo:9200/') // ACTION: change to cluster address
;