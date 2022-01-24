const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { masterPool } = require('../../database');

//Gets Called to make new token if the previews one has expired
router.post('/', async (req, res, next) => {

    //Initiating variables
    let RefreshToken;
    let UserData;

    //Dar Request ao header
    const authHeader = req.headers['authorization'];
    //Getting token
    const token = authHeader && authHeader.split(' ')[1];

    //Getting User's id from expired Token to go to the DB get RefreshToken
    let UserId = jwt.decode(token).Id;



    //Getting User's Refresh Token
    let sqlRefreshToken = "SELECT RefreshToken FROM users WHERE  Id = '" + UserId + "'"
    //Making call to DB for RefreshToken
    let ResultsDB = await new Promise((resolve, reject) => masterPool.query(sqlRefreshToken, (err, result) => {
        if (err) {
            reject(err);
        } else {
            resolve(result);
            //Storing value in RefreshToken
            RefreshToken = result[0].RefreshToken;
        }
    }));

    //Verify RefreshToken
    jwt.verify(RefreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, data) => {
        if (err) {
            //If RefreshToken has expired user has to login again
            res.status(403).json("Expired Refresh Token");
        } else {
            //Create UserData Object
            UserData = {
                "username": data.username,
                "Id": data.Id
            }
            //Creating new token
            const accessToken = jwt.sign(UserData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5s' });//-----Change 5m(60*5) cause that means 5 months 

            //Giving new token to user
            res.json({
                accessToken: accessToken
            });
        }
    })
});





module.exports = router;