const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const { masterPool } = require('../../database');

router.post('/', (req, res) => {


    let Email = req.body.email;
    console.log(Email)
    let Conf = req.body.conf;
    console.log(Conf)
    let Newpassword = req.body.newpassword
    console.log(Newpassword)

    //Function that send the email with the "code" needed to allow user to access route for creating a new password
    changepassword(Email,Conf,Newpassword, res);

});


async function changepassword(Email,Conf,Newpassword, res) {

    if(Conf=="Confirme"){
        const saltRounds = 10;
        bcrypt.hash(Newpassword, saltRounds, function (err, hash) {

            //Insert In DataBase
            let sqlUpdatePassword = "UPDATE Users SET Password = '" + hash + "' WHERE Email = '" + Email + "' ";

            masterPool.query(sqlUpdatePassword, (err, result) => {
                if (err) throw err;
                console.log(result)
                res.json("Password Updated");
            });
        });
    }
    else{
        res.json("Password didn't uptdate");
    }

    
}

module.exports = router;