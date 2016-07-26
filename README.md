### Case-Study-Tool

Step 1: Install git
Step 2: Get the project from the bibucket using command "git clone bitbucketUrl".

Step 3: Install mongodb,and start mongoDb with "mongod" command from bin path.

Step 4: Install node modules in the path of package.json file(under project folder), 
		To install using command "npm install"

Step 5: To install the bower modules in the path of bower.json file(under public folder),
		To install using command "bower –g install"		

Step 5: To start the project from project folder using command "node app.js"

 
Step7:  In our local browser, Go To Url "localhost:3000" to access the page.
		Hit Url BackEnd collections will created automatically.

Step8:  Before login, create login credientials in the mongodb "logins" collection.
		Likewise, create records/documents in below collections
		casestudies collection,
		industries collection,
		technologies collection
 
Step9:  Now we can login into webpage using these credintails.
Example:
"username" : "admin",
"password" : "admin"

Step11: After logged in , we will see the dashboard page. It contains all uploaded case study images.

Step12: Using filters, we can filter the case studies based on technology list box or industry list box.

Step13:  There will be two more buttons on the case study page. One for "upload" the case study and another one for "logout".

Step14: In upload  page, we can upload the case study.

Step 15: In that we have , technology,industry,tittle,description,image and pdf field.
  From that we can give apporatite details to submit the case study.
  After submitting, it will show in the dashboard.
  
Step16: Upload page we having back button to go back to dashboard page.
