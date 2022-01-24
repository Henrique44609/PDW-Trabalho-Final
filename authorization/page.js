const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/', (req, res)=> {

    //Dar Request ao header
    const authHeader = req.headers['authorization'];

    //Check bearer/token is undefined
    if (typeof authHeader !== 'undefined') {
        //Get Token
        const token = authHeader && authHeader.split(' ')[1];


        //Verify Token's validity
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (expired, UserData) => {
            if (expired == "TokenExpiredError: jwt expired") {
                console.log("Token has expired")
                //Forbidden Access If Token is "Wrong"
                res.json("Access Token expired")

            } else if (expired == "JsonWebTokenError: invalid algorithm") {
                console.log("Invalid Token")
                res.json("Invalid Token")
            }
            //If token is valid
            //Using req.user in any request we can get user's information stored in the token
            res.json("aceite")
        });

    } else {
        //If Token undefined
        //Probably if this error occours it should redirect user to login
        //Because the most likly cause for the token to be undefined is because user cleared the localStorage/Cookies 
        res.json("There's something wrong with token");
    }
})
module.exports = router;