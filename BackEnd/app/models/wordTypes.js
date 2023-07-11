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
    if (!validateUuidv4(id)) {
        throw new InvalidIdFieldType('Error generating ID');
    }
    validateDimension('name', name);
    if (description) {
        validateDimension('description', description);
    }

    let response;
    try {
        response = await dbClient.query(`
            INSERT INTO wordtypes (${selectWordTypeAttributes})
            VALUES ($1, $2, $3)
            RETURNING *
        `, [id, name, description]);
    } catch (e) {
        console.error(e);
        return undefined;
    }

    return response.rows[0];
}

async function getWordTypes() {
    let results;
    try {
        results = await dbClient.query(`
            SELECT ${selectWordTypeAttributes}
            FROM wordtypes
        `);
    } catch (e) {
        console.error(e);
        return undefined;
    }

    return results.rows;
}

async function getWordType(wordTypeId) {
    if (typeof wordTypeId !== 'string')
        return undefined
    let result;
    try {
        result = await dbClient.query(`
            SELECT ${selectWordTypeAttributes}
            FROM wordtypes
            WHERE id = $1
        `, [wordTypeId]);
    } catch (e) {
        console.error(e);
        return undefined;
    }

    return result.rows[0];
}

async function updateWordType(wordTypeId, { name, description }) {
    validateDimension('name', name);
    validateDimension('description', description);

    let response;
    try {
        response = await dbClient.query(`
            UPDATE wordtypes
            SET name = $1, description = $2
            WHERE id = $3
            RETURNING *
        `, [name, description, wordTypeId]);
    } catch (e) {
        console.error(e);
        return undefined;
    }

    return response.rows[0];
}

async function deleteWordTypeById(wordTypeId) {
    let response;
    try {
        response = await dbClient.query(`
            DELETE FROM wordtypes
            WHERE id = $1
            RETURNING *
        `, [wordTypeId]);
    } catch (e) {
        console.error(e);
        return undefined;
    }

    return response.rows[0];
}

module.exports = {
    addWordType,
    getWordTypes,
    getWordType,
    updateWordType,
    deleteWordTypeById,
};
