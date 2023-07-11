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
        throw new InvalidIdFieldType('Error generating ID');
    }
    if (!validateUuidv4(wordTypeId)) {
        throw new InvalidIdFieldType('Invalid wordTypeId');
    }
    validateDimension('name', name);
    if (description) {
        validateDimension('description', description);
    }

    let response;
    try {
        response = await dbClient.query(`
          INSERT INTO words (${selectWordAttributes})
          VALUES ($1, $2, $3, $4)
          RETURNING *
        `, [id, wordTypeId, name, description]);
    } catch (e) {
        console.error(e);
        return undefined;
    }

    return response.rows[0];
}

async function getWords() {
    let results;
    try {
        results = await dbClient.query(`
          SELECT ${selectWordAttributes}
          FROM words
        `);
    } catch (e) {
        console.error(e);
        return undefined;
    }

    return results.rows;
}

async function getWord(wordId) {
    let result;
    try {
        result = await dbClient.query(`
          SELECT ${selectWordAttributes}
          FROM words
          WHERE id = $1
        `, [wordId]);
    } catch (e) {
        console.error(e);
        return undefined;
    }

    return result.rows[0];
}

async function updateWord(wordId, { name, description }) {
    validateDimension('name', name);
    validateDimension('description', description);

    let response;
    try {
        response = await dbClient.query(`
      UPDATE words
      SET name = $1, description = $2
      WHERE id = $3
      RETURNING *
    `, [name, description, wordId]);
    } catch (e) {
        console.error(e);
        return undefined;
    }

    return response.rows[0];
}


async function deleteWordById(wordId) {
  let response;
  try {
    response = await dbClient.query(`
      DELETE FROM words
      WHERE id = $1
      RETURNING *
    `, [wordId]);
  } catch (e) {
    console.error(e);
    return undefined;
  }

  return response.rows[0];
}

module.exports = {
  addWord,
  getWords,
  getWord,
  updateWord,
  deleteWordById,
};
