const dbClient = require('../db');
const { InvalidArgumentError, InvalidFieldName, InvalidIdFieldType } = require('../error');
const { validate: validateUuidv4 } = require('uuid');
const wordTypeAttributesArray = ['id', 'name', 'description'];
const selectWordTypeAttributes = wordTypeAttributesArray.join(',');

function validateDimension(dimension, dimensionValue) {
    const allowedDimensions = ['name', 'description'];
    if (!allowedDimensions.includes(dimension))
        throw new InvalidFieldName('Unknown parameter: ', dimension);

    if (typeof dimensionValue !== 'string' || dimensionValue.trimEnd().length === 0)
        throw new InvalidArgumentError(`Dimension, ${dimension}, should be a non-empty string`);
}


async function addWordType({ id, name, description }) {
    if (!validateUuidv4(id))
        throw new InvalidIdFieldType('Error generating Id!');
    validateDimension('name', name);
    if (description)
        validateDimension('description', description);

    let response;
    try {
        response = await dbClient.query(`
            insert into wordTypes (${selectWordTypeAttributes})
            values ($1,$2,$3)
        `, [id, name, description]);
    } catch (e) {
        console.error(e);
        return undefined;
    }

    return response;
}

async function getWordTypes() {
    const query = `
        select ${selectWordTypeAttributes}
        from wordTypes
    `;
    let results;
    try {
        results = await dbClient.query(query);
    } catch (e) {
        console.log(e);
        return undefined;
    }

    return results.rows;
}

async function getWordType({ wordTypeId }) {
    // if (!validateUuidv4(wordTypeId))
    //     throw new InvalidIdFieldType('Input ID should be UUIDv4');
    if (typeof wordTypeId !== 'string')
        return undefined
    const query = `
        select ${selectWordTypeAttributes}
        from wordTypes
        where id = $1
    `;

    let results
    try {
        results = await dbClient.query(query, [wordTypeId]);
    } catch (e) {
        console.log(e);
        return undefined;
    }

    return (results.rowCount === 0) ? null : results.rows[0];
}

async function deleteWordTypeById(wordTypeId) {
    // if (!validateUuidv4(wordTypeId))
    //     throw new InvalidIdFieldType('ID should be of type UUIDv4');
    if (typeof wordTypeId !== 'string')
        return undefined
    
    let response;
    try {
        await dbClient.query('begin');
        // Delete related words first
        const tableExists = dbClient.query(`
            select 1 from information_schema
            where table_schema = 'public'
            and table_name = words
        `).rows[0].exists;

        if (tableExists){
            await dbClient.query(`
                delete from words 
                where wordTypeId = $1
            `, [wordTypeId]);}
        // Delete the wordType
        response = await dbClient.query(`
            delete from wordTypes 
            where id = $1
        `, [wordTypeId]);
        await dbClient.query('commit');
    } catch (e) {
        console.error(e);
        await dbClient.query('rollback');
        return undefined;
    }

    return response;
}

async function deleteWordTypeByWordTypeName({ WordTypeName }) {
    // Get the wordType ID based on the name
    const query = '';
    const result = await dbClient.query(`
        select id from wordTypes 
        where name = $1
        `, [wordTypeName]);

    if (typeof WordTypeName !== 'string')
        return undefined;
    let response;
    try {
        response = await dbClient.query(`
            delete from wordTypes
            where name = $1
        `, [WordTypeName]);

        await dbClient.query('commit');
    } catch (e) {
        await dbClient.query('rollback');
        console.error(e);
        return undefined;
    }
    return response;
}

///ToDo: Create upate funtionality

module.exports = {
    addWordType,
    getWordType,
    getWordTypes,
    deleteWordTypeById,
    deleteWordTypeByWordTypeName
};