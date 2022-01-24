const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { masterPool } = require('../../database');


router.post('/', (req, res) => {
    //Requesting body.password from front-end
    const Password = req.body.password;

    //Getting Id from Token
    const UserId = req.user.Id;

    //Hash Password
    const saltRounds = 10;
    bcrypt.hash(Password, saltRounds, function (err, hash) {

        //Insert In DataBase
        let sqlUpdatePassword = "UPDATE Users SET Password = '" + hash + "' WHERE Id = '" + UserId + "' ";

        masterPool.query(sqlUpdatePassword, (err, result) => {
            if (err) throw err;
            res.json("Password Updated");
        });
    });


});




module.exports = router;
