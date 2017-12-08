
//google.load('visualization', '1', {packages:['orgchart']});
var app = angular.module('appModule', ['ngRoute','ngMap','ngTouch','ngAnimate','ui.bootstrap']);

app.controller('myctrl', function ($scope, $http, $window) {
	 var userEmail = $window.localStorage.getItem('user');
	 $http({
	      method: 'POST',
	      data : {
			useremail: userEmail
		  },
	      url: '/chartdata'
	   }).then(function (success){
		  console.log("success"); 
		    $scope.chart = {
		      type: "OrgChart",
		      data: {
		          "cols" : [
		              {"label": "Name", "pattern": "", "type": "string"},
		              {"label": "Manager", "pattern": "", "type": "string"},
		              {"label": "ToolTip", "pattern": "", "type": "string"}
		          ], 
		          "rows" : [
		              {"c": [
		                  {"v": "1", "f": "Mike O."},
		                  {"v": ""},
		                  {"v": "The President"}
		              ]},
		              {"c": [
		                  {"v": "2", "f": "Jim"},
		                  {"v": "1"},
		                  {"v": "VP"}
		              ]},
		              {"c": [
		                  {"v": "3", "f": "Alice"},
		                  {"v": "1"},
		                  {"v": ""}
		              ]},
		              {"c": [
		                  {"v": "4", "f": "Bob"},
		                  {"v": "2"},
		                  {"v": "Bob Sponge"}
		              ]},
		              {"c": [
		                  {"v": "Carol"},
		                  {"v": "4"},
		                  {"v": ""}
		              ]}
		          ]
		        }
		    };
       },function (error){
          console.log("Error from Server "+error);
       });
	  
	});

app.directive('orgchart', function() {
	      return {
	        restrict: 'E',
	        link: function($scope, $elm) {

	          // Instantiate and draw our chart, passing in some options.
	          var chart = new google.visualization.OrgChart($elm[0]);
	          chart.draw($scope.orgChartData);
	        }
	    }
	 });



app.controller(
				'appController',
				function($scope, $http,  NgMap, $uibModal, $window) {
					
					$scope.show = false;
					$scope.signUpError = false;
					$scope.loginUpError = false;
					$scope.loginUpSuccess = false;
					$scope.loginError = false;
					$scope.emptyGraphs = false;
					$scope.openDeleteModal = function(){
						$scope.modalInstance = $uibModal.open({
						ariaLabelledBy: 'modal-title',
						ariaDescribedBy: 'modal-body',
						templateUrl: 'myDeleteModal.html',
						controller :'ModelHandlerController',
						controllerAs: '$ctrl',
						size: 'lg',
						resolve: {
						}
						});
					}
					
					$scope.signOut = function(){
						localStorage.removeItem('userName');
						localStorage.removeItem('user');
						localStorage.removeItem('pwd');
						window.location.assign("/");
						}
					
					 $scope.openModal = function(){
						 $scope.modalInstance = $uibModal.open({
						 ariaLabelledBy: 'modal-title',
						 ariaDescribedBy: 'modal-body',
						 templateUrl: 'myModal.html',
						 controller :'ModelHandlerController',
						 controllerAs: '$ctrl',
						 size: 'lg',
						 resolve: {
						 }
						 });
					 }
					
					 $scope.openModifyModal = function(){
							$scope.modalInstance = $uibModal.open({
							ariaLabelledBy: 'modal-title',
							ariaDescribedBy: 'modal-body',
							templateUrl: 'myModifyModal.html',
							controller :'ModelHandlerController',
							controllerAs: '$ctrl',
							size: 'lg',
							resolve: {
							}
							});
						}
					
				 $scope.loadGraph = function()
				 {
					var userEmail = $window.localStorage.getItem('user');
					$scope.user = $window.localStorage.getItem('userName');
					$http({
							method : "POST",
							data : {
								userEmail: userEmail
							},
							url : "/getRelationForGraphs"
						}).then(function (success){
							
							 console.log("Data from Server for Graph"+ JSON.stringify(success.data));
							 
							 if(success.data.nodes.length == '0')
								 {
								   $scope.emptyGraphs = true;
								   $scope.emptyGraphMsg = "No Relations to show";
								 }
							 var graphData = success.data;
							 var edgetype = {"edgeType":['Father','Mother','Son','Daughter','Brother','Sister','Spouse']};
							 var config = {
						              dataSource: graphData,
						              graphWidth: function() {return 870},
						              graphHeight: function() {return 550},
						              backgroundColor: "#ffffff",
						              nodeCaptionsOnByDefault: true,
						              caption: function(node){
						                  return node.caption;
						              },
						              edgeTypes: edgetype, 
						              nodeTypes: {"nodeType":['Father','Mother','Son','Daughter','Brother','Sister','Spouse']},
						        	      forceLocked: false,
						              nodeCaption: 'id',
						              edgeCaption: 'edgeType',
						              nodeStyle: {
						                    "Father": {
						                      "color"      : "Red",
						                      "radius"     : 15
						                    },
						                    "Sister":{
						                      "radius"     : 15
						                    },
						                    "Brother":{
							                      "radius"     : 15
							                },
							                "Daughter":{
							                	"color"      : "Green",
							                	     "radius"    :15
							                },
							                "Mother":{
							                	"color"      : "#F6F",
							                	     "radius"    :15
							                },
							                "Son":{
							                	"color"      : "Yellow",
							                	     "radius"    :15
							                },
							                "Spouse":{
							                	"color"      : "69149b",
							                	     "radius"    :15
							                }
						              },
						              edgeStyle: {
						                    "all" : {
						                    		"width": 6,
						                         "color": "#000000",
						                    		"line-style": "10,10,2,2",
						                      	"directed": true,
						                    }
						              }
						          };
						          alchemy = new Alchemy(config);
						  	 	 $scope.showGraph = true;

						   },function (error){
							  
							    console.log(error, 'can not get data.');
						   });
				   }
				 
					$scope.showSankey = true;
            
					$scope.changeView = function(viewName) {
						if (viewName == 'graph') {
							$scope.showGraph = true;
							$scope.showMap = false;
							$scope.showSankey = false;
						} else if (viewName == 'map') {
							$scope.showGraph = false;
							$scope.showMap = true;
							$scope.showSankey = false;
						} else if (viewName == 'sankey') {
							$scope.showGraph = false;
							$scope.showMap = false;
							$scope.showSankey = true;
						}
					}

					$scope.showModal = false;
					
					$scope.toggleModal = function() {
						$scope.showModal = !$scope.showModal;
					};
					$scope.signUp = function() {
						
						var address = $scope.city;
						   geocoder = new google.maps.Geocoder();
						    if (geocoder) {
						        geocoder.geocode({
						            'address': address
						        }, function (results, status) {
						            if (status == google.maps.GeocoderStatus.OK) {
						               console.log("lat lng "+JSON.stringify(results[0].geometry.location));
						               var a = JSON.stringify(results[0].geometry.location);
						               var b = JSON.parse(a);
						               console.log("Latitude "+b.lat);
						               console.log("Longitude "+b.lng);
							           	$http({
											method : "POST",
											data : {
												"fname" : $scope.fname,
												"lname" : $scope.lname,
												"email" : $scope.email,
												"pwd" : $scope.pwd,
												"gender" : $scope.gender,
												"city" : $scope.city,
												"country" : $scope.country,
												"zipCode" : $scope.zipCode,
												"Latitude" : b.lat,
												"Longitude" : b.lng
											},
											url : "/signUp"
										}).then(function (success){
											console.log("In mongo database");
											console.log("asdasd"+JSON.stringify(success.data.statuscode));
											if(success.data.statuscode == '200')
												{
												   $scope.signUpError = false;
												   $scope.signUpSuccess = true;
												   $scope.email ="";
												  $scope.pwd = "";
												  $scope.fname = "";
												  $scope.lname = "";
												  $scope.city = "";
												  $scope.country = "";
												  $scope.zipCode = "";
												  $scope.signUpMsg = "Sign-up Successfull. Please log-in to continue.";
												} else if(success.data.statuscode == '500'){
													$scope.signUpSuccess = false;
													 $scope.signUpError = true;
													 $scope.email ="";
													  $scope.pwd = "";
													  $scope.fname = "";
													  $scope.lname = "";
													  $scope.city = "";
													  $scope.country = "";
													  $scope.zipCode = "";
													 $scope.signUpMsg = "Error occurred during sign-up.";
												}
										
										  },function (error){
											    console.log(error, 'cannot get data.');
										   });
							            }
							           });
						 }
					}
					
					$scope.login = function() {
						$window.localStorage.setItem('user',  $scope.email);
						$window.localStorage.setItem('pwd', $scope.pwd);
						$http({
							method : "POST",
							data : {
								"email" : $scope.email,
								"pwd" : $scope.pwd
							},
							url : "/login"
						}).then(function (result){
							console.log("In mongo database : " + JSON.stringify(result));
							if(result.data[0].statusCode === '200') {
								$scope.user = result.data[0].user[0].firstname + " " + result.data[0].user[0].lastname;
								$window.localStorage.setItem('userName',  $scope.user);
								$window.localStorage.setItem('user',  result.data[0].user[0].email);
								$window.localStorage.setItem('pwd', result.data[0].user[0].pwd);
								$scope.loginUpSuccess = true;
								   $scope.loginError = false;
								 
								window.location.assign("/homePage");
							} 
							else
								{
								
								 $scope.loginError = true;
								    $scope.loginUpMsg = "Error occurred during log-in.";
								}
						  },function (error){
							    console.log(error, 'can not get data.');
							    $scope.loginError = true;
							    $scope.loginUpMsg = "Error occurred during log-in.";
						   });
					}
				});

			app.controller("ModelHandlerController",function($scope,$uibModalInstance,$http,$window){
				$scope.modalError = false;
				$scope.modalMsg = "Please enter all the fields!";
				
				$scope.deleteModalOk = function(){
					if($scope.emailR === undefined) {
						$scope.modalError = true;
					}else {
						$scope.modalError = false;
						var username = $window.localStorage.getItem('user');
					     
					     $http({
							method : "POST",
							data : {
								"email1" : username,
								"email2" : $scope.emailR
							},
							url : "/deleteRelation"
							}).then(function (success){
							console.log("relation sent");
							  },function (error){
							    console.log(error, 'can not post data.');
							   });
							      $uibModalInstance.close('save');
					}
				}
				
				$scope.cancel = function(){
					console.log("cancelAddModal");
						      $uibModalInstance.close('save');
						}


				$scope.deleteModalCancel = function(){
					console.log("cancelDeleteModal");
					$uibModalInstance.dismiss('close');
				}

				$scope.modifyModalOk = function(){
					if($scope.emailR === undefined, $scope.yourRelation === undefined, $scope.theirRelation === undefined){
						$scope.modalError = true;
					} else {
						$scope.modalError = false;
						var username = $window.localStorage.getItem('user');
					     
					     $http({
							method : "POST",
							data : {
							"userEmail": username,
							"email" : $scope.emailR,
							"yourRelation" : $scope.yourRelation,
							"theirRelation" : $scope.theirRelation
							},
							url : "/modifyRelation"
							}).then(function (success){
							console.log("relation sent");
							  },function (error){
							    console.log(error, 'can not post data.');
							   });
							      $uibModalInstance.close('save');
					}
				}
					$scope.modifyModalCancel = function(){
						console.log("cancelModifyModal");
						$uibModalInstance.dismiss('save');
					}
				     
				 $scope.ok = function(){
					
					 if($scope.finame === undefined,
								$scope.lsname  === undefined,
								$scope.emailR  === undefined,
								$scope.yourRelation  === undefined,
								$scope.theirRelation  === undefined,
								$scope.cityR  === undefined,
								$scope.countryR  === undefined,
								$scope.zipCodeR  === undefined
								) {
						 $scope.modalError = true;
					 } else {
						 $scope.modalError = false;
			     var username = $window.localStorage.getItem('user');
			     var address =  $scope.cityR;
				    // Initialize the Geocoder
		
				    geocoder = new google.maps.Geocoder();
				    if (geocoder) {
				        geocoder.geocode({
				            'address': address
				        }, function (results, status) {
				            if (status == google.maps.GeocoderStatus.OK) {
				               console.log("lat lng "+JSON.stringify(results[0].geometry.location));
				               var a = JSON.stringify(results[0].geometry.location);
				               var b = JSON.parse(a);
				               console.log("Latitude "+b.lat);
				               console.log("Longitude "+b.lng);
				               $http({
									method : "POST",
									data : {
										"userEmail": username,
										"fname" : $scope.finame,
										"lname" : $scope.lsname,
										"email" : $scope.emailR,
										"yourRelation" : $scope.yourRelation,
										"theirRelation" : $scope.theirRelation,
										"city" : $scope.cityR,
										"country" : $scope.countryR,
										"zipCode" : $scope.zipCodeR,
										"Latitude" : b.lat,
										"Longitude" : b.lng,
										"gender" : $scope.gender
									},
									url : "/relation"
								}).then(function (success){
									console.log("relation sent");
									
								  },function (error){
									    console.log(error, 'can not post data.');
								   });
				            }
				           });
				 }
				 $uibModalInstance.close('save');
				 }
				}
				});

			
	
			
			
			
			app.directive('myMap', function($http,$window) {
			    // directive link function
			    var link = function(scope, element, attrs) {
			        var map, infoWindow;
			        var markers = [];
			        
			        // map config
			        var mapOptions = {
			            center: new google.maps.LatLng(50, 2),
			            zoom: 2,
			            mapTypeId: google.maps.MapTypeId.ROADMAP,
			            scrollwheel: false
			        };
			        
			        // init the map
			        function initMap() {
			            if (map === void 0) {
			                map = new google.maps.Map(element[0], mapOptions);
			            }
			        }    
			        
			        // place a marker
			        function setMarker(map, position, title, content) {
			            var marker;
			            var markerOptions = {
			                position: position,
			                map: map,
			                title: title,
			                icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
			            };
			
			            marker = new google.maps.Marker(markerOptions);
			            markers.push(marker); // add marker to array
			            
			            google.maps.event.addListener(marker, 'click', function () {
			                // close window if not undefined
			                if (infoWindow !== void 0) {
			                    infoWindow.close();
			                }
			                // create new window
			                var infoWindowOptions = {
			                    content: content
			                };
			                infoWindow = new google.maps.InfoWindow(infoWindowOptions);
			                infoWindow.open(map, marker);
			            });
			        }
			        
			        // show the map and place some markers
			        initMap();
			        var userEmail = $window.localStorage.getItem('user');
			        $http({
						method : "POST",
						data : {		
							userEmail: userEmail
						},
						url : "/getRelationForGoogle"
					}).then(function (success){
						console.log("In Graph");
						console.log("Data from Server"+ JSON.stringify(success.data));
					/*
						
						var jso = [{ "lat":51.508515, "long":-0.125487, "city":"New York","name":"Rohit","relation":"Son"},
							{ "lat":52.370216, "long":4.895168, "city":"Amsterdam","name":"Rahul","relation":"Brother"},
							{ "lat":48.856614, "long":2.352222, "city":"Paris","name":"Raj","relation":"Father"}];
						console.log("Latitude "+jso[0].lat);*/
						var jso = success.data;
						for (var i = 0; i < jso.length; i++) {
							  console.log(JSON.stringify(jso[i]));
							  var a = jso[i].name + " : " + jso[i].relation ;
							  setMarker(map, new google.maps.LatLng(jso[i].lat, jso[i].long), jso[i].city, a);
					    }
						
					
					},function (error){
					    console.log(error, 'can not get data.');
					   });
			    };
			    
			    return {
			        restrict: 'A',
			        template: '<div id="map"></div>',
			        replace: true,
			        link: link
			    };
			});
			
			
