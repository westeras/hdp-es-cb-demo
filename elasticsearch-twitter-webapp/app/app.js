/*jshint globalstrict:true */
/*global angular:true */
'use strict';

angular.module('demo', ['ngRoute', 'demo.search'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/search'});
    }]);
