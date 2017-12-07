
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post('/getRelationForGoogle', routes.getRelationForGoogle);
app.post('/getRelationForGraphs', routes.getRelationForGraphs);
app.post('/relation', routes.relation);
app.post('/deleteRelation', routes.deleteRelation);
app.post('/modifyRelation', routes.modifyRelation);
app.post('/chartdata', routes.chartdata);
app.post('/sankeydata', routes.sankeyData);
app.get('/charts', routes.charts);
app.get('/graph', routes.graph);
app.get('/maps', routes.maps);
app.get('/sankey', routes.sankey);
app.post('/signUp', routes.signUp);
app.post('/login', routes.login);
app.get('/users', user.list);
app.get('/homePage', routes.homePage);
app.get('/graphData/:email', routes.graphData);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
