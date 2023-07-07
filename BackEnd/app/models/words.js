const dbClient = require('../db');
const { InvalidArgumentError, InvalidFieldName, InvalidIdFieldType } = require('../error');
const { validate: validateUuidv4 } = require('uuid');
const wordAttributesArray = ['id', 'wordTypeId', 'name', 'description'];
const selectWordAttributes = wordAttributesArray.join(',');

function validateDimension(dimension, dimensionValue) {
    const allowedDimensions = ['name', 'description'];
    if (!allowedDimensions.includes(dimension)) {
        throw new InvalidFieldName(`Unknown parameter: ${dimension}`);
    }

    if (typeof dimensionValue !== 'string' || dimensionValue.trimEnd().length === 0) {
        throw new InvalidArgumentError(`Dimension ${dimension} should be a non-empty string`);
    }
}

async function addWord({ id, wordTypeId, name, description }) {
    if (!validateUuidv4(id)) {
        throw new InvalidIdFieldType('Error generating ID!');
    }

    if (!validateUuidv4(wordTypeId)) {
        throw new InvalidIdFieldType('Error generating WordTypeId!');
    }

    validateDimension('name', name);
    if (description) {
        validateDimension('description', description);
    }

    try {
        const response = await dbClient.query(
            `insert into words (${selectWordAttributes})
                values ($1, $2, $3, $4)`,
            [id, wordTypeId, name, description]
        );
        return response;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

async function getWords() {
    try {
        const query = `
            select ${selectWordAttributes}
            from words
    `;
        const results = await dbClient.query(query);
        return results.rows;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

async function getWord({ wordId }) {
    if (typeof wordId !== 'string') {
        return undefined;
    }

    try {
        const query = `
            select ${selectWordAttributes}
            from words
            where id = $1
        `;
        const results = await dbClient.query(query, [wordId]);
        return results.rows[0] || null;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

async function deleteWordById(wordId) {
    if (typeof wordId !== 'string') {
        return undefined;
    }

    try {
        await dbClient.query('begin');

        const response = await dbClient.query(
            `
                delete from words
                where id = $1
            `,
            [wordId]
        );

        await dbClient.query('commit');
        return response;
    } catch (error) {
        await dbClient.query('rollback');
        console.error(error);
        return undefined;
    }
}

async function updateWord({ id, wordTypeId, name, description }) {
    if (!validateUuidv4(id)) {
        throw new InvalidIdFieldType('Error generating ID!');
    }

    if (!validateUuidv4(wordTypeId)) {
        throw new InvalidIdFieldType('Error generating WordTypeId!');
    }

    validateDimension('name', name);
    if (description) {
        validateDimension('description', description);
    }

    try {
        const response = await dbClient.query(`
            update words
            set wordTypeId = $2, name = $3, description = $4
            where id = $1
            returning *
        `,
            [id, wordTypeId, name, description]
        );
        return response.rows[0] || null;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

module.exports = {
    addWord,
    getWords,
    getWord,
    deleteWordById,
    updateWord,
};
