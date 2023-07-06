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
        response = await dbClient.query(`
            delete from wordTypes
            where id = $1
        `, [wordTypeId]);

    } catch (e) {
        console.error(e);
        return undefined;
    }

    return response;
}

async function deleteWordTypeByWordTypeName({ WordTypeName }) {
    if (typeof WordTypeName !== 'string')
        return undefined;
    let response;
    try {
        response = await dbClient.query(`
            delete from wordTypes
            where name = $1
        `, [WordTypeName]);

    } catch (e) {
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