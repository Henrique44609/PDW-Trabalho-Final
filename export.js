const express = require('express');
const router = express.Router();
const { masterPool } = require('../database');

router.get('/', (req, res) => {


    getexport(res);

});


async function getexport(res) {





    let sqlgetexp = "select * from despesas";

    masterPool.query(sqlgetexp, (err, result) => {
        if (err) throw err;
        console.log(result)
        res.json(result);
    });



    
}

module.exports = router;