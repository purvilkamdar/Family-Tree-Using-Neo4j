/*             
$( document ).ready(function() {
    console.log( "ready!" );
    $.post("/sankeyData", function(result){
    	console.log( "again!" + result);
    });
});*/
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
            
            
        	   console.log("ggrbrgbr");
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

            
            /*
            data.addRows([
                [ 'Alfredo Sauce', 'Black Olive', 13 ],
                [ 'Sauce', 'Banana Pepper', 12 ],
                [ 'Garlic Parmesan White Sauce', 'Onion', 9 ],
                [ 'Hearty Marinara Sauce', 'Mushroom', 3 ],
                [ 'BBQ Sauce', 'Banana Pepper', 4 ],
                [ 'Alfredo Sauce', 'Onion', 5 ],
                [ 'Sauce', 'Mushroom', 2 ],
                [ 'Sauce', 'Black Olive', 12 ],
                [ 'Sauce', 'Onion', 2 ],
                [ 'Garlic Parmesan White Sauce', 'Banana Pepper', 2 ],
                [ 'Hearty Marinara Sauce', 'Onion', 3 ],
                [ 'BBQ Sauce', 'Black Olive', 12 ],
                [ 'Garlic Parmesan White Sauce', 'Black Olive', 10 ],
                [ 'Garlic Parmesan White Sauce', 'Mushroom', 5 ],
                [ 'Garlic Parmesan White Sauce', 'Hot Sauce', 5 ],
                [ 'BBQ Sauce', 'Hot Sauce', 6 ],
                [ 'Sauce', 'Hot Sauce', 2 ],
                [ 'Alfredo Sauce', 'Hot Sauce', 3 ],
                [ 'Hearty Marinara Sauce', 'Hot Sauce', 3 ],
                [ 'Hearty Marinara Sauce', 'Banana Pepper', 8 ],
                [ 'Hearty Marinara Sauce', 'Black Olive', 12 ],
                [ 'Alfredo Sauce', 'Banana Pepper', 5 ],
                [ 'Alfredo Sauce', 'Mushroom', 9 ],

                [ 'Sauce', 'Spinach', 2 ],
                [ 'Alfredo Sauce', 'Spinach', 9 ],
                [ 'Hearty Marinara Sauce', 'Spinach', 8 ],
                [ 'BBQ Sauce', 'Spinach', 6 ],
                [ 'Garlic Parmesan White Sauce', 'Spinach', 2 ],

                [ 'Sauce', 'Pineapples', 2 ],
                [ 'Alfredo Sauce', 'Pineapples', 9 ],
                [ 'Hearty Marinara Sauce', 'Pineapples', 8 ],
                [ 'BBQ Sauce', 'Pineapples', 6 ],
                [ 'Garlic Parmesan White Sauce', 'Pineapples', 2 ],

                [ 'Sauce', 'Diced Tomatoes', 2 ],
                [ 'Alfredo Sauce', 'Diced Tomatoes', 9 ],
                [ 'Hearty Marinara Sauce', 'Diced Tomatoes', 8 ],
                [ 'BBQ Sauce', 'Diced Tomatoes', 6 ],
                [ 'Garlic Parmesan White Sauce', 'Diced Tomatoes', 2 ],
                
            ]);*/
            
            // Sets chart options.
           var options = {
                width: 600,
            };

            // Instantiates and draws our chart, passing in some options.
            var chart = new google.visualization.Sankey(document.getElementById('sankey_basic'));
            chart.draw(data, options);
            });
        }
            