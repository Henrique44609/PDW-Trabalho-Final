const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { masterPool } = require('../../database');





router.post('/', (req, res) => {

    let User = req.body.username;
    let Password = req.body.password;


    let Login = LoginCheck(User, Password, res);

    Login.then(function () {
        console.log("Successeful Execution of Request!");
    }).catch(function () {
        console.log("Something Went Wrong!")
    });
});






async function LoginCheck(User, Password, res) {

    //ter que ir buscar primeiro todos os utilizadores para ver se ha algum na bd
    let GetPassword;
    let UserId;
    let UserInDb = false;

    //First Get The User

    let sqlUsers = "SELECT UserName FROM users";

    let ResultUsers = await new Promise((resolve, reject) => masterPool.query(sqlUsers, (err, resultUser) => {

        if (err) {
            reject(err);
        } else {
            resolve(resultUser);

            limit = resultUser.length;
            //Cheking if username exists in Database
            for (let i = 0; i < limit; i++) {
                if (User == resultUser[i].UserName) {
                    UserInDb = true;
                }
            }
        }
    }));

    /**
     * If User Exists then check if Password is the SAME
     * Else THROW a Message to Client Side informing the USER
     */

    if (UserInDb == true) {

        let sql = "SELECT UserName, Password, Id FROM users WHERE UserName = '" + User + "';"


        let ResultsDB = await new Promise((resolve, reject) => masterPool.query(sql, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
                GetPassword = result[0].Password;
                UserId = result[0].Id;
            }
        }));


        /**
         * Comparar as Passwords
         */

        bcrypt.compare(Password, GetPassword, async function (err, result) {

            if (result == true) {

                //Info that needs to be in the Tooken
                let userData = {
                    "username": User,
                    "Id": UserId
                }

                //Assinar Tokens
                const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20m' });//-----Change 5m(60*5) cause that means 5 months 
                const refreshToken = jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1y' });
                //accessToken is send back to the user
                //refreshToken is Stored in DataBase

                //Storing Refresh Token in Database
                let sqlToken = "Update users SET RefreshToken = '" + refreshToken + "' WHERE UserName = '" + User + "'"
                //Storing ...
                let ResultsDB = await new Promise((resolve, reject) => masterPool.query(sqlToken, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }));

                //Send Data back to user
                //Only send refreshToken back for debugging purposes

                res.json({
                    accessToken: accessToken,
                    
                });

            } else {
                //If Passwords Don't Match
                console.log("Login Denied!!");
                res.json("Login Denied");
            }
        });

    } else {
        res.json("Whoops Utilizador não existe");
    }
}





module.exports = router;