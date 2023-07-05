const fs = require('fs');
const dbClient = require('../app/db');

before(async () => {
    const wordTypes = fs.readFileSync('../ddl/wordTypes.sql');
    const wordTypesTestData = fs.readFileSync('../ddl/wordTypesTestData.sql');
    
    const strSQL = wordTypes + wordTypesTestData;
    const arrSQL = strSQL.split(';');
    arrSQL.forEach(async sql => {
        console.log('----', sql);
        await dbClient.query(sql);
    });


})