const express = require('express');
const router = express.Router();
const { masterPool } = require('../database');


//Get Expense
router.get('/', (req, res) => {

    //Id of user
    //Gotten from token
    let UserId = req.user.Id;

    //Requested from user
    let CatId = req.body.subcatid;

    let GetDespesa = GetDespesaNome(UserId, CatId, res);

    GetDespesa.then(function () {
        console.log("Successeful Execution of Request!");
    }).catch(function () {
        console.log("Something Went Wrong!")
    });
});

router.post('/get', async (req, res) => {
    let SubCategoriasExist = false;
    //Id of user
    let data;
    //Gotten from token
    let UserId = req.user.Id;
    let IdS = req.body.ids
    console.log(UserId)
    //Requested from user

    let sql = "SELECT Id, IdUser,Nome, Valor,Data,IdS  FROM despesas WHERE IdS = '" + IdS + "'";

    console.log("HERE", UserId)

    let ResultSubCategoria = await new Promise((resolve, reject) => masterPool.query(sql, (err, result) => {

        if (err) {
            reject(err);
        } else {
            resolve(result);
            console.log(result)
            limit = result.length;

            data = result;

            //Cheking if Categoria exists in Database
            for (let i = 0; i < limit; i++) {
                if (UserId == result[i].IdUser) {
                    SubCategoriasExist = true
                }
            }
        }
    }));

    if (SubCategoriasExist) {
        res.json(data)
    } else {
        res.json("Nao existe nenhuma subcategoria com esse id")
    }
});



//Adding Expense
router.post('/adicionar', (req, res) => {

    //Id of user
    //Gotten from token
    let UserId = req.user.Id;

    //Requested from user
    let Nome = req.body.nome;
    let IdSubCategoria = req.body.ids;
    let Valor = req.body.valor;
    let Data = req.body.data;



    let AdicionarDespesa = AddDespesa(UserId, Nome, IdSubCategoria, Valor, Data, res);

    AdicionarDespesa.then(function () {
        console.log("Successeful Execution of Request!");
    }).catch(function () {
        console.log("Something Went Wrong!")
    });
});



//Delete Expense
router.post('/eliminar', (req, res) => {

    //Id of user
    //Gotten from token
    let UserId = req.user.Id;

    //Requested from user
    let Nome = req.body.nome;
    let Ids = req.body.ids;


    let EliminarDespesa = DelDespesa(UserId, Nome, Ids, res);

    EliminarDespesa.then(function () {
        console.log("Successeful Execution of Request!");
    }).catch(function () {
        console.log("Something Went Wrong!")
    });
});


//Distribution of expenses
router.post('/distribuicao', (req, res) => {

    //Id of user
    //Gotten from token
    let UserId = req.user.Id;

    //Requested from user
    let Data1 = req.body.data1;
    let Data2 = req.body.data2;

    let DistribuirDespesa = distribution(UserId, Data1, Data2, res);

    DistribuirDespesa.then(function () {
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


async function GetDespesaNome(UserId, CatId, res) {

    let DespesaExist = false;
    let Values = []

    //Get Categorias existentes na base de dados
    let sql = "SELECT Nome, IdS, IdUser, Id, Data  FROM despesas";


    let ResultSubCategoria = await new Promise((resolve, reject) => masterPool.query(sql, (err, result) => {

        if (err) {
            reject(err);
        } else {
            resolve(result);

            limit = result.length;

            //Cheking if Categoria exists in Database
            for (let i = 0; i < limit; i++) {
                if (UserId == result[i].IdUser && CatId == result[i].IdS) {
                    DespesaExist = true
                    Values.push(result[i])
                }
            }
        }
    }));

    if (DespesaExist) {
        res.json(Values);
    } else {
        res.json("Subcategoria nao tem despesas")
    }
}


//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------


async function AddDespesa(UserId, Nome, ids, Valor, Data, res) {


    //Insert Categoria in Database  
    let sqlInsertSubCategoria = "INSERT INTO despesas (Nome, IdUser, Valor, IdS, Data) VALUES ('" + Nome + "', '" + UserId + "', '" + Valor + "', '" + ids + "', '" + Data + "')";

    masterPool.query(sqlInsertSubCategoria, (err, result) => {
        if (err) throw err;
        console.log("Despesa Added To DataBase");
        res.json("Despesa adicionada");
    });
}


//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------


async function DelDespesa(UserId, Nome, Ids, res) {

    CategoriaExist = false;

    //Getting despesas From DB
    let sql = "SELECT IdUser, Nome, IdS FROM despesas";

    let results = await new Promise((resolve, reject) => masterPool.query(sql, (err, result) => {
        if (err) {
            reject(err);
        } else {
            resolve(result);
            //Storing Values in Array
            limit = result.length;


            //Getting 
            for (let i = 0; i < limit; i++) {


                if (UserId == result[i].IdUser && Nome == result[i].Nome && Ids == result[i].IdS) {
                    CategoriaExist = true;
                    sqlDel = "DELETE FROM despesas WHERE IdUser ='" + UserId + "' AND Nome ='" + Nome + "' AND IdS ='" + Ids + "' ";

                    masterPool.query(sqlDel, (err, result) => {
                        if (err) throw err;
                    });

                }
            }
        }
    }));

    if (CategoriaExist) {
        res.json("Despesa Eliminada")
    }
    else {
        res.json("Despesa nao existe")
    }
}


//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------


async function distribution(UserId, Date1, Date2, res) {

    //Checking if user has categorys
    //Checking if user has subcategorys
    //Checking if user has expenses
    let categoriaExists = false;
    let subcategoriaExists = false;
    let despesasExists = false;

    let IdCategorias = []
    let IdSubCategorias = []
    let IdCatSubCategorias = []
    let NomeCategoria = []

    let IdDespesasIdS = []
    let NomeDespesa = []
    let ValorDespesa = []
    let GetDates = []

    let Valores = []
    let SubStored = []
    let ValoresCategoria = []






    //Getting Categories From DB
    let sql = "SELECT Id, IdUser, Nome FROM categoria";

    let results = await new Promise((resolve, reject) => masterPool.query(sql, (err, result) => {
        if (err) {
            reject(err);
        } else {
            resolve(result);
            //Array length
            limit = result.length;

            //Getting Categories Id
            for (let i = 0; i < limit; i++) {
                if (UserId == result[i].IdUser) {
                    categoriaExists = true;
                    //Categories that belongs to user
                    IdCategorias.push(result[i].Id)
                    NomeCategoria.push(result[i].Nome)
                }
            }
        }
    }));

    console.log("Nome Categorias: ", NomeCategoria)
    console.log("Id Categorias: ", IdCategorias)

    if (categoriaExists) {
        //Getting SubCategories From DB
        let sql1 = "SELECT Id, IdUser, IdC FROM subcategoria";

        let results = await new Promise((resolve, reject) => masterPool.query(sql1, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
                //Array length
                limit = result.length;

                //Getting Categories Id
                for (let i = 0; i < limit; i++) {
                    if (UserId == result[i].IdUser) {
                        subcategoriaExists = true;
                        //SubCategories that belongs to user
                        IdSubCategorias.push(result[i].Id)
                        //Respective Categories that each Id correspond
                        IdCatSubCategorias.push(result[i].IdC)
                    }
                }
            }
        }));
    } else {
        res.json("User has no categories to his name")
    }

    console.log("Id SubCategorias: ", IdSubCategorias)
    console.log("Id SubCategoriasCat: ", IdCatSubCategorias)

    //Parse user inputed string dates to secs
    Date1 = Date.parse(Date1)
    Date2 = Date.parse(Date2)


    if (subcategoriaExists) {
        //Getting Expenses From DB
        let sql2 = "SELECT Id, Data, IdS, IdUser, Nome, Valor FROM despesas"

        let results = await new Promise((resolve, reject) => masterPool.query(sql2, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
                //Array length
                limit = result.length;

                for (let i = 0; i < limit; i++) {
                    if (UserId == result[i].IdUser && Date1 < Date.parse(result[i].Data) && Date2 > Date.parse(result[i].Data)) {
                        despesasExists = true;
                        //
                        IdDespesasIdS.push(result[i].IdS)
                        //
                        NomeDespesa.push(result[i].Nome)
                        //Value of expense
                        ValorDespesa.push(result[i].Valor)

                        GetDates.push(result[i].Data)
                    }
                }
                //Initiate array with predicted size
                Valores = [IdSubCategorias.length];
                //Initiate array with values of 0 instead of undefined
                for (let j = 0; j < IdSubCategorias.length; j++) {
                    Valores[j] = 0
                }
            }
        }));



    } else {
        res.json("User has no subcategories to his name")
    }

    if (despesasExists) {
        for (let t = 0; t < IdDespesasIdS.length; t++) {
            for (let tt = 0; tt < IdSubCategorias.length; tt++) {
                if (IdDespesasIdS[t] == IdSubCategorias[tt]) {
                    Valores[tt] = Valores[tt] + ValorDespesa[t]
                    //Know what subcategory is associated with such values
                    SubStored[tt] = IdSubCategorias[tt]
                }
            }
        }

        //Total 
        console.log("Totals: ", Valores)
        //Subcategorys that Total values belong respetivamente
        console.log("SubCategories Positions: ", SubStored)

        ValoresCategoria = [IdCategorias.length]
        //Initiate array with values of 0 instead of undefined
        for (let init = 0; init < IdCategorias.length; init++) {
            ValoresCategoria[init] = 0
        }



        for (let r = 0; r < IdCategorias.length; r++) {
            for (let rr = 0; rr < IdCatSubCategorias.length; rr++) {
                if (IdCategorias[r] == IdCatSubCategorias[rr]) {
                    ValoresCategoria[r] = ValoresCategoria[r] + Valores[rr]
                }
            }
        }

        console.log("Final: ", ValoresCategoria)


        //Creating object to send to user
        let obj = {};
        let data = [];

        obj.data = data

        //Creating object iterating through the arrays that have the "important" info (Category Id's and Values associated with every category)
        for (let n = 0; n < ValoresCategoria.length; n++) {

            let single = {
                "nome": NomeCategoria[n],
                "id": IdCategorias[n],
                "total": ValoresCategoria[n]
            }
            obj.data.push(single)
        }
        //Send object to user
        res.json(obj.data)

    } else {
        res.json("User has no expenses to his name")
    }


}


module.exports = router;