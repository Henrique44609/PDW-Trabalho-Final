const express = require('express');
const router = express.Router();
const { masterPool } = require('../database');

router.post('/', (req, res) => {

    let data = req.body.data
    getexport(data,res);

});


async function getexport(data,res) {

    console.log(data)
    for(let i = 0; i<data.length;i++){
        
/*
    let sqlInsertCategoria = "INSERT INTO categoria (Nome, IdUser) VALUES ('" + Nome + "', '" + UserId + "')";

    masterPool.query(sqlInsertCategoria, (err, result) => {
        if (err) throw err;
        console.log("Categoria Added To DataBase");
        res.json("Categoria adicionada");
    });

    
*/
    }
    
}

module.exports = router;