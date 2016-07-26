var mongoose = require( 'mongoose' );
var Userlogin = mongoose.model( 'login' );
var TechnologyData = mongoose.model( 'technology' );
var IndustryData = mongoose.model( 'industry' );
var caseStudy = mongoose.model( 'casestudy' );

 exports.loginEmployee =function(req,res){

                  var user_name=req.body.username;                  
                  var pass_code=req.body.password;  


                    // fetch user and test password verification
              Userlogin.findOne({ username: user_name }, function(err, user) {
              if (err) throw err;
                 var data=user;
                  if(data!=null){
                   if(user_name == data.username & pass_code == data.password){
                    message="Login Successful";
                    console.log(message);
                    res.status(201).send(message);  
                    return;
                      }
                  }  
                  else{
                   
                    message="ERROR : Bad Request, Invalid value ";
                    console.log(message);
                    res.status(400).send(message); 
                    // alert("Invalid username or password");

                  } 
              });            

              }
       
	exports.getTechnology=function(req,res){

                              TechnologyData.find({}, function(err, records){
                            
                                      if(err){
                                        console.log(err);
                                        res.status(500).send("Error Occured while fetching data from technology schema");
                                        return;
                                      }else{
                                        var data=records;
                                        res.status(200).send(data);
                                      }

                              }); 

                            }

exports.getDoamin=function(req,res){

                              IndustryData.find({}, function(err, records){
                            
                                      if(err){
                                        console.log(err);
                                        res.status(500).send("Error Occured while fetching data from technology schema");
                                        return;
                                      }else{
                                        var data=records;
                                        res.status(200).send(data);
                                      }

                              }); 

                            }

exports.getDashboard=function(req,res){
  
                  caseStudy.find({},function(err, records){                            
                                      if(err){
                                        console.log(err);
                                        res.status(500).send("Error Occured while fetching data from caseStudy schema");
                                        return;
                                      }else{
                                        var data = records;
                                      //  console.log("data check :: "+data);
                                        res.status(200).send(data);
                                      }

                              });
                             
                            }


exports.getDashboardParamDomainId=function(req,res){
   var domain =req.params.domainId;
   
                              caseStudy.find({industry: domain}, function(err, records){                            
                                      if(err){
                                        console.log(err);
                                        res.status(500).send("Error Occured while fetching data from caseStudy schema");
                                        return;
                                      }else{
                                        var data = records;
                                        console.log("data check :: "+data);
                                        res.status(200).send(data);
                                      }

                              }); 
                            }

exports.getDashboardParamTechId=function(req,res){
   var tech =req.params.techId;
   
                              caseStudy.find({technology: tech}, function(err, records){                            
                                      if(err){
                                        console.log(err);
                                        res.status(500).send("Error Occured while fetching data from caseStudy schema");
                                        return;
                                      }else{
                                        var data = records;
                                        res.status(200).send(data);
                                      }

                              }); 
                            }

exports.getDashboardParamTechAndDomain=function(req,res){
  var domain =req.params.domainId;
  // console.log("domain : "+domain);
   var tech =req.params.techId;
  // console.log("tech : "+tech);
   
  // find({$and:[]})
                              caseStudy.find({$and:[{industry: domain},{technology: tech}]}, function(err, records){                            
                                      if(err){
                                        console.log(err);
                                        res.status(500).send("Error Occured while fetching data from caseStudy schema");
                                        return;
                                      }else{
                                        var data = records;
                                        res.status(200).send(data);
                                      }

                              }); 
                            }

                            //
exports.getDashboardParamTechAndDomainTest=function(req,res){
  var domain =req.params.domainId;
  var tech =req.params.techId;

                              caseStudy.find({$and:[{technology: tech},{industry: domain}]}, function(err, records){                            
                                      if(err){
                                        console.log(err);
                                        res.status(500).send("Error Occured while fetching data from caseStudy schema");
                                        return;
                                      }else{
                                        var data = records;
                                        res.status(200).send(data);
                                      }

                              }); 
                            }
                         

exports.getUpload=function(req,res){
                  var tech=req.body.selectedTechnology;
                  var domain =req.body.selectedDomain;                  
                  var tittle=req.body.title;
                  var description=req.body.description;
                  var image = req.body.myImageFile;
                  

                  console.log( '/' +tech+'/' +domain+'/'+image );
                  var pdf = req.body.myPdfFile;


                  console.log( '/' +tech+'/' +domain+'/'+pdf );

                  var newcaseStudy=new caseStudy();
                  newcaseStudy.technology=tech;
                  newcaseStudy.industry=domain;
                  newcaseStudy.title=tittle;
                  newcaseStudy.description=description;
                  /*newcaseStudy.imgurl=image;
                  newcaseStudy.pdfurl=pdf;*/
                  

                  newcaseStudy.save(function(err,savedCaseStudy){
                       if(err){
                          var message="Error occured while storing new CaseStudy !!!";
                          console.log(message+"\n"+err);
                          res.status(500).send(message);
                        }else{
                         res.status(201).send(savedCaseStudy);
                          }
                 });


                             
    }

			  
			  

