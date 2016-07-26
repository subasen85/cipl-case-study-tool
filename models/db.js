var chalk = require('chalk');
var mongoose = require( 'mongoose' ),
 Schema = mongoose.Schema,
    bcrypt = require('bcryptjs'),
    SALT_WORK_FACTOR = 10;

//var dbURI = 'mongodb://localhost/MEAN';

var dbURI =  'mongodb://mongodbadmin:mongodbadmin@ds023465.mlab.com:23465/cipl-case-study-db';


mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
  console.log(chalk.green('Mongoose connected to ' + dbURI));
});

mongoose.connection.on('error',function (err) {
  console.log(chalk.red('Mongoose connection error: ' + err));
});

mongoose.connection.on('disconnected', function () {
  console.log(chalk.red('Mongoose disconnected'));
});

var userloginSchema = new mongoose.Schema({
  username: {type: String, required: true, index: { unique: true }},
  password: {type: String}
}); 

mongoose.model( 'login', userloginSchema );


var TechnologySchema = new mongoose.Schema({
    technology: { type: String, required: true, index: { unique: true } }
});
mongoose.model( 'technology', TechnologySchema );


var IndustrySchema = new mongoose.Schema({
    domain: { type: String, required: true, index: { unique: true } }
});
mongoose.model( 'industry', IndustrySchema );

var case_study = new mongoose.Schema({
  title: {type: String, required: true, index: { unique: true }},
  industry:{ type: String },
  technology: { type: String },    
  description: { type: String },
  imgurl: { type: String },
  pdfurl: { type: String }
}); 
mongoose.model( 'casestudy', case_study );



