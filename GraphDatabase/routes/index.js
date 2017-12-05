var express = require('express');
var router = express.Router();
var neo4j1 = require('neo4j');

var db = new neo4j1.GraphDatabase('http://neo4j:purvil92@localhost:7474');

/* GET home page. */

function create_node(fname,lname,email,lat,lon,city,callback){
    try {
        db.cypher({
                query: 'CREATE (n:Person {fname: {fnameParam}, lname: {lnameParam}, email: {emailParam},lat: {latParam},lon: {lonParam},city: {cityParam} })',
                params: {fnameParam: fname,
                        lnameParam : lname,
                        emailParam: email,
                        lat:latParam,
                        lon:lonParam,
                        city:cityParam}
            }, function callback1(err, results) {
                if (err)
                    callback (err);
                else {
                    callback('success');
                }
            }
        );
    }
    catch (e)
    {
        console.log("Exception occured in create method:"+e.toString());
        callback('Exception in Server Error');
    }
}

function get_node(email,callback){
    try {
        db.cypher({
            query: 'MATCH (n:Person) WHERE n.email = {emailParam} RETURN n.email',
            params:{emailParam:email},
        }, function callback1(err, results) {
            if (err)
                callback (null,err);
            else {
                var result = JSON.stringify(results);
                console.log("Result: "+result.toString());
                callback(result,null)
            }
        }
        );
    }
    catch (e)
    {
        console.log("Exception occured in get method:"+e.toString());
        callback(null,e);
    }
}

function get_nodes(email,callback){
    try {
        var counter=0;
        for (i=0;i<email.length; i++)
        {
            db.cypher({
                    query: 'MATCH (n:Person) WHERE n.email = {emailParam} RETURN n',
                    params:{emailParam:email[i]},
                }, function callback1(err, results) {
                    if (err) {
                        callback(null, err);
                    }
                    else {
                        counter++;
                        var result = JSON.stringify(results);

                        if (result=='[]')
                        {
                            callback('failure',null)
                        }
                        console.log("Result: "+result.toString());
                        if (counter==email.length)
                            callback('success',null);
                    }
                }
            );
        }
    }
    catch (e)
    {

    }
}


function delete_node(email,callback){
    try {
            db.cypher({
                query: 'MATCH (n { email: {emailParam} })DETACH DELETE n',
                params: {emailParam: email},
            }, function (err,results) {
                if(err)
                    callback(null,err);
                else
                {
                    var result=JSON.stringify(results);
                    console.log("Results:"+result.toString());
                    callback('success',null);
                }
            });
    }
    catch (e)
    {
        console.log("Exception in deleting node:"+e);
        callback(null,e);
    }
}

function checkRelationship(email1,email2,callback) {
    try {
        db.cypher({
                query: 'MATCH (a:Person {email: {emailParam1}})-[r]->(b:Person {email: {emailParam2}}) RETURN type(r)',
                params: {
                    emailParam1: email1,
                    emailParam2: email2
                }
            },
            function (err, results) {
                if (err)
                    callback(null, err);
                else {
                    var result = JSON.stringify(results);
                    console.log("Results for all relationship from a node:" + result);
                    callback(result, null);
                }
            });

    }
    catch (e)
    {
        console.log("Exception in check relationship: "+e);
    }
}

global.Father=function Father(email1,email2,callback)
{
    try {
        db.cypher({
            query: 'MATCH (n:Person),(m:Person) WHERE n.email = {emailParam1} AND m.email = {emailParam2} CREATE (n)-[r:Father]->(m) RETURN r',
            params: {emailParam1: email1,
                emailParam2:email2},
        }, function (err,results) {
            if(err)
                callback(null,err);
            else
            {
                var result=JSON.stringify(results);
                console.log("Results:"+result.toString());
                callback('success',null);
            }
        });
    }
    catch (e)
    {
        console.log("Exception in deleting node:"+e);
        callback(null,e);
    }
};


global.Mother=function Mother(email1,email2,callback)
{
    try {
        db.cypher({
            query: 'MATCH (n:Person),(m:Person) WHERE n.email = {emailParam1} AND m.email = {emailParam2} CREATE (n)-[r:Mother]->(m) RETURN r',
            params: {emailParam1: email1,
                emailParam2:email2},
        }, function (err,results) {
            if(err)
                callback(null,err);
            else
            {
                var result=JSON.stringify(results);
                console.log("Results:"+result.toString());
                callback('success',null);
            }
        });
    }
    catch (e)
    {
        console.log("Exception in deleting node:"+e);
        callback(null,e);
    }
};


global.Son=function Son(email1,email2,callback)
{
    try {
        db.cypher({
            query: 'MATCH (n:Person),(m:Person) WHERE n.email = {emailParam1} AND m.email = {emailParam2} CREATE (n)-[r:Son]->(m) RETURN r',
            params: {emailParam1: email1,
                emailParam2:email2},
        }, function (err,results) {
            if(err)
                callback(null,err);
            else
            {
                var result=JSON.stringify(results);
                console.log("Results:"+result.toString());
                callback('success',null);
            }
        });
    }
    catch (e)
    {
        console.log("Exception in deleting node:"+e);
        callback(null,e);
    }
};

global.Sister=function Sister(email1,email2,callback)
{
    try {
        db.cypher({
            query: 'MATCH (n:Person),(m:Person) WHERE n.email = {emailParam1} AND m.email = {emailParam2} CREATE (n)-[r:Sister]->(m) RETURN r',
            params: {emailParam1: email1,
                emailParam2:email2},
        }, function (err,results) {
            if(err)
                callback(null,err);
            else
            {
                var result=JSON.stringify(results);
                console.log("Results:"+result.toString());
                callback('success',null);
            }
        });
    }
    catch (e)
    {
        console.log("Exception in deleting node:"+e);
        callback(null,e);
    }
};

global.Daughter=function Daughter(email1,email2,callback)
{
    try {
        db.cypher({
            query: 'MATCH (n:Person),(m:Person) WHERE n.email = {emailParam1} AND m.email = {emailParam2} CREATE (n)-[r:Daughter]->(m) RETURN r',
            params: {emailParam1: email1,
                emailParam2:email2},
        }, function (err,results) {
            if(err)
                callback(null,err);
            else
            {
                var result=JSON.stringify(results);
                console.log("Results:"+result.toString());
                callback('success',null);
            }
        });
    }
    catch (e)
    {
        console.log("Exception in deleting node:"+e);
        callback(null,e);
    }
};

global.Brother=function Brother(email1,email2,callback)
{
    try {
        db.cypher({
            query: 'MATCH (n:Person),(m:Person) WHERE n.email = {emailParam1} AND m.email = {emailParam2} CREATE (n)-[r:Brother]->(m) RETURN r',
            params: {emailParam1: email1,
                emailParam2:email2},
        }, function (err,results) {
            if(err)
                callback(null,err);
            else
            {
                var result=JSON.stringify(results);
                console.log("Results:"+result.toString());
                callback('success',null);
            }
        });
    }
    catch (e)
    {
        console.log("Exception in deleting node:"+e);
        callback(null,e);
    }
};

global.Spouse=function Spouse(email1,email2,callback)
{
    try {
        db.cypher({
            query: 'MATCH (n:Person),(m:Person) WHERE n.email = {emailParam1} AND m.email = {emailParam2} CREATE (n)-[r:Spouse]->(m) RETURN r',
            params: {emailParam1: email1,
                emailParam2:email2}
        }, function (err,results) {
            if(err)
                callback(null,err);
            else
            {
                var result=JSON.stringify(results);
                console.log("Results:"+result.toString());
                callback('success',null);
            }
        });
    }
    catch (e)
    {
        console.log("Exception in deleting node:"+e);
        callback(null,e);
    }
};

function get_all_relationships(email,callback)
{
    try{
        db.cypher({
            query: 'MATCH (a:Person {email: {emailParam}})-[r]->(b) RETURN type(r), b, a',
            params: {emailParam:email}
        },
        function (err,results){
            if(err)
                callback(null,err);
            else
            {
                var result=JSON.stringify(results);
                console.log("Results for all relationship from a node:"+result);
                callback(result,null);
            }
        });

    }

    catch (e)
    {
        console.log("Excepting in get all relationships:"+e);
        callback(null,e);
    }
}


router.post('/create', function(req, res, next) {

    var req_params=req.body;
    var fname=req_params.fname;
    var lname=req_params.lname;
    var email=req_params.email;
    var lat=req_params.Latitude;
    var lon=req_params.Longitude;
    var city=req_params.city;
    console.log(JSON.stringify(req.body));
    if(fname == undefined || email == undefined || lname == undefined || lat == undefined || lon == undefined || city == undefined)
    {
        res.status(401).send(JSON.stringify({'error':'Missing name or email in parameters'}));
    }
    else
    {
        get_node(email,function(node_result,error){

            if(error)
            {
                console.log("Error in get node: "+error);
                res.status(500).send(JSON.stringify("Internal Server Error"));
            }
            else {
                console.log("node result"+node_result);
                if(node_result==undefined || node_result=='[]') {
                    create_node(fname, lname, email, lat,lon,city,function (result) {
                        if (result == 'success') {
                            res.status(200).send();
                        }
                        else {
                            console.log("Result" + result.toString());
                            res.status(401).send(JSON.stringify({'error': result}));
                        }
                    });
                }
                else
                {
                    res.status(401).send(JSON.stringify({'error':'Cannot create because node already exists'}));
                }
            }
        });
    }
});

router.post('/deleteNode',function (req,res) {

    var req_params=req.body
    var email=req_params.email;
    if(email==undefined)
    {
        res.status(401).send(JSON.stringify({'error':'Missing email in parameter'}));
    }
    else
    {
        get_node(email,function(node_result,error){

            if(error)
            {
                console.log("Error in get node: "+error);
                res.status(500).send(JSON.stringify("Internal Server Error"));
            }
            else {
                console.log("node result"+node_result);
                if(node_result!=undefined && node_result!='[]') {
                    delete_node(email, function (result,error) {
                        if(error)
                        {
                            console.log("Error"+error);
                        }
                        else {
                            if (result == 'success') {
                                res.status(200).send();
                            }
                            else {
                                console.log("Result" + result);
                                res.status(401).send(JSON.stringify({'error': result}));
                            }
                        }
                    });
                }
                else
                {
                    res.status(401).send(JSON.stringify({'error':'Cannot delete because node does not exist'}));
                }
            }
        });
    }


});

router.post('/createRelationship', function(req, res, next) {
    var relationship_list=['Father','Mother','Son','Daughter','Brother','Sister','Spouse'];
    var req_params=req.body
    var email1=req_params.email1;
    var email2=req_params.email2;
    var r1=req_params.r1;
    var r2=req_params.r2;

    console.log(JSON.stringify(req.body));
    if(email1 == undefined ||  r1 == undefined || email2 == undefined || r2 == undefined)
    {
        res.status(401).send(JSON.stringify({'error':'Missing email or relationship in parameters'}));
    }
    else
    {
        if (relationship_list.indexOf(r1)==-1 || relationship_list.indexOf(r2)==-1)
        {
            res.status(401).send(JSON.stringify({error:'This type of relationship is not supported right now'}));
        }

        var send_email=[];
        send_email[0]=email1;
        send_email[1]=email2;
        get_nodes(send_email,function(node_result,error){

            if(error)
            {
                console.log("Error in get node: "+error);
                res.status(500).send(JSON.stringify("Internal Server Error"));
            }
            else {

                if(node_result == 'success') {

                    checkRelationship(email1,email2,function (results,err){

                        if (err)
                        {
                            console.log("Error in check relationship: "+err);
                            res.status(500).send(JSON.stringify({'errro':err}));
                        }
                        else if (results=='[]'){

                            if (r1 in global && typeof global[r1] === "function") {
                                global[r1](email1, email2, function (result, err) {
                                    if (err) {
                                        console.log("Error:" + err);
                                    }
                                    else {
                                        if (result == 'success') {
                                        }
                                        else {
                                            console.log("Result" + result.toString());
                                            res.status(401).send(JSON.stringify({'error': result}));
                                        }
                                    }
                                });
                            }
                            else {
                                console.log("could not find " + r1 + " function");
                            }
                            if (r2 in global && typeof global[r2] === "function") {

                                global[r2](email2, email1, function (result, err) {
                                    if (err) {
                                        console.log("Error:" + err);
                                    }
                                    else {
                                        if (result == 'success') {
                                            res.status(200).send();
                                        }
                                        else {
                                            console.log("Result" + result.toString());
                                            res.status(401).send(JSON.stringify({'error': result}));
                                        }
                                    }
                                });
                            }
                            else {
                                console.log("could not find " + r1 + " function");
                            }
                        }
                        else
                        {
                            res.status(401).send(JSON.stringify({'error':'Cannot create Relationship as it already exists'}));
                        }
                    });
                }
                else
                {
                    res.status(401).send(JSON.stringify({'error':'Cannot create relationship as all the nodes do not exist'}));
                }
            }
        });
    }
});

router.post('/getRelationship',function(req,res,next){
    var req_params=req.body;
    var email=req_params.email;
    var type=req_params.type;
    if(email==undefined || type==undefined)
    {
        res.status(401).send(JSON.stringify({'error':'Missing email or type in parameter'}));
    }
    else
    {
        get_node(email,function(node_result,error){

            if(error)
            {
                console.log("Error in get node: "+error);
                res.status(500).send(JSON.stringify("Internal Server Error"));
            }
            else {
                console.log("node result"+node_result);
                if(node_result!=undefined && node_result!='[]') {
                    get_all_relationships(email, function (result,error) {
                        if(error)
                        {
                            console.log("Error"+error);
                            res.status(500).send(JSON.stringify(({'error':error})));
                        }
                        else {
                            var temp_json=JSON.parse(result);
                            if(type=='google') {
                                var final_json=[];
                                for (i=0;i<temp_json.length;i++)
                                {
                                    var temp_array={};
                                    temp_array['relation']=temp_json[i]['type(r)'];
                                    temp_array['name']=(temp_json[i].b.properties.fname) + " " + (temp_json[i].b.properties.lname);
                                    temp_array['lat']=temp_json[i].b.properties.lat;
                                    temp_array['long']=temp_json[i].b.properties.lon;
                                    temp_array['city']=temp_json[i].b.properties.city;
                                    final_json.push(temp_array);
                                }
                                res.status(200).send(final_json);
                            }
                            else if (type=='home')
                            {
                                var final_json={};
                                final_json['nodes']=[];
                                final_json['edges']=[];
                                for(i=0;i<temp_json.length;i++)
                                {
                                    var temp_nodes_array={};
                                    var temp_edges_array={};
                                    temp_nodes_array['id']=(temp_json[i].b.properties.fname) + " " + (temp_json[i].b.properties.lname);
                                    temp_nodes_array['nodeType']=temp_json[i]['type(r)'];
                                    temp_edges_array['source']=(temp_json[i].a.properties.fname) + " " + (temp_json[i].a.properties.lname);
                                    temp_edges_array['target'] = (temp_json[i].b.properties.fname) + " " + (temp_json[i].b.properties.lname);
                                    temp_edges_array['edgeType'] = temp_json[i]['type(r)'];
                                    final_json.nodes.push(temp_nodes_array);
                                    final_json.edges.push(temp_edges_array);
                                }
                                res.status(200).send(final_json);
                            }

                        }
                    });
                }
                else
                {
                    res.status(401).send(JSON.stringify({'error':'Cannot fetch reslations because node does not exist'}));
                }
            }
        });
    }
});

module.exports = router;
