const dbClient = require('../db');
const { InvalidArgumentError, InvalidFieldName, InvalidIdFieldType } = require('../error');
const { validate: validateUuidv4 } = require('uuid');

const sentenceAttributesArray = ['id', 'content', 'created_at'];
const selectSentenceAttributes = sentenceAttributesArray.join(',');

function validateDimension(dimension, dimensionValue) {
    const allowedDimensions = ['content'];
    if (!allowedDimensions.includes(dimension))
        throw new InvalidFieldName('Unknown parameter: ' + dimension);

    if (typeof dimensionValue !== 'string' || dimensionValue.trimEnd().length === 0)
        throw new InvalidArgumentError(`Dimension, ${dimension}, should be a non-empty string`);
}

async function addSentence({ id, content }) {
    if (!validateUuidv4(id)) {
        throw new InvalidIdFieldType('Error generating ID');
    }
    validateDimension('content', content);

    let response;
    try {
        response = await dbClient.query(`
            INSERT INTO sentences (${selectSentenceAttributes})
            VALUES ($1, $2, NOW())
            RETURNING *
        `, [id, content]);
    } catch (e) {
        console.error(e);
        return undefined;
    }

    return response.rows[0];
}

async function getSentences() {
    let results;
    try {
        results = await dbClient.query(`
            SELECT ${selectSentenceAttributes}
            FROM sentences
        `);
    } catch (e) {
        console.error(e);
        return undefined;
    }

    return results.rows;
}

async function getSentence(sentenceId) {
    if (typeof sentenceId !== 'string') return undefined;
    let result;
    try {
        result = await dbClient.query(`
            SELECT ${selectSentenceAttributes}
            FROM sentences
            WHERE id = $1
        `, [sentenceId]);
    } catch (e) {
        console.error(e);
        return undefined;
    }

    return result.rows[0];
}

async function updateSentence(sentenceId, { content }) {
    validateDimension('content', content);

    let response;
    try {
        response = await dbClient.query(`
            UPDATE sentences
            SET content = $1
            WHERE id = $2
            RETURNING *
        `, [content, sentenceId]);
    } catch (e) {
        console.error(e);
        return undefined;
    }

    return results.rowCount === 0 ? null : results.rows[0];
}

async function deleteSentenceById(sentenceId) {
    if (typeof sentenceId !== 'string') return undefined;

    let response;
    try {
        response = await dbClient.query(`
            DELETE FROM sentences
            WHERE id = $1
            RETURNING *
        `, [sentenceId]);
    } catch (e) {
        console.error(e);
        return undefined;
    }

    return response.rows[0];
}

module.exports = {
    addSentence,
    getSentences,
    getSentence,
    updateSentence,
    deleteSentenceById,
};
