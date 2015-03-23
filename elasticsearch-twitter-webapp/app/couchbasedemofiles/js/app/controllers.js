'use strict'

angular.module('wfhm.controller', [])
    .controller('SearchControllerA21', function ($scope, $modal, solr) {

        var SolrQuery = solr.Query();
        var resultPager = solr.ResultPager(SolrQuery, 0);
        var pageMin = 5;
        var pageMax = 7;
        var dateRange = {
            "Last 2 Years": "[NOW/DAY-24MONTHS TO NOW/DAY]",
            "Last 3 Years": "[NOW/DAY-36MONTHS TO NOW/DAY]"
        };
        var priorityRange = {
            "100 - 1000": "[100 TO 1000]",
            "1000 - 5000": "[1000 TO 5000]",
            "Above 5000": "[5000 TO *]"
        };

        $scope.query = "";
        $scope.freshness = "UNDEFINED";
        $scope.searchField = "UNDEFINED";
        $scope.priority = "UNDEFINED";


        //$scope.details = function(doc) {
        //    var modalInstance = $modal.open({
        //        templateUrl: '/assets/templates/details.html',
        //        controller: ModalInstanceCtrl,
        //        resolve: {
        //            doc: function () {
        //                return doc;
        //            }
        //        }
        //    });
        //};

        $scope.details = function (doc) {
            var modalInstance = $modal.open({
                templateUrl: '/assets/templates/a21Details.html',
                controller: ModalInstanceCtrl,
                resolve: {
                    doc: function () {
                        return doc;
                    }
                }
            });
        };

        var ModalInstanceCtrl = function ($scope, $modalInstance, doc) {
            $scope.doc = doc;
        };

        var postProcess = function (results) {
            resultPager = solr.ResultPager(SolrQuery, results.SEARCHRESPONSE.TOTALCOUNT);
            //resultPager = solr.ResultPager(SolrQuery, results.response.numFound);
        };

        $scope.isApplied = function (fieldName, filterValue) {
            return SolrQuery.hasFilter(fieldName + ":" + filterValue);
        };

        $scope.updateFreshness_effective_from_date = function () {
            //$scope.freshness = range;

            if ($scope.freshness === "UNDEFINED") {
                SolrQuery.removeFilter('freshness:');
            } else {
                SolrQuery.addFilter('freshness:', "effective_from_date:(" + dateRange[$scope.freshness] + ")");
            }
            $scope.search();
        }

        $scope.updatePriority = function () {
            //$scope.freshness = range;

            if ($scope.priority === "UNDEFINED") {
                SolrQuery.removeFilter('priority:');
            } else {
                SolrQuery.addFilter('priority:', "priority:(" + priorityRange[$scope.priority] + ")");
            }
            $scope.search();
        }

        $scope.filterSearch = function (fieldName, filterValue) {

            if (fieldName === 'Freshness') {
                $scope.freshness = 'UNDEFINED';
                $scope.updateFreshness_effective_from_date();
            } else {
                fieldName = fieldName.toLowerCase();

                var filterKey = fieldName + ":" + filterValue;
                var filterMod = fieldName + ':"' + filterValue + '"';

                if ($scope.isApplied(fieldName, filterValue)) {
                    SolrQuery.removeFilter(filterKey);
                } else {
                    SolrQuery.addFilter(filterKey, filterMod);
                }
                $scope.search();
            }
        };


        $scope.search = function (pageNum) {
            SolrQuery.start(pageNum || 0);
            SolrQuery.rows(10);

            var queryString = $scope.query || "*";

            if ($scope.searchField !== 'UNDEFINED') {
                queryString = $scope.searchField + ':(' + queryString + ')';
            }

            SolrQuery.query(queryString);

            //console.log(SolrQuery.serialize());

            //$scope.results = solr.http.get({}, SolrQuery.serialize(), postProcess);
            $scope.results = solr.Resource('/search/A21').get({}, SolrQuery.serialize(), postProcess);
        };

        $scope.pager = {

            pageChange: function (pageNum) {
                $scope.search(resultPager.get(pageNum));
            },

            next: function () {
                this.pageChange(resultPager.next());
            },

            prev: function () {
                this.pageChange(resultPager.previous());
            },

            pageClass: function (page) {
                return page === resultPager.current() ? "active" : "";
            },

            prevClass: function () {
                return resultPager.current() > 1 ? "" : "disabled";
            },

            nextClass: function () {
                return resultPager.current() < resultPager.total() ? "" : "disabled";
            },

            pages: function () {
                return resultPager.pages(pageMin, pageMax);
            }
        };

        $scope.search();

        //Reactive Search
        //$scope.$watch('query', $scope.search);

    }).controller('SearchControllerA22', function ($scope, $modal, solr) {

        var SolrQuery = solr.Query();
        var resultPager = solr.ResultPager(SolrQuery, 0);
        var pageMin = 5;
        var pageMax = 7;
        var dateRange = {
            "Last 2 Years": "[NOW/DAY-24MONTHS TO NOW/DAY]",
            "Last 3 Years": "[NOW/DAY-36MONTHS TO NOW/DAY]"
        };
        var priorityRange = {
            "100 - 1000": "[100 TO 1000]",
            "1000 - 5000": "[1000 TO 5000]",
            "Above 5000": "[5000 TO *]"
        };

        $scope.query = "";
        $scope.freshness = "UNDEFINED";
        $scope.searchField = "UNDEFINED";
        $scope.priority = "UNDEFINED";
        $scope.freshness_created_on = "UNDEFINED";
        $scope.freshness_modified_on = "UNDEFINED";

        $scope.details = function (doc) {
            var modalInstance = $modal.open({
                templateUrl: '/assets/templates/a22Details.html',
                controller: ModalInstanceCtrl,
                resolve: {
                    doc: function () {
                        return doc;
                    }
                }
            });
        };

        var ModalInstanceCtrl = function ($scope, $modalInstance, doc) {
            $scope.doc = doc;
        };

        var postProcess = function (results) {
            resultPager = solr.ResultPager(SolrQuery, results.SEARCHRESPONSE.TOTALCOUNT);
            //resultPager = solr.ResultPager(SolrQuery, results.response.numFound);
        };

        $scope.isApplied = function (fieldName, filterValue) {
            return SolrQuery.hasFilter(fieldName + ":" + filterValue);
        };

        $scope.updateFreshness_effective_from_date = function () {
            //$scope.freshness = range;

            if ($scope.freshness === "UNDEFINED") {
                SolrQuery.removeFilter('freshness:');
            } else {
                SolrQuery.addFilter('freshness:', "effective_from_date:(" + dateRange[$scope.freshness] + ")");
            }
            $scope.search();
        }

        $scope.updateFreshness_modified_on = function () {
            //$scope.freshness = range;

            if ($scope.freshness_modified_on === "UNDEFINED") {
                SolrQuery.removeFilter('freshness_modified_on:');
            } else {
                SolrQuery.addFilter('freshness_modified_on:', "modified_on:(" + dateRange[$scope.freshness_modified_on] + ")");
            }
            $scope.search();
        }

        $scope.updateFreshness_created_on = function () {
            //$scope.freshness = range;

            if ($scope.freshness_created_on === "UNDEFINED") {
                SolrQuery.removeFilter('freshness_created_on:');
            } else {
                SolrQuery.addFilter('freshness_created_on:', "created_on:(" + dateRange[$scope.freshness_created_on] + ")");
            }
            $scope.search();
        }

        $scope.updatePriority = function () {
            //$scope.freshness = range;

            if ($scope.priority === "UNDEFINED") {
                SolrQuery.removeFilter('priority:');
            } else {
                SolrQuery.addFilter('priority:', "priority:(" + priorityRange[$scope.priority] + ")");
            }
            $scope.search();
        }

        $scope.filterSearch = function (fieldName, filterValue) {

            if (fieldName === 'Freshness') {
                $scope.freshness = 'UNDEFINED';
                $scope.updateFreshness_effective_from_date();
            } else if (fieldName === 'Freshness_modified_on') {
                $scope.freshness_modified_on = 'UNDEFINED';
                $scope.updateFreshness_modified_on();
            } else if (fieldName === 'Freshness_created_on') {
                $scope.freshness_created_on = 'UNDEFINED';
                $scope.updateFreshness_created_on();
            } else {
                fieldName = fieldName.toLowerCase();

                var filterKey = fieldName + ":" + filterValue;
                var filterMod = fieldName + ':"' + filterValue + '"';

                if ($scope.isApplied(fieldName, filterValue)) {
                    SolrQuery.removeFilter(filterKey);
                } else {
                    SolrQuery.addFilter(filterKey, filterMod);
                }
                $scope.search();
            }
        };


        $scope.search = function (pageNum) {
            SolrQuery.start(pageNum || 0);
            SolrQuery.rows(10);

            var queryString = $scope.query || "*";

            if ($scope.searchField !== 'UNDEFINED') {
                queryString = $scope.searchField + ':(' + queryString + ')';
            }

            SolrQuery.query(queryString);

            //console.log(SolrQuery.serialize());

            //$scope.results = solr.http.get({}, SolrQuery.serialize(), postProcess);
            $scope.results = solr.Resource('/search/A22').get({}, SolrQuery.serialize(), postProcess);
        };

        $scope.pager = {

            pageChange: function (pageNum) {
                $scope.search(resultPager.get(pageNum));
            },

            next: function () {
                this.pageChange(resultPager.next());
            },

            prev: function () {
                this.pageChange(resultPager.previous());
            },

            pageClass: function (page) {
                return page === resultPager.current() ? "active" : "";
            },

            prevClass: function () {
                return resultPager.current() > 1 ? "" : "disabled";
            },

            nextClass: function () {
                return resultPager.current() < resultPager.total() ? "" : "disabled";
            },

            pages: function () {
                return resultPager.pages(pageMin, pageMax);
            }
        };

        $scope.search();

        //Reactive Search
        //$scope.$watch('query', $scope.search);

    }).controller('SearchControllerA24', function ($scope, $modal, solr) {

        var SolrQuery = solr.Query();
        var resultPager = solr.ResultPager(SolrQuery, 0);
        var pageMin = 5;
        var pageMax = 7;
        var dateRange = {
            "Last 2 Years": "[NOW/DAY-24MONTHS TO NOW/DAY]",
            "Last 3 Years": "[NOW/DAY-36MONTHS TO NOW/DAY]"
        };
        var priorityRange = {
            "100 - 1000": "[100 TO 1000]",
            "1000 - 5000": "[1000 TO 5000]",
            "Above 5000": "[5000 TO *]"
        };

        $scope.query = "";
        $scope.freshness = "UNDEFINED";
        $scope.searchField = "UNDEFINED";
        $scope.priority = "UNDEFINED";
        $scope.freshness_created_on = "UNDEFINED";
        $scope.freshness_modified_on = "UNDEFINED";

        $scope.details = function (doc) {
            var modalInstance = $modal.open({
                templateUrl: '/assets/templates/a24Details.html',
                controller: ModalInstanceCtrl,
                resolve: {
                    doc: function () {
                        return doc;
                    }
                }
            });
        };

        var ModalInstanceCtrl = function ($scope, $modalInstance, doc) {
            $scope.doc = doc;
        };

        var postProcess = function (results) {
            resultPager = solr.ResultPager(SolrQuery, results.SEARCHRESPONSE.TOTALCOUNT);
            //resultPager = solr.ResultPager(SolrQuery, results.response.numFound);
        };

        $scope.isApplied = function (fieldName, filterValue) {
            return SolrQuery.hasFilter(fieldName + ":" + filterValue);
        };

        $scope.updateFreshness_effective_from_date = function () {
            //$scope.freshness = range;

            if ($scope.freshness === "UNDEFINED") {
                SolrQuery.removeFilter('freshness:');
            } else {
                SolrQuery.addFilter('freshness:', "effective_from_date:(" + dateRange[$scope.freshness] + ")");
            }
            $scope.search();
        }

        $scope.updateFreshness_modified_on = function () {
            //$scope.freshness = range;

            if ($scope.freshness_modified_on === "UNDEFINED") {
                SolrQuery.removeFilter('freshness_modified_on:');
            } else {
                SolrQuery.addFilter('freshness_modified_on:', "modified_on:(" + dateRange[$scope.freshness_modified_on] + ")");
            }
            $scope.search();
        }

        $scope.updateFreshness_created_on = function () {
            //$scope.freshness = range;

            if ($scope.freshness_created_on === "UNDEFINED") {
                SolrQuery.removeFilter('freshness_created_on:');
            } else {
                SolrQuery.addFilter('freshness_created_on:', "created_on:(" + dateRange[$scope.freshness_created_on] + ")");
            }
            $scope.search();
        }

        $scope.updatePriority = function () {
            //$scope.freshness = range;

            if ($scope.priority === "UNDEFINED") {
                SolrQuery.removeFilter('priority:');
            } else {
                SolrQuery.addFilter('priority:', "priority:(" + priorityRange[$scope.priority] + ")");
            }
            $scope.search();
        }

        $scope.filterSearch = function (fieldName, filterValue) {

            if (fieldName === 'Freshness') {
                $scope.freshness = 'UNDEFINED';
                $scope.updateFreshness_effective_from_date();
            } else if (fieldName === 'Freshness_modified_on') {
                $scope.freshness_modified_on = 'UNDEFINED';
                $scope.updateFreshness_modified_on();
            } else if (fieldName === 'Freshness_created_on') {
                $scope.freshness_created_on = 'UNDEFINED';
                $scope.updateFreshness_created_on();
            } else {
                fieldName = fieldName.toLowerCase();

                var filterKey = fieldName + ":" + filterValue;
                var filterMod = fieldName + ':"' + filterValue + '"';

                if ($scope.isApplied(fieldName, filterValue)) {
                    SolrQuery.removeFilter(filterKey);
                } else {
                    SolrQuery.addFilter(filterKey, filterMod);
                }
                $scope.search();
            }
        };


        $scope.search = function (pageNum) {
            SolrQuery.start(pageNum || 0);
            SolrQuery.rows(10);

            var queryString = $scope.query || "*";

            if ($scope.searchField !== 'UNDEFINED') {
                queryString = $scope.searchField + ':(' + queryString + ')';
            }

            SolrQuery.query(queryString);

            //console.log(SolrQuery.serialize());

            //$scope.results = solr.http.get({}, SolrQuery.serialize(), postProcess);
            $scope.results = solr.Resource('/search/A24').get({}, SolrQuery.serialize(), postProcess);
        };

        $scope.pager = {

            pageChange: function (pageNum) {
                $scope.search(resultPager.get(pageNum));
            },

            next: function () {
                this.pageChange(resultPager.next());
            },

            prev: function () {
                this.pageChange(resultPager.previous());
            },

            pageClass: function (page) {
                return page === resultPager.current() ? "active" : "";
            },

            prevClass: function () {
                return resultPager.current() > 1 ? "" : "disabled";
            },

            nextClass: function () {
                return resultPager.current() < resultPager.total() ? "" : "disabled";
            },

            pages: function () {
                return resultPager.pages(pageMin, pageMax);
            }
        };

        $scope.search();

        //Reactive Search
        //$scope.$watch('query', $scope.search);

    }).controller('SearchControllerA27', function ($scope, $modal, solr) {

        var SolrQuery = solr.Query();
        var resultPager = solr.ResultPager(SolrQuery, 0);
        var pageMin = 5;
        var pageMax = 7;
        var dateRange = {
            "Last 2 Years": "[NOW/DAY-24MONTHS TO NOW/DAY]",
            "Last 3 Years": "[NOW/DAY-36MONTHS TO NOW/DAY]"
        };
        var priorityRange = {
            "100 - 1000": "[100 TO 1000]",
            "1000 - 5000": "[1000 TO 5000]",
            "Above 5000": "[5000 TO *]"
        };

        $scope.query = "";
        $scope.freshness = "UNDEFINED";
        $scope.searchField = "UNDEFINED";
        $scope.priority = "UNDEFINED";
        $scope.freshness_created_on = "UNDEFINED";
        $scope.freshness_modified_on = "UNDEFINED";

        $scope.details = function (doc) {
            var modalInstance = $modal.open({
                templateUrl: '/assets/templates/a27Details.html',
                controller: ModalInstanceCtrl,
                resolve: {
                    doc: function () {
                        return doc;
                    }
                }
            });
        };

        var ModalInstanceCtrl = function ($scope, $modalInstance, doc) {
            $scope.doc = doc;
        };

        var postProcess = function (results) {
            resultPager = solr.ResultPager(SolrQuery, results.SEARCHRESPONSE.TOTALCOUNT);
            //resultPager = solr.ResultPager(SolrQuery, results.response.numFound);
        };

        $scope.isApplied = function (fieldName, filterValue) {
            return SolrQuery.hasFilter(fieldName + ":" + filterValue);
        };

        $scope.updateFreshness_effective_from_date = function () {
            //$scope.freshness = range;

            if ($scope.freshness === "UNDEFINED") {
                SolrQuery.removeFilter('freshness:');
            } else {
                SolrQuery.addFilter('freshness:', "effective_from_date:(" + dateRange[$scope.freshness] + ")");
            }
            $scope.search();
        }

        $scope.updateFreshness_modified_on = function () {
            //$scope.freshness = range;

            if ($scope.freshness_modified_on === "UNDEFINED") {
                SolrQuery.removeFilter('freshness_modified_on:');
            } else {
                SolrQuery.addFilter('freshness_modified_on:', "modified_on:(" + dateRange[$scope.freshness_modified_on] + ")");
            }
            $scope.search();
        }

        $scope.updateFreshness_created_on = function () {
            //$scope.freshness = range;

            if ($scope.freshness_created_on === "UNDEFINED") {
                SolrQuery.removeFilter('freshness_created_on:');
            } else {
                SolrQuery.addFilter('freshness_created_on:', "created_on:(" + dateRange[$scope.freshness_created_on] + ")");
            }
            $scope.search();
        }

        $scope.updatePriority = function () {
            //$scope.freshness = range;

            if ($scope.priority === "UNDEFINED") {
                SolrQuery.removeFilter('priority:');
            } else {
                SolrQuery.addFilter('priority:', "priority:(" + priorityRange[$scope.priority] + ")");
            }
            $scope.search();
        }

        $scope.filterSearch = function (fieldName, filterValue) {

            if (fieldName === 'Freshness') {
                $scope.freshness = 'UNDEFINED';
                $scope.updateFreshness_effective_from_date();
            } else if (fieldName === 'Freshness_modified_on') {
                $scope.freshness_modified_on = 'UNDEFINED';
                $scope.updateFreshness_modified_on();
            } else if (fieldName === 'Freshness_created_on') {
                $scope.freshness_created_on = 'UNDEFINED';
                $scope.updateFreshness_created_on();
            } else {
                fieldName = fieldName.toLowerCase();

                var filterKey = fieldName + ":" + filterValue;
                var filterMod = fieldName + ':"' + filterValue + '"';

                if ($scope.isApplied(fieldName, filterValue)) {
                    SolrQuery.removeFilter(filterKey);
                } else {
                    SolrQuery.addFilter(filterKey, filterMod);
                }
                $scope.search();
            }
        };


        $scope.search = function (pageNum) {
            SolrQuery.start(pageNum || 0);
            SolrQuery.rows(10);

            var queryString = $scope.query || "*";

            if ($scope.searchField !== 'UNDEFINED') {
                queryString = $scope.searchField + ':(' + queryString + ')';
            }

            SolrQuery.query(queryString);

            //console.log(SolrQuery.serialize());

            //$scope.results = solr.http.get({}, SolrQuery.serialize(), postProcess);
            $scope.results = solr.Resource('/search/A27').get({}, SolrQuery.serialize(), postProcess);
        };

        $scope.pager = {

            pageChange: function (pageNum) {
                $scope.search(resultPager.get(pageNum));
            },

            next: function () {
                this.pageChange(resultPager.next());
            },

            prev: function () {
                this.pageChange(resultPager.previous());
            },

            pageClass: function (page) {
                return page === resultPager.current() ? "active" : "";
            },

            prevClass: function () {
                return resultPager.current() > 1 ? "" : "disabled";
            },

            nextClass: function () {
                return resultPager.current() < resultPager.total() ? "" : "disabled";
            },

            pages: function () {
                return resultPager.pages(pageMin, pageMax);
            }
        };

        $scope.search();

        //Reactive Search
        //$scope.$watch('query', $scope.search);

    }).controller('SearchControllerA28', function ($scope, $modal, solr) {

        var SolrQuery = solr.Query();
        var resultPager = solr.ResultPager(SolrQuery, 0);
        var pageMin = 5;
        var pageMax = 7;
        var dateRange = {
            "Last 2 Years": "[NOW/DAY-24MONTHS TO NOW/DAY]",
            "Last 3 Years": "[NOW/DAY-36MONTHS TO NOW/DAY]"
        };
        var priorityRange = {
            "100 - 1000": "[100 TO 1000]",
            "1000 - 5000": "[1000 TO 5000]",
            "Above 5000": "[5000 TO *]"
        };

        $scope.query = "";
        $scope.freshness = "UNDEFINED";
        $scope.searchField = "UNDEFINED";
        $scope.priority = "UNDEFINED";
        $scope.freshness_created_on = "UNDEFINED";
        $scope.freshness_modified_on = "UNDEFINED";

        $scope.details = function (doc) {
            var modalInstance = $modal.open({
                templateUrl: '/assets/templates/a28Details.html',
                controller: ModalInstanceCtrl,
                resolve: {
                    doc: function () {
                        return doc;
                    }
                }
            });
        };

        var ModalInstanceCtrl = function ($scope, $modalInstance, doc) {
            $scope.doc = doc;
        };

        var postProcess = function (results) {
            resultPager = solr.ResultPager(SolrQuery, results.SEARCHRESPONSE.TOTALCOUNT);
            //resultPager = solr.ResultPager(SolrQuery, results.response.numFound);
        };

        $scope.isApplied = function (fieldName, filterValue) {
            return SolrQuery.hasFilter(fieldName + ":" + filterValue);
        };

        $scope.updateFreshness_effective_from_date = function () {
            //$scope.freshness = range;

            if ($scope.freshness === "UNDEFINED") {
                SolrQuery.removeFilter('freshness:');
            } else {
                SolrQuery.addFilter('freshness:', "effective_from_date:(" + dateRange[$scope.freshness] + ")");
            }
            $scope.search();
        }

        $scope.updateFreshness_modified_on = function () {
            //$scope.freshness = range;

            if ($scope.freshness_modified_on === "UNDEFINED") {
                SolrQuery.removeFilter('freshness_modified_on:');
            } else {
                SolrQuery.addFilter('freshness_modified_on:', "modified_on:(" + dateRange[$scope.freshness_modified_on] + ")");
            }
            $scope.search();
        }

        $scope.updateFreshness_created_on = function () {
            //$scope.freshness = range;

            if ($scope.freshness_created_on === "UNDEFINED") {
                SolrQuery.removeFilter('freshness_created_on:');
            } else {
                SolrQuery.addFilter('freshness_created_on:', "created_on:(" + dateRange[$scope.freshness_created_on] + ")");
            }
            $scope.search();
        }

        $scope.updatePriority = function () {
            //$scope.freshness = range;

            if ($scope.priority === "UNDEFINED") {
                SolrQuery.removeFilter('priority:');
            } else {
                SolrQuery.addFilter('priority:', "priority:(" + priorityRange[$scope.priority] + ")");
            }
            $scope.search();
        }

        $scope.filterSearch = function (fieldName, filterValue) {

            if (fieldName === 'Freshness') {
                $scope.freshness = 'UNDEFINED';
                $scope.updateFreshness_effective_from_date();
            } else if (fieldName === 'Freshness_modified_on') {
                $scope.freshness_modified_on = 'UNDEFINED';
                $scope.updateFreshness_modified_on();
            } else if (fieldName === 'Freshness_created_on') {
                $scope.freshness_created_on = 'UNDEFINED';
                $scope.updateFreshness_created_on();
            } else {
                fieldName = fieldName.toLowerCase();

                var filterKey = fieldName + ":" + filterValue;
                var filterMod = fieldName + ':"' + filterValue + '"';

                if ($scope.isApplied(fieldName, filterValue)) {
                    SolrQuery.removeFilter(filterKey);
                } else {
                    SolrQuery.addFilter(filterKey, filterMod);
                }
                $scope.search();
            }
        };


        $scope.search = function (pageNum) {
            SolrQuery.start(pageNum || 0);
            SolrQuery.rows(10);

            var queryString = $scope.query || "*";

            if ($scope.searchField !== 'UNDEFINED') {
                queryString = $scope.searchField + ':(' + queryString + ')';
            }

            SolrQuery.query(queryString);

            //console.log(SolrQuery.serialize());

            //$scope.results = solr.http.get({}, SolrQuery.serialize(), postProcess);
            $scope.results = solr.Resource('/search/A28').get({}, SolrQuery.serialize(), postProcess);
        };

        $scope.pager = {

            pageChange: function (pageNum) {
                $scope.search(resultPager.get(pageNum));
            },

            next: function () {
                this.pageChange(resultPager.next());
            },

            prev: function () {
                this.pageChange(resultPager.previous());
            },

            pageClass: function (page) {
                return page === resultPager.current() ? "active" : "";
            },

            prevClass: function () {
                return resultPager.current() > 1 ? "" : "disabled";
            },

            nextClass: function () {
                return resultPager.current() < resultPager.total() ? "" : "disabled";
            },

            pages: function () {
                return resultPager.pages(pageMin, pageMax);
            }
        };

        $scope.search();

        //Reactive Search
        //$scope.$watch('query', $scope.search);

    }).controller('SearchControllerA210', function ($scope, $modal, solr) {

        var SolrQuery = solr.Query();
        var resultPager = solr.ResultPager(SolrQuery, 0);
        var pageMin = 5;
        var pageMax = 7;
        var dateRange = {
            "Last 2 Years": "[NOW/DAY-24MONTHS TO NOW/DAY]",
            "Last 3 Years": "[NOW/DAY-36MONTHS TO NOW/DAY]"
        };
        var priorityRange = {
            "100 - 1000": "[100 TO 1000]",
            "1000 - 5000": "[1000 TO 5000]",
            "Above 5000": "[5000 TO *]"
        };

        $scope.query = "";
        $scope.freshness = "UNDEFINED";
        $scope.searchField = "UNDEFINED";
        $scope.priority = "UNDEFINED";
        $scope.freshness_created_on = "UNDEFINED";
        $scope.freshness_modified_on = "UNDEFINED";

        $scope.details = function (doc) {
            var modalInstance = $modal.open({
                templateUrl: '/assets/templates/a210Details.html',
                controller: ModalInstanceCtrl,
                resolve: {
                    doc: function () {
                        return doc;
                    }
                }
            });
        };

        var ModalInstanceCtrl = function ($scope, $modalInstance, doc) {
            $scope.doc = doc;
        };

        var postProcess = function (results) {
            resultPager = solr.ResultPager(SolrQuery, results.SEARCHRESPONSE.TOTALCOUNT);
            //resultPager = solr.ResultPager(SolrQuery, results.response.numFound);
        };

        $scope.isApplied = function (fieldName, filterValue) {
            return SolrQuery.hasFilter(fieldName + ":" + filterValue);
        };

        $scope.updateFreshness_effective_from_date = function () {
            //$scope.freshness = range;

            if ($scope.freshness === "UNDEFINED") {
                SolrQuery.removeFilter('freshness:');
            } else {
                SolrQuery.addFilter('freshness:', "effective_from_date:(" + dateRange[$scope.freshness] + ")");
            }
            $scope.search();
        }

        $scope.updateFreshness_modified_on = function () {
            //$scope.freshness = range;

            if ($scope.freshness_modified_on === "UNDEFINED") {
                SolrQuery.removeFilter('freshness_modified_on:');
            } else {
                SolrQuery.addFilter('freshness_modified_on:', "modified_on:(" + dateRange[$scope.freshness_modified_on] + ")");
            }
            $scope.search();
        }

        $scope.updateFreshness_created_on = function () {
            //$scope.freshness = range;

            if ($scope.freshness_created_on === "UNDEFINED") {
                SolrQuery.removeFilter('freshness_created_on:');
            } else {
                SolrQuery.addFilter('freshness_created_on:', "created_on:(" + dateRange[$scope.freshness_created_on] + ")");
            }
            $scope.search();
        }

        $scope.updatePriority = function () {
            //$scope.freshness = range;

            if ($scope.priority === "UNDEFINED") {
                SolrQuery.removeFilter('priority:');
            } else {
                SolrQuery.addFilter('priority:', "priority:(" + priorityRange[$scope.priority] + ")");
            }
            $scope.search();
        }

        $scope.filterSearch = function (fieldName, filterValue) {

            if (fieldName === 'Freshness') {
                $scope.freshness = 'UNDEFINED';
                $scope.updateFreshness_effective_from_date();
            } else if (fieldName === 'Freshness_modified_on') {
                $scope.freshness_modified_on = 'UNDEFINED';
                $scope.updateFreshness_modified_on();
            } else if (fieldName === 'Freshness_created_on') {
                $scope.freshness_created_on = 'UNDEFINED';
                $scope.updateFreshness_created_on();
            } else {
                fieldName = fieldName.toLowerCase();

                var filterKey = fieldName + ":" + filterValue;
                var filterMod = fieldName + ':"' + filterValue + '"';

                if ($scope.isApplied(fieldName, filterValue)) {
                    SolrQuery.removeFilter(filterKey);
                } else {
                    SolrQuery.addFilter(filterKey, filterMod);
                }
                $scope.search();
            }
        };


        $scope.search = function (pageNum) {
            SolrQuery.start(pageNum || 0);
            SolrQuery.rows(10);

            var queryString = $scope.query || "*";

            if ($scope.searchField !== 'UNDEFINED') {
                queryString = $scope.searchField + ':(' + queryString + ')';
            }

            SolrQuery.query(queryString);

            //console.log(SolrQuery.serialize());

            //$scope.results = solr.http.get({}, SolrQuery.serialize(), postProcess);
            $scope.results = solr.Resource('/search/A210').get({}, SolrQuery.serialize(), postProcess);
        };

        $scope.pager = {

            pageChange: function (pageNum) {
                $scope.search(resultPager.get(pageNum));
            },

            next: function () {
                this.pageChange(resultPager.next());
            },

            prev: function () {
                this.pageChange(resultPager.previous());
            },

            pageClass: function (page) {
                return page === resultPager.current() ? "active" : "";
            },

            prevClass: function () {
                return resultPager.current() > 1 ? "" : "disabled";
            },

            nextClass: function () {
                return resultPager.current() < resultPager.total() ? "" : "disabled";
            },

            pages: function () {
                return resultPager.pages(pageMin, pageMax);
            }
        };

        $scope.search();

        //Reactive Search
        //$scope.$watch('query', $scope.search);

    }).controller('SearchControllerAllAdvanced', function ($scope, $modal, solr) {

        var SolrQuery = solr.Query();
        var resultPager = solr.ResultPager(SolrQuery, 0);
        var pageMin = 5;
        var pageMax = 7;
        var dateRange = {
            "Last 2 Years": "[NOW/DAY-24MONTHS TO NOW/DAY]",
            "Last 3 Years": "[NOW/DAY-36MONTHS TO NOW/DAY]"
        };
        var priorityRange = {
            "100 - 1000": "[100 TO 1000]",
            "1000 - 5000": "[1000 TO 5000]",
            "Above 5000": "[5000 TO *]"
        };

        $scope.query = "";
        $scope.freshness = "UNDEFINED";
        $scope.searchField = "UNDEFINED";
        $scope.priority = "UNDEFINED";
        $scope.navigator = "accouncements";

        $scope.detailsA21 = function (doc) {
            var modalInstance = $modal.open({
                templateUrl: '/assets/templates/a21Details.html',
                controller: ModalInstanceCtrl,
                resolve: {
                    doc: function () {
                        return doc;
                    }
                }
            });
        };

        $scope.detailsA22 = function (doc) {
            var modalInstance = $modal.open({
                templateUrl: '/assets/templates/a22Details.html',
                controller: ModalInstanceCtrl,
                resolve: {
                    doc: function () {
                        return doc;
                    }
                }
            });
        };

        $scope.detailsA24 = function (doc) {
            var modalInstance = $modal.open({
                templateUrl: '/assets/templates/a24Details.html',
                controller: ModalInstanceCtrl,
                resolve: {
                    doc: function () {
                        return doc;
                    }
                }
            });
        };

        $scope.detailsA28 = function (doc) {
            var modalInstance = $modal.open({
                templateUrl: '/assets/templates/a28Details.html',
                controller: ModalInstanceCtrl,
                resolve: {
                    doc: function () {
                        return doc;
                    }
                }
            });
        };

        var ModalInstanceCtrl = function ($scope, $modalInstance, doc) {
            $scope.doc = doc;
        };

        var postProcess = function (results) {
            resultPager = solr.ResultPager(SolrQuery, results.SEARCHRESPONSE.TOTALCOUNT);
            //resultPager = solr.ResultPager(SolrQuery, results.response.numFound);
        };

        $scope.isApplied = function (fieldName, filterValue) {
            return SolrQuery.hasFilter(fieldName + ":" + filterValue);
        };

        $scope.updateFreshness_effective_from_date = function () {
            //$scope.freshness = range;

            if ($scope.freshness === "UNDEFINED") {
                SolrQuery.removeFilter('freshness:');
            } else {
                SolrQuery.addFilter('freshness:', "effective_from_date:(" + dateRange[$scope.freshness] + ")");
            }
            $scope.search();
        }

        $scope.updatePriority = function () {
            //$scope.freshness = range;

            if ($scope.priority === "UNDEFINED") {
                SolrQuery.removeFilter('priority:');
            } else {
                SolrQuery.addFilter('priority:', "priority:(" + priorityRange[$scope.priority] + ")");
            }
            $scope.search();
        }

        $scope.filterSearch = function (fieldName, filterValue) {

            if (fieldName === 'Freshness') {
                $scope.freshness = 'UNDEFINED';
                $scope.updateFreshness_effective_from_date();
            } else {
                fieldName = fieldName.toLowerCase();

                var filterKey = fieldName + ":" + filterValue;
                var filterMod = fieldName + ':"' + filterValue + '"';

                if ($scope.isApplied(fieldName, filterValue)) {
                    SolrQuery.removeFilter(filterKey);
                } else {
                    SolrQuery.addFilter(filterKey, filterMod);
                }
                $scope.search($scope.navigator);
            }
        };


        $scope.search = function (type, pageNum) {
            SolrQuery.start(pageNum || 0);
            SolrQuery.rows(10);
            $scope.navigator = type || $scope.navigator;

            var queryString = $scope.query || "*";

            if ($scope.searchField !== 'UNDEFINED') {
                queryString = $scope.searchField + ':(' + queryString + ')';
            }

            SolrQuery.query(queryString);

            //console.log(SolrQuery.serialize());

            //$scope.results = solr.http.get({}, SolrQuery.serialize(), postProcess);
            console.log($scope.navigator);
            if ($scope.navigator == 'announcements')
                $scope.results = solr.Resource('/search/A21').get({}, SolrQuery.serialize(), postProcess);
            if ($scope.navigator == 'marketing')
                $scope.results = solr.Resource('/search/A22').get({}, SolrQuery.serialize(), postProcess);
            if ($scope.navigator == 'component')
                $scope.results = solr.Resource('/search/A24').get({}, SolrQuery.serialize(), postProcess);
            if ($scope.navigator == 'inserts')
                $scope.results = solr.Resource('/search/A27').get({}, SolrQuery.serialize(), postProcess);
            if ($scope.navigator == 'instructions')
                $scope.results = solr.Resource('/search/A28').get({}, SolrQuery.serialize(), postProcess);
            if ($scope.navigator == 'special')
                $scope.results = solr.Resource('/search/A210').get({}, SolrQuery.serialize(), postProcess);
        };

        $scope.pager = {

            pageChange: function (pageNum) {
                $scope.search(resultPager.get(pageNum));
            },

            next: function () {
                this.pageChange(resultPager.next());
            },

            prev: function () {
                this.pageChange(resultPager.previous());
            },

            pageClass: function (page) {
                return page === resultPager.current() ? "active" : "";
            },

            prevClass: function () {
                return resultPager.current() > 1 ? "" : "disabled";
            },

            nextClass: function () {
                return resultPager.current() < resultPager.total() ? "" : "disabled";
            },

            pages: function () {
                return resultPager.pages(pageMin, pageMax);
            }
        };

        $scope.search();

        //Reactive Search
        //$scope.$watch('query', $scope.search);

    }).controller('SearchControllerBell', function ($scope, $modal, solr) {

        var SolrQuery = solr.Query();
        var resultPager = solr.ResultPager(SolrQuery, 0);
        var pageMin = 5;
        var pageMax = 7;
        var dateRange = {
            "Last 11 Years": "[NOW/DAY-132MONTHS TO NOW/DAY]",
            "Last 15 Years": "[NOW/DAY-180MONTHS TO NOW/DAY]"
        };
        var priorityRange = {
            "100 - 1000": "[100 TO 1000]",
            "1000 - 5000": "[1000 TO 5000]",
            "Above 5000": "[5000 TO *]"
        };

        $scope.query = "";
        $scope.freshness = "UNDEFINED";
        $scope.searchField = "UNDEFINED";
        $scope.priority = "UNDEFINED";


        $scope.bellDetails = function (doc) {
            var modalInstance = $modal.open({
                templateUrl: '/assets/templates/bellDetails.html',
                controller: ModalInstanceCtrl,
                resolve: {
                    doc: function () {
                        return doc;
                    }
                }
            });
        };

        var ModalInstanceCtrl = function ($scope, $modalInstance, doc) {
            $scope.doc = doc;
        };

        var postProcess = function (results) {
            resultPager = solr.ResultPager(SolrQuery, results.response.numFound);
        };

        $scope.isApplied = function (fieldName, filterValue) {
            return SolrQuery.hasFilter(fieldName + ":" + filterValue);
        };

        $scope.updateFreshness_created_date = function () {
            //$scope.freshness = range;

            if ($scope.freshness === "UNDEFINED") {
                SolrQuery.removeFilter('freshness:');
            } else {
                SolrQuery.addFilter('freshness:', "creation_date:(" + dateRange[$scope.freshness] + ")");
            }
            $scope.search();
        }

        $scope.updatePriority = function () {
            //$scope.freshness = range;

            if ($scope.priority === "UNDEFINED") {
                SolrQuery.removeFilter('priority:');
            } else {
                SolrQuery.addFilter('priority:', "priority:(" + priorityRange[$scope.priority] + ")");
            }
            $scope.search();
        }

        $scope.filterSearch = function (fieldName, filterValue) {

            if (fieldName === 'Freshness') {
                $scope.freshness = 'UNDEFINED';
                $scope.updateFreshness_effective_from_date();
            } else {
                //fieldName = fieldName.toLowerCase();

                var filterKey = fieldName + ":" + filterValue;
                var filterMod = fieldName + ':"' + filterValue + '"';

                if ($scope.isApplied(fieldName, filterValue)) {
                    SolrQuery.removeFilter(filterKey);
                } else {
                    SolrQuery.addFilter(filterKey, filterMod);
                }
                $scope.search();
            }
        };


        $scope.search = function (pageNum) {
            SolrQuery.start(pageNum || 0);
            SolrQuery.rows(20);

            var queryString = $scope.query || "*";

            if ($scope.searchField !== 'UNDEFINED') {
                queryString = $scope.searchField + ':(' + queryString + ')';
            }

            SolrQuery.query(queryString);

            //console.log(SolrQuery.serialize());

            //$scope.results = solr.http.get({}, SolrQuery.serialize(), postProcess);
            $scope.results = solr.Resource('/bellSearchEmails').get({}, SolrQuery.serialize(), postProcess);
        };

        $scope.pager = {

            pageChange: function (pageNum) {
                $scope.search(resultPager.get(pageNum));
            },

            next: function () {
                this.pageChange(resultPager.next());
            },

            prev: function () {
                this.pageChange(resultPager.previous());
            },

            pageClass: function (page) {
                return page === resultPager.current() ? "active" : "";
            },

            prevClass: function () {
                return resultPager.current() > 1 ? "" : "disabled";
            },

            nextClass: function () {
                return resultPager.current() < resultPager.total() ? "" : "disabled";
            },

            pages: function () {
                return resultPager.pages(pageMin, pageMax);
            }
        };

        $scope.search();

        //Reactive Search
        //$scope.$watch('query', $scope.search);

    }).controller('SearchControllerBellQuestions', function ($scope, $modal, solr) {

        var SolrQuery = solr.Query();
        var resultPager = solr.ResultPager(SolrQuery, 0);
        var pageMin = 5;
        var pageMax = 7;
//        var dateRange = {
//            "Last 4 Years":"[NOW/DAY-48MONTHS TO NOW/DAY]",
//            "Last 5 Years":"[NOW/DAY-60MONTHS TO NOW/DAY]"
//        };
        //Temporary addition of results until mobile tasks reach elasticsearch
        

        $scope.query = "";
        $scope.querysimilarity = "";
        //$scope.freshness = "UNDEFINED";
        $scope.searchField = "UNDEFINED";
        $scope.priority = "UNDEFINED";
        $scope.searchType = "select";
        $scope.qid = "UNDEFINED";

        $scope.bellQuestionDetails = function (doc) {
            var modalInstance = $modal.open({
                templateUrl: '/assets/templates/bellQuestionDetails.html',
                controller: ModalInstanceCtrl,
                resolve: {
                    doc: function () {
                        return doc;
                    }
                }
            });
        };

        $scope.bellQuestionConcepts = function (doc) {
            var modalInstance = $modal.open({
                templateUrl: '/assets/templates/bellQuestionConcepts.html',
                controller: ModalInstanceCtrl,
                resolve: {
                    doc: function () {
                        return doc;
                    }
                }
            });
        };

        $scope.bellQuestionInvestigate = function (doc) {
            var modalInstance = $modal.open({
                templateUrl: '/assets/templates/bellQuestionInvestigate.html',
                controller: ModalInstanceCtrl,
                resolve: {
                    doc: function () {
                        return doc;
                    }
                }
            });
        };

        var ModalInstanceCtrl = function ($scope, $modalInstance, doc) {
            $scope.doc = doc;
        };

        var postProcess = function (results) {
            resultPager = solr.ResultPager(SolrQuery, results.response.numFound);
        };

        $scope.isApplied = function (fieldName, filterValue) {
            return SolrQuery.hasFilter(fieldName + ":" + filterValue);
        };

//        $scope.updateFreshness_created_date = function() {
//            //$scope.freshness = range;
//
//            if ($scope.freshness === "UNDEFINED") {
//                SolrQuery.removeFilter('freshness:');
//            } else {
//                SolrQuery.addFilter('freshness:', "Creation-Date_ss:(" + dateRange[$scope.freshness] + ")");
//            }
//            $scope.search();
//        }

        $scope.updatePriority = function () {
            //$scope.freshness = range;

            if ($scope.priority === "UNDEFINED") {
                SolrQuery.removeFilter('priority:');
            } else {
                SolrQuery.addFilter('priority:', "priority:(" + priorityRange[$scope.priority] + ")");
            }
            $scope.search();
        }

        $scope.filterSearch = function (fieldName, filterValue) {

            if (fieldName === 'Freshness') {
                $scope.freshness = 'UNDEFINED';
                $scope.updateFreshness_effective_from_date();
            } else {
                //fieldName = fieldName.toLowerCase();

                var filterKey = fieldName + ":" + filterValue;
                var filterMod = fieldName + ':"' + filterValue + '"';

                if ($scope.isApplied(fieldName, filterValue)) {
                    SolrQuery.removeFilter(filterKey);
                } else {
                    SolrQuery.addFilter(filterKey, filterMod);
                }
                $scope.search();
            }
        };


        $scope.search = function (pageNum, searchType, qid) {

            $scope.resultlist = {
                "list":"elasticon",
                "task":"show app"
            };
            $scope.facets = {
                "person":"Pritesh",
                "count":"1"
            };
            
            SolrQuery.start(pageNum || 0);
            SolrQuery.rows(20);

            console.log("Search got called");
            console.log("query is " + $scope.query);
            console.log("querysimilarity is " + $scope.querysimilarity);
            console.log("qid is " + qid);
            console.log("search type is "+searchType);
            //console.log("query from pass in is"+q);
            $scope.searchType = searchType;
            var queryString = $scope.query || "*";
            if (searchType === 'mlt-id') {
                if (!angular.isUndefined(qid)) {
                    queryString = 'id:' + qid;
                    $scope.qid = qid;
                } else if ($scope.qid != 'UNDEFINED') {
                    queryString = 'id:' + $scope.qid;
                } else {
                    queryString = $scope.query || "*";
                    $scope.qid = "UNDEFINED";
                }
                SolrQuery.query(queryString);
            } else if(searchType === 'mlt-stream'){
                SolrQuery.stream($scope.querysimilarity);
            } else{
                SolrQuery.query(queryString);
            }

//            if ($scope.searchField !== 'UNDEFINED') {
//                queryString = $scope.searchField + ':(' + queryString + ')';
//            }


            //SolrQuery.stream(queryString);

            //console.log(SolrQuery.serialize());

            //$scope.results = solr.http.get({}, SolrQuery.serialize(), postProcess);
            if ($scope.searchType === 'mlt-id')
                $scope.results = solr.Resource('/bellSearchQuestions/mlt').get({}, SolrQuery.serialize(), postProcess);
            else if ($scope.searchType === 'mlt-stream')
                $scope.results = solr.Resource('/bellSearchQuestions/mlt').get({}, SolrQuery.serialize(), postProcess);
            else
                $scope.results = solr.Resource('/bellSearchQuestions/select').get({}, SolrQuery.serialize(), postProcess);
        };

        $scope.pagesearch = function (pageNum) {
            SolrQuery.start(pageNum || 0);
            SolrQuery.rows(10);


            var queryString = $scope.query || "*";
            //if(qid != 'undefined')
            if ($scope.qid != 'UNDEFINED') {
                queryString = 'id:' + $scope.qid;
            }

            if ($scope.searchField !== 'UNDEFINED') {
                queryString = $scope.searchField + ':(' + queryString + ')';
            }

            SolrQuery.query(queryString);

            //console.log(SolrQuery.serialize());

            //$scope.results = solr.http.get({}, SolrQuery.serialize(), postProcess);
            if ($scope.searchType === 'mlt-id')
                $scope.results = solr.Resource('/bellSearchQuestions/mlt-id').get({}, SolrQuery.serialize(), postProcess);
            else
                $scope.results = solr.Resource('/bellSearchQuestions/select').get({}, SolrQuery.serialize(), postProcess);
        };

        $scope.pager = {

            pageChange: function (pageNum) {
                $scope.search(resultPager.get(pageNum), $scope.searchType);
            },

            next: function () {
                this.pageChange(resultPager.next());
            },

            prev: function () {
                this.pageChange(resultPager.previous());
            },

            pageClass: function (page) {
                return page === resultPager.current() ? "active" : "";
            },

            prevClass: function () {
                return resultPager.current() > 1 ? "" : "disabled";
            },

            nextClass: function () {
                return resultPager.current() < resultPager.total() ? "" : "disabled";
            },

            pages: function () {
                return resultPager.pages(pageMin, pageMax);
            }
        };

        //$scope.search();

        //Reactive Search
        //$scope.$watch('query', $scope.search);

    });