const dbClient = require('../db');
const { InvalidArgumentError, InvalidFieldName, InvalidIdFieldType } = require('../error');
const { validate: validateUuidv4 } = require('uuid');

const sentenceAttributesArray = ['id', 'content'];
const selectSentenceAttributes = sentenceAttributesArray.join(',');

function validateDimension(dimension, dimensionValue) {
    const allowedDimensions = ['content'];
    if (!allowedDimensions.includes(dimension))
        throw new InvalidFieldName('Unknown parameter: ' + dimension);

    if (typeof dimensionValue !== 'string' || dimensionValue.trimEnd().length === 0)
        throw new InvalidArgumentError(`Dimension, ${dimension}, should be a non-empty string`);
}

async function addSentence({ id, content }) {
    if (!validateUuidv4(id))
        throw new InvalidIdFieldType('Error generating ID!');
    validateDimension('content', content);

    let response;
    try {
        response = await dbClient.query(
            'insert into sentences (id, content) values ($1, $2)',
            [id, content]
        );
    } catch (error) {
        console.error(error);
        return undefined;
    }

    return response;
}

async function getSentences() {
    const query = `select ${selectSentenceAttributes} from sentences`;

    let results;
    try {
        results = await dbClient.query(query);
    } catch (error) {
        console.error(error);
        return undefined;
    }

    return results.rows;
}

async function getSentence({ sentenceId }) {
    if (typeof sentenceId !== 'string') return undefined;

    const query = `select ${selectSentenceAttributes} from sentences where id = $1`;

    let results;
    try {
        results = await dbClient.query(query, [sentenceId]);
    } catch (error) {
        console.error(error);
        return undefined;
    }

    return results.rowCount === 0 ? null : results.rows[0];
}

async function deleteSentenceById(sentenceId) {
    if (typeof sentenceId !== 'string') return undefined;

    let response;
    try {
        await dbClient.query('begin');
        response = await dbClient.query(
            'delete from sentences where id = $1',
            [sentenceId]
        );
        await dbClient.query('commit');
    } catch (error) {
        console.error(error);
        await dbClient.query('rollback');
        return undefined;
    }

    return response;
}

module.exports = {
    addSentence,
    getSentences,
    getSentence,
    deleteSentenceById
};
