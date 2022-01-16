const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { masterPool } = require('../../database');



router.post('/', (req, res) => {

    let Email = req.body.email;

    //Function that send the email with the "code" needed to allow user to access route for creating a new password
    ForgotPassword(Email, res);

});






async function ForgotPassword(Email, res) {
    EmailExists = false;

    // Checking if there's an account associated with that email
    let sqlEmail = "SELECT Email FROM users";
    let ResultEmail = await new Promise((resolve, reject) => masterPool.query(sqlEmail, (err, resultEmail) => {

        if (err) {
            reject(err);
        } else {
            resolve(resultEmail);

            limit = resultEmail.length;
            //Cheking if email exists in Database
            for (let i = 0; i < limit; i++) {
                if (Email == resultEmail[i].Email) {
                    EmailExists = true;
                }
            }
        }
    }));

    if (EmailExists) {
        //Call function
        EmailGenerator(Email, res);
    } else {
        //Email doesn't Exist
        res.json("No Email");
    }
}





//Send Email with confirmation code(4 digit)
async function EmailGenerator(Email, res) {
    //Create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
            user: 'braxton.aufderhar87@ethereal.email', // generated ethereal user
            pass: 'RAYr63hFtNjQ23xmdr', // generated ethereal password
            //Name: Braxton Aufderhar
        },
    });

    //GENERATE RONDOM 4 DIGIT CODE

    let val = Math.floor(1000 + Math.random() * 9000);
    console.log(val);

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Ai-keu-guito" <braxton.aufderhar87@ethereal.email>', // sender address
        to: "braxton.aufderhar87@ethereal.email", // list of receivers
        subject: "Change Account Password", // Subject line
        text: "No seguimento do processo de pedido de alteração da palavra-chave do utilizador '" + Email + "' deverá inserir o seguinte código na sua aplicação '" + val + "'", // plain text body
    });
    //Send code to Front-End and Compare the userInput code with the one generated (val)
    res.json(val);
}




module.exports = router;
