const express = require('express');
const router = express.Router();
const { masterPool } = require('../database');





router.get('/', (req, res) => {

    //Id of user
    //Gotten from token
    let UserId = req.user.Id;
    console.log(UserId)
    //Requested from user
    let CatId = req.body.catid;


    let GetStuff = GetSubCategorias(UserId, CatId, res);

    GetStuff.then(function () {
        console.log("Successeful Execution of Request!");
    }).catch(function () {
        console.log("Something Went Wrong!")
    });
});




//Adding subcategory
router.post('/adicionar', (req, res) => {


    //Id of user
    //Gotten from token
    let UserId = req.user.Id;

    //Requested from user
    let Nome = req.body.nome;
    let IdCategoria = req.body.idc;


    let AddSubCat = AddSubCategory(UserId, Nome, IdCategoria, res);
    //Calling Function
    AddSubCat.then(function () {
        console.log("Successeful Execution of Request!");
    }).catch(function () {
        console.log("Something Went Wrong!")
    });
});



//Edit subcategory
router.post('/editar', (req, res) => {

    //Id of user
    //Gotten from token
    let UserId = req.user.Id;

    let Nome = req.body.nome;
    let Idc = req.body.idc;
    let New = req.body.new;

    let EditCat = EditSubCategoria(UserId, Nome, Idc, New, res);

    EditCat.then(function () {
        console.log("Successeful Execution of Request!");
    }).catch(function () {
        console.log("Something Went Wrong!")
    });
});



//Delete Subcategory
router.post('/eliminar', (req, res) => {

    //Id of user
    //Gotten from token
    let UserId = req.user.Id;

    //Requested from user
    let Nome = req.body.nome;
    let Idc = req.body.idc;


    let DeleCat = DelSubCategory(UserId, Nome, Idc, res);

    DeleCat.then(function () {
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


async function GetSubCategorias(UserId, CatId, res) {

    let SubCategoriasExist = false;
    let Values = []

    //Get Categorias existentes na base de dados
    let sql = "SELECT Id, IdC, IdUser, Nome  FROM subcategoria";

    console.log("HERE", UserId)

    let ResultSubCategoria = await new Promise((resolve, reject) => masterPool.query(sql, (err, result) => {

        if (err) {
            reject(err);
        } else {
            resolve(result);
            console.log(result)
            limit = result.length;

            //Cheking if Categoria exists in Database
            for (let i = 0; i < limit; i++) {
                if (UserId == result[i].IdUser && CatId == result[i].IdC) {
                    SubCategoriasExist = true
                    Values.push(result[i])
                }
            }
        }
    }));

    if (SubCategoriasExist) {
        res.json(Values);
    } else {
        res.json("Utilizador nao tem subcategorias")
    }
}


//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------


async function AddSubCategory(UserId, Nome, idc, res) {

    let SubCategoriaExist = false;

    //Get Categorias existentes na base de dados
    //Para impedir repeti????o de categorias
    let sqlSubCategoria = "SELECT Nome, IdUser, IdC FROM subcategoria";

    let ResultCategoria = await new Promise((resolve, reject) => masterPool.query(sqlSubCategoria, (err, result) => {

        if (err) {
            reject(err);
        } else {
            resolve(result);

            limit = result.length;
            //Cheking if Categoria exists in Database
            for (let i = 0; i < limit; i++) {
                if (Nome == result[i].Nome && UserId == result[i].IdUser && idc == result[i].IdC) {
                    SubCategoriaExist = true;
                }
            }
        }
    }));


    if (SubCategoriaExist) {
        console.log("ja existe subcategoria com esse nome");
        res.json("Ja Existe SubCategoria Com Esse Nome")
    } else {
        //Insert Categoria in Database
        let sqlInsertSubCategoria = "INSERT INTO subcategoria (Nome, IdUser, IdC) VALUES ('" + Nome + "', '" + UserId + "', '" + idc + "')";

        masterPool.query(sqlInsertSubCategoria, (err, result) => {
            if (err) throw err;
            console.log("SubCategoria Added To DataBase");
            res.json("SubCategoria adicionada");
        });
    }
}


//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------


async function EditSubCategoria(UserId, Nome, Idc, New, res) {

    CategoriaExist = false;

    //Getting despesas From DB
    let sql = "SELECT IdUser, Nome, IdC FROM subcategoria";

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
                if (UserId == result[i].IdUser && Nome == result[i].Nome && Idc == result[i].IdC) {
                    CategoriaExist = true;
                    sqlDel = "UPDATE subcategoria SET Nome ='" + New + "' WHERE IdUser ='" + UserId + "' AND Nome ='" + Nome + "' AND IdC ='" + Idc + "'";

                    masterPool.query(sqlDel, (err, result) => {
                        if (err) throw err;
                    });

                }
            }
        }
    }));

    if (CategoriaExist) {
        res.json("SubCategoria Updated ")
    }
    else {
        res.json("SubCategoria nao existe")
    }
}


//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------


async function DelSubCategory(UserId, Nome, Idc, res) {

    CategoriaExist = false;

    //Getting despesas From DB
    let sql = "SELECT IdUser, Nome, IdC FROM subcategoria";

    let results = await new Promise((resolve, reject) => masterPool.query(sql, (err, result) => {
        if (err) {
            reject(err);
        } else {
            resolve(result);
            //Storing Values in Array
            limit = result.length;


            //Getting 
            for (let i = 0; i < limit; i++) {


                if (UserId == result[i].IdUser && Nome == result[i].Nome && Idc == result[i].IdC) {
                    CategoriaExist = true;
                    sqlDel = "DELETE FROM subcategoria WHERE IdUser ='" + UserId + "' AND Nome ='" + Nome + "' AND IdC ='" + Idc + "' ";

                    masterPool.query(sqlDel, (err, result) => {
                        if (err) throw err;
                    });

                }
            }
        }
    }));

    if (CategoriaExist) {
        res.json("Subcategoria Eliminada")
    }
    else {
        res.json("Subcategoria nao existe")
    }
}



module.exports = router;