const client = require('../db');
const { InvalidArgumentError, InvalidFieldName, InvalidIdFieldType } = require('../error');
const { validate: validateUuidv4 } = require('uuid');
const wordTypeAttributesArray = ['id', 'name', 'description'];
const selectWordTypeAttributes = wordTypeAttributesArray.join(',');


function validateDimension(dimension, dimensionValue) {

    if (dimension !== 'name' && dimension !== 'description')
        throw new InvalidFieldName('Unknown parameter: ', dimension);

    if (typeof dimensionValue !== 'string' || dimensionValue.length === 0)
        throw new InvalidArgumentError(`Dimension, ${dimension}, should be a non-empty stirng`);
}

async function addWordType({ id, name, description }) {
    if (!validateUuidv4(id))
        throw new InvalidIdFieldType('Error generating Id!');
    validateDimension('name', name);
    validateDimension('description', description);

    let response;
    try {
        response = await client.query(`
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
        results = await client.query(query);
    } catch (e) {
        console.log(e);
        return undefined;
    }

    return results.rows;
}

async function getWordType({ wordTypeId }) {
    console.log(wordTypeId)
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
        results = await client.query(query, [wordTypeId]);
    } catch (e) {
        console.log(e);
        return undefined;
    }

    console.log("((((((", results)

    return (results.rowCount === 0) ? null : results.rows[0];
}

async function deleteWordTypeById(wordTypeId) {
    console.log('>>>>>', wordTypeId)
    // if (!validateUuidv4(wordTypeId))
    //     throw new InvalidIdFieldType('ID should be of type UUIDv4');
    if (typeof wordTypeId !== 'string')
        return undefined
    let response;
    try {
        response = await client.query(`
            delete from wordTypes
            where id = $1
        `, [wordTypeId]);

    } catch (e) {
        console.error(e);
        return undefined;
    }
    console.log('}}}}}', response)
    return response;
}

async function deleteWordTypeByWordTypeName({ WordTypeName }) {
    console.log('}}}}}', typeof wordTypeName)
    if (typeof WordTypeName !== 'string')
        return undefined;
    let response;
    try {
        response = await client.query(`
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