angular.module('wfhm.filters', [])
    .filter('bytes', function() {
	    return function(bytes, precision) {
		    if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
		    if (typeof precision === 'undefined') precision = 1;
		    var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			    number = Math.floor(Math.log(bytes) / Math.log(1024));
		    return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
	    }
    }).filter("nl2br", function($filter) {
        return function(data) {
            if (!data) return data;
                return data.replace(/\n\r?/g, '<br />');
        };
    });