const express = require('express');
const router = express.Router();
const { masterPool } = require('../database');


//Get User's Categories
router.get('/', (req, res) => {

    //Id of user
    //Gotten from token
    let UserId = req.user.Id;

    let GetStuff = GetCategorias(UserId, res);

    GetStuff.then(function () {
        console.log("Successeful Execution of Request!");
    }).catch(function () {
        console.log("Something Went Wrong!")
    });
});


//Add Category
router.post('/adicionar', (req, res) => {

    //Id of user
    //Gotten from token
    let UserId = req.user.Id;

    //Name of Category
    //Requested from user
    let Nome = req.body.nome;

    let AddCat = AddCategory(UserId, Nome, res);

    //Calling Function
    AddCat.then(function () {
        console.log("Successeful Execution of Request!");
    }).catch(function () {
        console.log("Something Went Wrong!")
    });
});



//Edit Category
router.post('/editar', (req, res) => {

    //Id of user
    //Gotten from token
    let UserId = req.user.Id;

    //Requested from user
    let Nome = req.body.nome;
    let New = req.body.new;

    let EditCat = EditCategoria(UserId, Nome, New, res);
    //Calling Function
    EditCat.then(function () {
        console.log("Successeful Execution of Request!");
    }).catch(function () {
        console.log("Something Went Wrong!")
    });
});



//Delete Category
router.post('/eliminar', (req, res) => {

    //Id of user
    //Gotten from token
    let UserId = req.user.Id;

    //Name of Category
    //Requested from user
    let Nome = req.body.nome;

    let DelCat = DelCategory(UserId, Nome, res);
    //Calling Function
    DelCat.then(function () {
        console.log("Successeful Execution of Request!");
    }).catch(function () {
        console.log("Something Went Wrong!")
    });
});







/**
 * -------------------------------------------------------------------------------------------
 *                                   FUNCTIONS
 * -------------------------------------------------------------------------------------------
 */


async function GetCategorias(UserId, res) {

    let CategoriasExist = false;
    let Values = []

    //Get Categorias existentes na base de dados
    let sql = "SELECT Id, Nome, IdUser FROM categoria";

    let ResultCategoria = await new Promise((resolve, reject) => masterPool.query(sql, (err, result) => {

        if (err) {
            reject(err);
        } else {
            resolve(result);

            limit = result.length;

            //Cheking if Categoria exists in Database
            for (let i = 0; i < limit; i++) {
                if (UserId == result[i].IdUser) {
                    CategoriasExist = true
                    Values.push(result[i])
                }
            }
        }
    }));

    if (CategoriasExist) {
        res.json(Values);
    } else {
        res.json("Utilizador nao tem categorias")
    }
}


//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------


async function AddCategory(UserId, Nome, res) {

    let CategoriaExist = false;

    //Get Categorias existentes na base de dados
    //Para impedir repetição de categorias
    let sqlCategoria = "SELECT Nome, IdUser FROM categoria";

    let ResultCategoria = await new Promise((resolve, reject) => masterPool.query(sqlCategoria, (err, result) => {

        if (err) {
            reject(err);
        } else {
            resolve(result);

            limit = result.length;
            //Cheking if Categoria exists in Database
            for (let i = 0; i < limit; i++) {
                if (Nome == result[i].Nome && UserId == result[i].IdUser) {
                    CategoriaExist = true;
                }
            }
        }
    }));


    if (CategoriaExist) {
        console.log("ja existe categoria com esse nome");
        res.json("Ja Existe Categoria Com Esse Nome")
    } else {
        //Insert Categoria in Database
        let sqlInsertCategoria = "INSERT INTO categoria (Nome, IdUser) VALUES ('" + Nome + "', '" + UserId + "')";

        masterPool.query(sqlInsertCategoria, (err, result) => {
            if (err) throw err;
            console.log("Categoria Added To DataBase");
            res.json("Categoria adicionada");
        });
    }
}


//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------


async function EditCategoria(UserId, Nome, New, res) {

    CategoriaExist = false;

    //Getting despesas From DB
    let sql = "SELECT IdUser, Nome FROM categoria";

    let results = await new Promise((resolve, reject) => masterPool.query(sql, (err, result) => {
        if (err) {
            reject(err);
        } else {
            resolve(result);
            //Storing Values in Array
            limit = result.length;


            //Getting 
            for (let i = 0; i < limit; i++) {

                console.log(result[i].IdUser)
                console.log(result[i].Nome)
                if (UserId == result[i].IdUser && Nome == result[i].Nome) {
                    CategoriaExist = true;
                    sqlDel = "UPDATE categoria SET Nome ='" + New + "' WHERE IdUser ='" + UserId + "' AND Nome ='" + Nome + "'";

                    masterPool.query(sqlDel, (err, result) => {
                        if (err) throw err;
                    });

                }
            }
        }
    }));

    if (CategoriaExist) {
        res.json("Categoria Updated ")
    }
    else {
        res.json("Categoria nao existe")
    }
}


//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------


async function DelCategory(UserId, Nome, res) {

    CategoriaExist = false;

    //Getting despesas From DB
    let sql = "SELECT IdUser, Nome FROM categoria";

    let results = await new Promise((resolve, reject) => masterPool.query(sql, (err, result) => {
        if (err) {
            reject(err);
        } else {
            resolve(result);
            //Storing Values in Array
            limit = result.length;


            //Getting 
            for (let i = 0; i < limit; i++) {

                if (UserId == result[i].IdUser && Nome == result[i].Nome) {
                    CategoriaExist = true;

                    sqlDel = "DELETE FROM categoria WHERE IdUser ='" + UserId + "' AND Nome ='" + Nome + "' ";

                    masterPool.query(sqlDel, (err, result) => {
                        if (err) throw err;
                    });

                }
            }
        }
    }));

    if (CategoriaExist) {
        res.json("Categoria Eliminada")
    }
    else {
        res.json("Categoria nao existe")
    }

}






module.exports = router;