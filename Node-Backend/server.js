//Imports
const bodyParser = require("body-parser");
const express = require('express');
const app = express();
const port = 5000;


//Importing Routes
const authRoute = require('./routes/authorization/authorization');
const tokenRoute = require('./routes/authorization/newtoken');
const loginRoute = require('./routes/authentication/login');
const registerRoute = require('./routes/authentication/register');
const forgotRoute = require('./routes/authentication/forgotpassword');
const updateRoute = require('./routes/authentication/updatepassword');
const categoriasRoute = require('./routes/categorias');
const subcategoriasRoute = require('./routes/subcategorias');
const despesasRoute = require('./routes/despesas');



//Middlewares for parser information
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Middleware auth defined below 
//Always use this middleware for ALL ROUTES except Login, Register and ForgotPassword
//This route authenticats the user's token
app.use('/auth', authRoute);

//Route for creating new tokens is the ones that user has are invalid
app.use('/newtoken', tokenRoute);

//Middlewares for routes
app.use('/login', loginRoute);
app.use('/register', registerRoute);
app.use('/forgotpassword', forgotRoute);

//Middleware for user actions inside the application
app.use('/auth/updatepassword', updateRoute);
app.use('/auth/categoria', categoriasRoute);
app.use('/auth/subcategoria', subcategoriasRoute);
app.use('/auth/despesa', despesasRoute);




//In Login the accessToken is stored in cookie and refreshToken in Database
//When making an API call user needs to access the cookie and send the token along with every request made





app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})





