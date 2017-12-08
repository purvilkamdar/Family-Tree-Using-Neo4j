/*
 * GET home page
 */
var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://52.207.232.9:27017/myFamilyTreeDB";
<<<<<<< HEAD
//var url = "mongodb://127.0.0.1:27017/myFamilyTreeDB";
=======
>>>>>>> 0a148fc819dc0e4599a03bd4ffd433e5539186e3
var http = require('http');
var request = require('request');
var publicUrl = "http://52.207.232.9:4000"
//var publicUrl = "http://127.0.0.1:4000"
exports.index = function(req, res) {
	res.render('index', {
		title : 'Express'
	});
};

exports.homePage = function(req, res) {
	res.render('Graph', {
		title : 'Express'
	});
};

exports.graph = function(req, res) {
	console.log("In graph");
	res.render('Graph', {
		title : 'Express'
	});
};
exports.charts = function(res,res) {
	console.log("In Chart");
	res.render('charts', {
		title : 'Express'
	});
}



exports.chartdata = function(req,res){
	console.log("In data chart function");
	console.log("email is "+ req.body.useremail);
	request.post(
			publicUrl + '/getRelationship',
			{
				json : {
					email : req.body.useremail,
					type : 'charts'
				}
			},
			function(error, response, body) {
				if (!error && response.statusCode == 200) {
					console.log(body);
					res.send(body);
				} else {
					console.log("BODY : " + JSON.stringify(body));
					console.log("error");
				}
			}

		);
		
}

exports.sankey = function(req, res) {
	console.log("In Sankey");
	res.render('Sankey', {
		title : 'Express'
	});
};

exports.maps = function(req, res) {
	console.log("In Maps");
	res.render('Maps', {
		title : 'Express'
	});
};

exports.deleteRelation = function(req, res) {
	MongoClient.connect(url, function(err, db) {
		console.log("In Mongo delete relation");
		if (err)
			throw err;
				var myobj7 = {
						email1: req.body.email1,
						email2: req.body.email2
							
				};
				console.log("DATA Delete "+JSON.stringify(myobj7));
				request.post(
						publicUrl + '/deleteRelationship',
						{
							json : myobj7
						},
						function(error, response, body) {
							if (!error && response.statusCode == 200) {
								console.log(body);
								console.log("Successfully Deleted the  in Neo4j.");
							} else {
								console.log("Error:"+error);
							}
						}
	
			     );
		
		
	//var query = {email : req.body.email };
	});
};

exports.modifyRelation = function(req, res) {
	MongoClient.connect(url, function(err, db) {
	
		if (err)
			throw err;
		var query = {
			$and : [ {
				userEmail : req.body.userEmail
			}, {
				email : req.body.email
			} ]
		};
		db.collection("Relations").remove(query, function(err, res) {
			if (err)
				throw err;
			else
			{	
				console.log("Relation Modified");
				var myobj7 = {
						email1: req.body.userEmail,
						email2: req.body.email,
							r1: req.body.yourRelation,
						    r2:req.body.theirRelation
				};
				request.post(
						publicUrl + '/modifyRelationship',
						{
							json : myobj7
						},
						function(error, response, body) {
							if (!error && response.statusCode == 200) {
								console.log(body);
								console.log("Successfully updated data in Neo4j.");
							} else {
								console.log("Error:"+error);
							}
						}
	
					);
			}
			
			db.close();
		});
	//var query = {email : req.body.email };
	});
};


exports.sankeyData = function(req, res) {
	console.log("In getRelationForGoogle");

	request.post(
			publicUrl + '/getRelationship',
		{
			json : {
				email : req.body.userEmail,
				type : 'sankey'
			}
		},
		function(error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(body);
				res.send(body);
			} else {
				console.log("BODY : " + body);
				console.log("Data for getRelationForGoogle sent Successfully");
			}
		}

	);

};

exports.getRelationForGoogle = function(req, res) {
	console.log("In getRelationForGoogle");

	request.post(
			publicUrl + '/getRelationship',
		{
			json : {
				email : req.body.userEmail,
				type : 'google'
			}
		},
		function(error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(body);
				res.send(body);
			} else {
				console.log("BODY : " + body);
				console.log("Data for getRelationForGoogle sent Successfully");
			}
		}

	);

};
exports.getRelationForGraphs = function(req, res) {
	console.log("In getRelationForGoogle");

	request.post(
			publicUrl + '/getHome',
		{
			json : {
				email : req.body.userEmail,
				type : 'home'
			}
		},
		function(error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(body);
				res.send(body);
			} else {
				console.log("BODY : " + body);
				console.log("Data for getRelationForGoogle sent Successfully");
			}
		}

	);
};

exports.relation = function(req, res) {
	console.log("In relation");
	MongoClient.connect(url, function(err, db) {
		console.log("In Mongo Save");
		if (err)
			throw err;

		var myobj1 = {
			userEmail : req.body.userEmail,
			firstname : req.body.fname,
			lastname : req.body.lname,
			email : req.body.email,
			yourRelation : req.body.yourRelation,
			theirRelation : req.body.theirRelation,
			city : req.body.city,
			country : req.body.country,
			zipCode : req.body.zipCode,
			Latitude : req.body.Latitude,
			Longitude : req.body.Longitude
		};
		var mongoDataSignup = {
				firstname : req.body.fname,
				lastname : req.body.lname,
				email : req.body.email,
				gender : req.body.gender,
				password : "dummy",
				city : req.body.city,
				country : req.body.country,
				zipCode : req.body.zipCode
			};
		console.log(JSON.stringify(mongoDataSignup));
		var query = {email: req.body.email }
		
		db.collection("User").find(query).toArray(function(err, res) {
			console.log("LENGTH : " + JSON.stringify(res));
			if (err)
				throw err;
			else if(res.length == 0)
			{
				db.collection("User").insert(mongoDataSignup, function(err, res) {
					if (err)
						throw err;
					else
					{
							db.collection("Relations").insertOne(myobj1, function(err, res) {
								if (err)
									throw err;
								else {
									console.log("inserted one reltaion");
									var fname = {
										fname : req.body.fname
									};
									var d = {
										email1 : req.body.userEmail,
										email2 : req.body.email,
										r1 : req.body.yourRelation,
										r2 : req.body.theirRelation,
										createNode: 'true',
										fname : req.body.fname,
										lname : req.body.lname,
										city : req.body.city,
										Latitude : req.body.Latitude,
										Longitude : req.body.Longitude
									};
									
									request.post(
											publicUrl + '/createRelationship',
										{
											json : d
										},
										function(error, response, body) {
											if (!error && response.statusCode == 200) {
												console.log(body);
												console.log("In signup grpah database");
											} else {
												console.log(body);
												console.log("Relation cannot be created");
											}
										}
					
									);
					
								}
					
								db.close();
							});
				} // End of the Else part
				}); // End of inserting data in mongo db
			} else {
				console
				db.collection("Relations").insertOne(myobj1, function(err, res) {
					if (err)
						throw err;
					else {
						console.log("inserted one reltaion");
						var fname = {
							fname : req.body.fname
						};
						var d = {
							email1 : req.body.userEmail,
							email2 : req.body.email,
							r1 : req.body.yourRelation,
							r2 : req.body.theirRelation,
						};
						
						request.post(
								publicUrl + '/createRelationship',
							{
								json : d
							},
							function(error, response, body) {
								if (!error && response.statusCode == 200) {
									console.log(body);
									console.log("In signup grpah database");
								} else {
									console.log(body);
									console.log("Relation sent Successfully");
								}
							}
		
						);
		
					}
		
					db.close();
				});
			}
		}); //End of finding data in mongo db
	});
};


exports.signUp = function(req, resp) {
	var d1 = {
	     	email2 : req.body.email
	};
		
	    MongoClient.connect(url, function(err, db) {
		console.log("In Mongo Save");
		var myobj1 = {
				firstname : req.body.fname,
				lastname : req.body.lname,
				email : req.body.email,
				password : req.body.pwd,
				gender : req.body.gender,
				city : req.body.city,
				country : req.body.country,
				zipCode : req.body.zipCode
		};
		
		if (err)
			throw err;
		var email1 = req.body.email;
		console.log("Email"+email1);
		var query =
		{
			$and : [ {
				email : email1
			}, {
				password : "dummy"
			} ]
		};
		console.log("Query : " + JSON.stringify(query));
		db.collection("User").find(query).toArray(function(err, res) {
			console.log("LLLLLL : " + res.length)
			if (err)
				{
				console.log("In error");
				throw err;
				}
			else if(res.length == 1)
			{
				//Update in Mongo and Neo4j if user not signed up but Node is created by adding relationship
				db.collection("User").update(
						{'firstname':res[0].firstname,'lastname':res[0].lastname,'email':res[0].email,
							'password':res[0].password,'gender':res[0].gender,'city':res[0].city,
							'country':res[0].country,'zipCode':res[0].zipCode
							},{$set:{'firstname':req.body.fname,'lastname':req.body.lname,'email':req.body.email,
								'password':req.body.pwd,'gender':req.body.gender,'city':req.body.city,
								'country':req.body.country,'zipCode':req.body.zipCode}}, function(err, res) {
									if (err)
										throw err;
									else {
										var myobj7 = {
												fname : req.body.fname,
												lname : req.body.lname,
												email : req.body.email,
												password : req.body.pwd,
												gender : req.body.gender,
												city : req.body.city,
												country : req.body.country,
												zipCode : req.body.zipCode,
												Latitude   : req.body.Latitude,
												Longitude   : req.body.Longitude
										};
										var flag = false;
										request.post(
												publicUrl + '/modifyNode',
												{
													json : myobj7
												},
												function(error, response, body) {
													if (!error && response.statusCode == 200) {
														console.log(body);
														console.log("Successfully updated data in Neo4j.");
														flag = true;
														resp.send({
															statuscode : '200'
														});
													} else {
														console.log("Error");
														resp.send({
															statuscode : '500'
														});
													}
												}
											);
									}
								});
				
				
			       
			}
			else
			{
				db.collection("User").insertOne(myobj1, function(err, res) {
					if (err)
						throw err;else {
						console.log("1 document inserted");
						var d = {
							fname : req.body.fname,
							lname : req.body.lname,
							email : req.body.email,
							Latitude : req.body.Latitude,
							Longitude : req.body.Longitude,
							city : req.body.city
						};
						console.log(req.body);
						var flag = false;
						request.post(
								publicUrl + '/create',
							{
								json : d
							},
							function(error, response, body) {
								if (!error && response.statusCode == 200) {
									console.log(body);
									console.log("In signup grpah database");
									flag = true;
									resp.send({
										statuscode : '200'
									});
								} else {
									console.log("Error");
									resp.send({
										statuscode : '500'
									});
								}
							}

						);

					}

					db.close();

				});
				
			}//End of else
		});
     });
};

exports.login = function(req, res) {
	var data = [];
	MongoClient.connect(url, function(err, db) {
		if (err)
			throw err;
		var emailaddress = req.body.email;
		var password = req.body.pwd;
		var query = {
			$and : [ {
				email : emailaddress
			}, {
				password : password
			} ]
		};
		db.collection("User").find(query).toArray(function(err, result) {
			console.log(JSON.stringify(result));
			console.log("length" + result.length);
			if (err) {
				data.push({
					statusCode : '404'
				})
				throw err;
			} else if (result.length > 0) {
				data.push({
					user : result,
					statusCode : '200'
				})
			} else {
				data.push({
					statusCode : '404'
				})
			}
			console.log(result);
			db.close();
			console.log("Data : " + data)
			res.send(data);
		});
	});
};

exports.graphData = function(req, res) {
	var email1 = req.params.email;
	request.post(
			publicUrl + '/getRelationship',
			{
				json : {
					email : email1,
					type : 'sankey'
				}
			},
			function(error, response, body) {
				if (!error && response.statusCode == 200) {
					console.log(body);
					res.send(body);
				} else {
					console.log("BODY : " + body);
					console.log("Data for getRelationForGoogle sent Successfully");
				}
			}

		);
};


