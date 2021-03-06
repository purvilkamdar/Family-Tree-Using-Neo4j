var express = require('express');
var router = express.Router();
var neo4j1 = require('neo4j');

var db = new neo4j1.GraphDatabase('http://neo4j:purvil92@localhost:7474');

var High_level =[];
High_level.push('Father');
High_level.push('Mother');

/* GET home page. */


function create_node(fname,lname,email,lat,lon,city,callback){
    try {
        db.cypher({
                query: 'CREATE (n:Person {fname: {fnameParam}, lname: {lnameParam}, email: {emailParam},lat: {latParam},lon: {lonParam},city: {cityParam} })',
                params: {fnameParam: fname,
                        lnameParam : lname,
                        emailParam: email,
                        latParam:lat,
                        lonParam:lon,
                        cityParam:city}
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

function modify_node(fname,lname,email,lat,lon,city,callback)
{
    try {
        db.cypher({
            query: 'MATCH (n:Person) WHERE n.email = {emailParam} set n.fname = {fnameParam}, n.lname = {lnameParam}, n.lat = {latParam}, n.lon = {lonParam}, n.city = {cityParam}  RETURN n',
            params: {
                fnameParam: fname,
                lnameParam : lname,
                emailParam: email,
                latParam:lat,
                lonParam:lon,
                cityParam:city
            }
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

function get_node(email,callback){
    try {
        db.cypher({
            query: 'MATCH (n:Person) WHERE n.email = {emailParam} RETURN n.email',
            params:{emailParam:email}
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

function checkRelationship_with_param(email1,email2,param,callback) {
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
                    //var result = JSON.stringify(results);
                    console.log("Results for all relationship from a node:" + results);
                    callback(results,null,param);
                }
            });

    }
    catch (e)
    {
        console.log("Exception in check relationship: "+e);
    }
}

function check_single_relation(email,callback){
    try {
        db.cypher({
                query: 'MATCH (n:Person {email: {emailParam1}})-[r]-()RETURN type(r)',
                params: {
                    emailParam1: email
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

function get_all_relationships(email,callback) {
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

function get_home(email,callback){

    try{
        db.cypher({
                query: 'MATCH (a:Person {email: {emailParam}})-[r]-(b) RETURN type(r), b, a',
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

function delete_relationships(email1,email2,callback) {
    try {
        db.cypher({
            query: 'MATCH (a:Person {email: {emailParam1} })-[r]->(b:Person {email:{emailParam2}}) DELETE r',
            params: {emailParam1: email1,
                emailParam2:email2}
        }, function (err,results) {
            if(err)
                callback(null,err);
            else
            {
                var result=JSON.stringify(results);
                console.log("Results for delete relationships:"+result.toString());
                //callback('success',null);
            }
        });
        db.cypher({
            query: 'MATCH (a:Person {email: {emailParam1} })-[r]->(b:Person {email:{emailParam2}}) DELETE r',
            params: {emailParam1: email2,
                emailParam2:email1}
        }, function (err,results) {
            if(err)
                callback(null,err);
            else
            {
                var result=JSON.stringify(results);
                console.log("Results for delete relationships:"+result.toString());
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
        check_single_relation(email1,function (result,err){
            if (err)
            {
                console.log("Error in check single relation: "+err);
            }
            else {
                if (result.indexOf("Spouse")==-1) {
                    db.cypher({
                        query: 'MATCH (n:Person),(m:Person) WHERE n.email = {emailParam1} AND m.email = {emailParam2} CREATE (n)-[r:Spouse]->(m) RETURN r',
                        params: {
                            emailParam1: email1,
                            emailParam2: email2
                        }
                    }, function (err, results) {
                        if (err)
                            callback(null, err);
                        else {
                            var result = JSON.stringify(results);
                            console.log("Results:" + result.toString());
                            callback('success', null);
                        }
                    });
                }
                else
                {
                    callback('Spouse already present for the node',null);
                }
            }
        });
    }
    catch (e)
    {
        console.log("Exception in deleting node:"+e);
        callback(null,e);
    }
};


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
    var fname=req_params.fname;
    var lname=req_params.lname;
    var lat=req_params.Latitude;
    var lon=req_params.Longitude;
    var city=req_params.city;
    var r1=req_params.r1;
    var r2=req_params.r2;
    var create_node_flag=req_params.createNode;

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

        if(create_node_flag)
        {
            get_node(email2,function(node_result,error){

                if(error)
                {
                    console.log("Error in get node: "+error);
                    res.status(500).send(JSON.stringify("Internal Server Error"));
                }
                else {
                    console.log("node result"+node_result);
                    if(node_result==undefined || node_result=='[]') {
                        create_node(fname, lname, email2, lat,lon,city,function (result) {
                            if (result == 'success') {

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
        else {

            var send_email = [];
            send_email[0] = email1;
            send_email[1] = email2;
            get_nodes(send_email, function (node_result, error) {

                if (error) {
                    console.log("Error in get node: " + error);
                    res.status(500).send(JSON.stringify("Internal Server Error"));
                }
                else {

                    if (node_result == 'success') {

                        checkRelationship(email1, email2, function (results, err) {

                            if (err) {
                                console.log("Error in check relationship: " + err);
                                res.status(500).send(JSON.stringify({'errro': err}));
                            }
                            else if (results == '[]') {

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
                            else {
                                res.status(401).send(JSON.stringify({'error': 'Cannot create Relationship as it already exists'}));
                            }
                        });
                    }
                    else {
                        res.status(401).send(JSON.stringify({'error': 'Cannot create relationship as all the nodes do not exist'}));
                    }
                }
            });
        }
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
                                console.log(final_json);
                                res.status(200).send(final_json);
                            }
                            else if (type=='home')
                            {
                                var final_json={};
                                final_json['nodes']=[];
                                final_json['edges']=[];
                                for(i=0;i<temp_json.length;i=i+2)
                                {
                                    var temp_nodes_array_dest={};
                                    var temp_nodes_array_source={};
                                    var temp_edges_array_dest={};
                                    var temp_edges_array_source={};

                                    temp_nodes_array_dest['id']=(temp_json[i].b.properties.fname) + " " + (temp_json[i].b.properties.lname);
                                    temp_nodes_array_dest['nodeType']=temp_json[i]['type(r)'];

                                    temp_nodes_array_source['id']=(temp_json[i].a.properties.fname) + " " + (temp_json[i].a.properties.lname);
                                    temp_nodes_array_source['nodeType']=temp_json[i+1]['type(r)'];


                                    temp_edges_array_dest['source']=(temp_json[i].a.properties.fname) + " " + (temp_json[i].a.properties.lname);
                                    temp_edges_array_dest['target'] = (temp_json[i].b.properties.fname) + " " + (temp_json[i].b.properties.lname);
                                    temp_edges_array_dest['edgeType'] = temp_json[i]['type(r)'];

                                    temp_edges_array_source['target']=(temp_json[i].a.properties.fname) + " " + (temp_json[i].a.properties.lname);
                                    temp_edges_array_source['source'] = (temp_json[i].b.properties.fname) + " " + (temp_json[i].b.properties.lname);
                                    temp_edges_array_source['edgeType'] = temp_json[i+1]['type(r)'];

                                    final_json.nodes.push(temp_nodes_array_dest);
                                    final_json.nodes.push(temp_nodes_array_source);
                                    final_json.edges.push(temp_edges_array_dest);
                                    final_json.edges.push(temp_edges_array_source);
                                }
                                res.status(200).send(final_json);
                            }
                            else if (type=='sankey')
                            {
                                var sent_flag=false;
                                var left_count=0;
                                var final_json=[];
                                for (i=0;i<temp_json.length;i++)
                                {
                                        var temp_array = new Array(4);
                                        if (High_level.indexOf(temp_json[i]['type(r)']) != -1) {
                                            left_count++;
                                            temp_array[0] = (temp_json[i].b.properties.fname + " " + temp_json[i].b.properties.lname);
                                            temp_array[1] = (temp_json[i].a.properties.fname + " " + temp_json[i].a.properties.lname);
                                            temp_array[2] = 1;

                                            final_json.push(temp_array);
                                            checkRelationship_with_param(temp_json[i].a.properties.email, temp_json[i].b.properties.email, i, function (result, err,j) {
                                                if (err) {
                                                    console.log("Error in check Relationship: " + err);
                                                }
                                                else {
                                                    final_json[j][3]=result[0]['type(r)'];
                                                    left_count--;
                                                    if (left_count==0) {
                                                        sent_flag=true;
                                                        res.status(200).send(final_json);
                                                    }

                                                }
                                            });
                                        }
                                        else
                                        {
                                            temp_array[0] = (temp_json[i].a.properties.fname + " " + temp_json[i].a.properties.lname);
                                            temp_array[1] = (temp_json[i].b.properties.fname + " " + temp_json[i].b.properties.lname);
                                            temp_array[2] = 1;
                                            temp_array[3] = temp_json[i]['type(r)'];
                                            final_json.push(temp_array);
                                        }
                                }

                                if(left_count==0)
                                {
                                    if(!sent_flag)
                                        res.status(200).send(final_json);
                                }

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

router.post('/getHome',function(req,res,next){
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
                    get_home(email, function (result,error) {
                        if(error)
                        {
                            console.log("Error"+error);
                            res.status(500).send(JSON.stringify(({'error':error})));
                        }
                        else {
                            var temp_json=JSON.parse(result);
                            if (type=='home')
                            {
                                var final_json={};
                                final_json['nodes']=[];
                                final_json['edges']=[];
                                for(i=0;i<temp_json.length;i=i+2)
                                {
                                    var temp_nodes_array_dest={};
                                    var temp_nodes_array_source={};
                                    var temp_edges_array_dest={};
                                    var temp_edges_array_source={};

                                    temp_nodes_array_dest['id']=(temp_json[i].b.properties.fname) + " " + (temp_json[i].b.properties.lname);
                                    temp_nodes_array_dest['nodeType']=temp_json[i]['type(r)'];

                                    temp_nodes_array_source['id']=(temp_json[i].a.properties.fname) + " " + (temp_json[i].a.properties.lname);
                                    temp_nodes_array_source['nodeType']=temp_json[i+1]['type(r)'];


                                    temp_edges_array_dest['source']=(temp_json[i].a.properties.fname) + " " + (temp_json[i].a.properties.lname);
                                    temp_edges_array_dest['target'] = (temp_json[i].b.properties.fname) + " " + (temp_json[i].b.properties.lname);
                                    temp_edges_array_dest['edgeType'] = temp_json[i]['type(r)'];

                                    temp_edges_array_source['target']=(temp_json[i+1].a.properties.fname) + " " + (temp_json[i+1].a.properties.lname);
                                    temp_edges_array_source['source'] = (temp_json[i+1].b.properties.fname) + " " + (temp_json[i+1].b.properties.lname);
                                    temp_edges_array_source['edgeType'] = temp_json[i+1]['type(r)'];

                                    final_json.nodes.push(temp_nodes_array_dest);
                                    final_json.nodes.push(temp_nodes_array_source);
                                    final_json.edges.push(temp_edges_array_dest);
                                    final_json.edges.push(temp_edges_array_source);
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

//Added comment
router.post('/deleteRelationship',function(req,res,next){
    var req_params=req.body;
    var email1=req_params.email1;
    var email2=req_params.email2;
    if(email1==undefined || email2==undefined)
    {
        res.status(401).send(JSON.stringify({'error':'Missing email or type in parameter'}));
    }
    else
    {
        delete_relationships(email1,email2,function(node_result,error){

            if(error)
            {
                console.log("Error in get node: "+error);
                res.status(500).send(JSON.stringify("Internal Server Error"));
            }
            else {
                console.log("node result"+node_result);
                res.status(200).send();
            }
        });
    }
});

router.post('/getNode',function(req,res,next){
    var req_params=req.body;
    var email=req_params.email;
    if(email==undefined)
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
                if(node_result=='[]')
                    res.status(200).send();
                else
                    res.status(404).send();
            }
        });
    }
});

router.post('/modifyRelationship', function(req, res, next) {
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

                    delete_relationships(email1,email2,function(node_result,error){

                        if(error)
                        {
                            console.log("Error in get node: "+error);
                            res.status(500).send(JSON.stringify("Internal Server Error"));
                        }
                        else {
                            console.log("node result"+node_result);
                            //res.status(200).send();


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
                            console.log("Results:"+results);
                            res.status(401).send(JSON.stringify({'error':'Cannot create Relationship as it already exists'}));
                        }
                    });
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

router.post('/modifyNode',function (req,res,next) {

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
        res.status(401).send(JSON.stringify({'error':'Missing some or required parameters'}));
    }
    else
    {
        modify_node(fname, lname, email, lat,lon,city,function (result,err) {

            if(err)
            {
                console.log("Error in Modify node: "+err);
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
});

module.exports = router;

