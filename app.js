'use strict';

var express=require('express');
var bodyParser=require('body-parser');

var app=express();
//multer import
var multer	=	require('multer');
var db=require('./models/db.js');
var routes=require('./routes/route.js');

var mongoose = require( 'mongoose' );
var caseStudy = mongoose.model( 'casestudy' );
var fs = require('fs');
var mkdirp = require('mkdirp');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.get('/', function(req,res) {
  res.sendFile('public/index.html');
});


app.post('/login',routes.loginEmployee);
app.get('/technology',routes.getTechnology);
app.get('/domain',routes.getDoamin);
app.get('/dashboard',routes.getDashboard);
app.get('/getDashboardParamDomainId/:domainId',routes.getDashboardParamDomainId);
app.get('/getDashboardParamTechId/:techId',routes.getDashboardParamTechId);
app.get('/getDashboardParamTechAndDomain/:domainId/:techId',routes.getDashboardParamTechAndDomain);
app.get('/getDashboardParamTechAndDomainTest/:techId/:domainId',routes.getDashboardParamTechAndDomain);
//app.post('/upload',routes.getUpload);



var port = process.env.PORT || 3000;

var server=app.listen(port,function(req,res){
    console.log("Catch the action at http://localhost:"+port);
});

//multer config starts
var storage	=	multer.diskStorage({
  destination: function (req, file, callback) {
  	 var dir =  __dirname+ '/public/uploads/'+req.body.selectedTechnology+'/'+req.body.selectedDomain;
     if (!fs.exists(dir))
     {
      mkdirp(dir, function (err) {
       if (err) console.error(err)
       else 
         callback(null, './'+dir);
      });
     }
    else
     {
      console.log("ERROR creating directory")
     }
  },  
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});

var upload = multer({ storage : storage }).array('userPhoto',2);

app.post('/upload',function(req,res){
	upload(req,res,function(err) {
		//console.log(req.body);
		//console.log(req.files);

		var tech=req.body.selectedTechnology;
        var domain =req.body.selectedDomain;                  
        var tittle=req.body.title;
        var description=req.body.description;
        var imgurl = '/' +tech+'/' +domain+'/'+req.files[0].originalname;
        var pdfurl = '/' +tech+'/' +domain+'/'+req.files[1].originalname;
        

        var newcaseStudy=new caseStudy();
        newcaseStudy.technology=tech;
        newcaseStudy.industry=domain;
        newcaseStudy.title=tittle;
        newcaseStudy.description=description;
        newcaseStudy.imgurl=imgurl;
        newcaseStudy.pdfurl=pdfurl;
                  

        
		if(err) {
			return res.end("Error uploading file.");
      res.redirect("/#/upload");
		}
    newcaseStudy.save(function(err,savedCaseStudy){
             if(err){
             var message="Error occured while storing new CaseStudy !!!";
                console.log(message+"\n"+err);
                res.status(500).send(message);
                }else{
                 res.redirect("/#/upload");
                 }
               });
	});
});
//multer config end







