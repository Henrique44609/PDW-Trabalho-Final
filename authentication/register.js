const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { masterPool } = require('../../database');






router.post('/', (req, res) => {

    let Name = req.body.name;
    let User = req.body.username;
    let Email = req.body.email;
    let Password = req.body.password;


    let Insert = insertDB(Name, User, Email, Password, res);

    Insert.then(function () {
        console.log("Successeful Execution of Request!");
    }).catch(function () {
        console.log("Something Went Wrong!")
    });
});





async function insertDB(name, username, email, password, res) {

    //First check if there's any user with the same username in DataBase
    //Then if there isn't INSERT in DB

    StoredValuesUserName = [];
    StoredValuesEmail = [];

    let limit;

    //True = 1
    //False = 0
    //Just initiating value that will with checked in the loop
    let UserExists = 1;
    let EmailExists = 1;

    //Getting UserNames From DB
    let sql = "SELECT UserName, Email FROM users;"

    let results = await new Promise((resolve, reject) => masterPool.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            reject(err);
        } else {
            resolve(result);
            //Storing Values in Array
            limit = result.length;
            //Getting Users
            for (let i = 0; i < limit; i++) {
                StoredValuesEmail.push(result[i].Email);
                StoredValuesUserName.push(result[i].UserName);
            }

        }
    }));

    //Checking if there's someone with the same username

    for (let j = 0; j < limit; j++) {
        if (StoredValuesUserName[j] == username) {
            console.log("User Already Exists in DB");
            UserExists = 0;
            res.json("Já existe um utilizador com esse Username");
        }
    }

    //Checking if there's someone with the same email

    for (let l = 0; l < limit; l++) {
        if (StoredValuesEmail[l] == email) {
            console.log("Email Already Exists in DB");
            EmailExists = 0;
            res.json("Já existe um utilizador com esse Email");
        }
    }



    /**
     * If User doesn't exist Execute Function
     */
    if (UserExists == 1 && EmailExists == 1) {
        insertValue(name, username, email, password, res);
    }

}

//--------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------


function insertValue(name, username, email, password, res) {

    const saltRounds = 10;
    NameValue = name;
    UsernameValue = username;
    EmailValue = email;
    PasswordValue = password;

    console.log("GOT HERE")

    //Hash Password
    bcrypt.hash(PasswordValue, saltRounds, function (err, hash) {


        console.log("Hash: ", hash);

        //Insert In DataBase
        let sql2 = "INSERT INTO users (Name, UserName, Email, Password) VALUES ('" + NameValue + "', '" + UsernameValue + "', '" + EmailValue + "', '" + hash + "')";

        masterPool.query(sql2, (err, result) => {
            if (err) throw err;
            console.log("Value Added To DataBase");
            res.json("Utilizador adicionado");
        });

    });

}



module.exports = router;