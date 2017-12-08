
   var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }

        anHttpRequest.open( "GET", aUrl, true );            
        anHttpRequest.send( null );
    }
}
     
 
	 function drawChartSankey() {
        	console.log("Requested");
            var client = new HttpClient();
            client.get('/graphData/'+localStorage.getItem("user"), function(response) {
                // do something with response
           	  
            console.log("This is My Response"+JSON.stringify(response));
            var data = new google.visualization.DataTable();
            var count =20;
            
            data.addColumn('string', 'from');
            data.addColumn('string', 'to');
            data.addColumn('number', 'Weight');
            data.addColumn({type:'string', role:'tooltip'});
            //console.log(response);
            
           // var arr = $.map(response, function(el) { return el; })
            data.addRows(
            		JSON.parse(response));
            
            // Sets chart options.
           var options = {
                width: 600,
            };

            // Instantiates and draws our chart, passing in some options.
            var chart = new google.visualization.Sankey(document.getElementById('sankey_basic'));
            chart.draw(data, options);
            });
        }
            