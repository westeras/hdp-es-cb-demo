"use strict";

angular.module('wfhm.directives', [])
    .directive('suggest', function($http) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind("keydown", function(event) {

                    if (event.keyCode === $.ui.keyCode.ENTER) {
                        event.preventDefault();

                        var textValue = this.value;

                        scope.$apply(function(self) {
                            scope.query = textValue;
                            scope.search();
                        });
                        //this.value = "";
                        element.autocomplete('close');
                    }

                }).autocomplete({
                    source: function(request, response) {
                        $http.get(attrs.suggest + request.term + '?n=15')

                            .success(function(data) {
                                var items = data.suggest.wfhm[request.term].suggestions
                                var resp = [];

                                for (var i = 0, len = items.length; i < len; i++) {
                                    resp.push(items[i].term);
                                }
                                response(resp);
                            });
                    },
                    select: function(event, ui) {
                        scope.$apply(function(self) {
                            self['query'] = ui.item.value;
                            scope.search();
                        });
                        //this.value = "";
                        return false;
                    }
                });
            }
        }
    });
