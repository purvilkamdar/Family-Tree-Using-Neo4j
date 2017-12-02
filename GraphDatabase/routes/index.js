var express = require('express');
var router = express.Router();
var neo4j1 = require('neo4j');

var db = new neo4j1.GraphDatabase('http://neo4j:purvil92@localhost:7474');

/* GET home page. */

function create_node(name,email,callback){
    try {
        db.cypher({
                query: 'CREATE (n:Person {name: {nameParam}, email: {emailParam} })',
                params: {nameParam: name,
                        emailParam: email},
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
            query: 'MATCH (n) WHERE n.email = {emailParam} RETURN n.email',
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

router.post('/create', function(req, res, next) {

    var req_params=JSON.parse(JSON.stringify(req.body))
    var name=req_params.name;
    var email=req_params.email;
    console.log(JSON.stringify(req.body));
    if(name == undefined || email == undefined)
    {
        res.status(401).send(JSON.stringify({'error':'Missing name or email in parameters'}));
    }
    else
    {
        get_node(email,function(node_result,error){

            if(error)
            {
                console.log("Error in get node: "+error);
            }
            else {
                console.log("node result"+node_result);
                if(node_result==undefined) {
                    create_node(name, email, function (result) {
                        console.log("Inside success");
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



module.exports = router;
