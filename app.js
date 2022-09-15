const express = require('express');
const path = require('path');
const app = express();

const formSelectData = {
    personSelect:       [],
    deviceTypeSelect:   [],
    osTypeSelect:       []
}

///////////CONFIG SECTION////////////////
//set view engine for html files to EJS
app.set('view engine', 'ejs');
app.listen(process.env.PORT || 3000);

//enable form data to be passed to request object (req.body)
app.use(express.urlencoded({ extended: true}));
//make /css and /js folders public and bind bootstrap css and js files to respective folders path. This way bootstrap files can be accesed as if they were in /css or /js folders instead of in node_modules/bootstrap folder.
app.use(express.static(path.join(__dirname, '/css')));
app.use(express.static(path.join(__dirname, '/js')));

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));

///////////DATABASE SECTION////////////////
/* QUERIES */
//Queries for dropdown elements' values: 
var getPeople = 'SELECT personID, CONCAT(name, " ", surname, " ") AS full_name FROM People';
var getDevices = 'SELECT * FROM Devices';
var getOperatingSystems = 'SELECT * FROM Operating_systems';

//Query to get main data regarding assigned asset tags
var getAssignedAssetTags = 'SELECT * FROM Assigned_asset_tags';

/*
Add middleware to handle data connection and queries and then pass the formSelectData object to main app.get handler for index page
*/



app.get('/', (req, res) => {
    async function getFormData(){
        const mysql = require('mysql2/promise');
        const connection = await mysql.createConnection({
            host: "clwxydcjair55xn0.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
            user: "weqcz7ybhjgjpkq5",
            password: "dj2h23uuunx5zv2k",
            database: "azpbmm9eebeqhok1"
          });
          
        var [rows, fields] = await connection.execute(getPeople);
        formSelectData.personSelect = rows;

        var [rows, fields] = await connection.execute(getDevices);
        formSelectData.deviceTypeSelect = rows;
    
        var [rows, fields] = await connection.execute(getOperatingSystems);
        formSelectData.osTypeSelect = rows;


        var [rows, fields] = await connection.execute(getAssignedAssetTags);
        var assignedAssetsTags = rows;

        //strip date format from time data and convert it into stirng.
        assignedAssetsTags.forEach(element => {
            element.date_bought = element.date_bought.toISOString().slice(0, 10);
            if(element.date_decommissioned != null){
                element.date_decommissioned = element.date_decommissioned.toISOString().slice(0, 10);
            }   
        });

       
        await connection.end();
        res.render('index' , {formSelectData: formSelectData, assignedAssetsTags: assignedAssetsTags});
      }
    
      getFormData();
});

app.post('/', (req, res) => {
    var formData = req.body;
    console.log(formData);


    //check if data  include special characters or 'placeholder' values (i.e.: if form options from dropdowns were actually selected). 
        //If even 1 option was not selected or special characters were found, abort and redirect back 
            var charSet = /[!@#$%^&*()_+\=\[\]{};'"\\|,<>\/?]+/;

            for (const [key, value] of Object.entries(formData)){
                if(value == 'placeholder' || charSet.test(value)){
                    console.log('DENIED');
                    return res.redirect('/');
                }
              }

    //reconstruct tag
    var assetTag = formData.tagLocation + `-` + formData.tagDeviceType + `-` + formData.tagID;

    //parse empty values of date_decommissioned input so that null value can be stored in database
    if(formData.dateDecommissioned == '' || formData.dateDecommissioned == ' ' || formData.dateDecommissioned == 'empty'){
        formData.dateDecommissioned = null;
    }


    switch (formData.action) {
        case 'Add':
            async function addData(){
                const mysql = require('mysql2/promise');
                const connection = await mysql.createConnection({
                    host: "clwxydcjair55xn0.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
                    user: "weqcz7ybhjgjpkq5",
                    password: "dj2h23uuunx5zv2k",
                    database: "azpbmm9eebeqhok1"
                  });

                                //querry
                var addQuery = `INSERT INTO Assigned_asset_tags (asset_tag, personID, date_bought, date_decommissioned, deviceID, osID) VALUES (${mysql.escape(assetTag)}, ${mysql.escape(formData.person)}, ${mysql.escape(formData.dateBought)}, ${mysql.escape(formData.dateDecommissioned)}, ${mysql.escape(formData.deviceType)}, ${mysql.escape(formData.osType)})`;

                await connection.execute(addQuery);

                await connection.end();
                res.redirect('/');
              }
            
              addData();

            console.log('added');
            break;
        case 'Update':

            async function updateData(){
                const mysql = require('mysql2/promise');
                const connection = await mysql.createConnection({
                    host: "clwxydcjair55xn0.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
                    user: "weqcz7ybhjgjpkq5",
                    password: "dj2h23uuunx5zv2k",
                    database: "azpbmm9eebeqhok1"
                  });

                                //querry
              var updateQuery = `UPDATE Assigned_asset_tags SET 
              asset_tag = ${mysql.escape(assetTag)}, 
              personID = ${mysql.escape(formData.person)}, 
              date_bought = ${mysql.escape(formData.dateBought)}, 
              date_decommissioned = ${mysql.escape(formData.dateDecommissioned)}, 
              deviceID = ${mysql.escape(formData.deviceType)},
              osID = ${mysql.escape(formData.osType)}
                  WHERE assigmentID = ${mysql.escape(formData.assigmentID)}`;
                  
                 await connection.execute(updateQuery);
        
               
                await connection.end();
                res.redirect('/');
              }
            
              updateData();

            console.log('updated');
            break;
    
        case 'Delete':

            async function deleteData(){
                const mysql = require('mysql2/promise');
                const connection = await mysql.createConnection({
                    host: "clwxydcjair55xn0.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
                    user: "weqcz7ybhjgjpkq5",
                    password: "dj2h23uuunx5zv2k",
                    database: "azpbmm9eebeqhok1"
                  });

         
              var deleteQuery = `DELETE FROM Assigned_asset_tags WHERE assigmentID = ${mysql.escape(formData.assigmentID)}`;
                  
                 await connection.execute(deleteQuery);
        
               
                await connection.end();
                res.redirect('/');
              }
            
              deleteData();

            console.log('deleted');
            break;

        default:
            res.redirect('/');
            break;
    }
});