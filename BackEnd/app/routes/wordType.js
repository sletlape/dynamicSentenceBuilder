const express = require('express');
const router = express.Router();
const { v4 } = require('uuid');
const { InvalidArgumentError, InvalidFieldName } = require('../error');

const {
    addWordType,
    getWordTypes,
    getWordType,
    updateWordType,
    deleteWordTypeById,
} = require('../models/wordTypes');

router.get('/', async (req, res) => {
    try {
        const wordTypes = await getWordTypes();
        if (wordTypes === undefined) {
            return res.sendStatus(500);
        }
        return res.json(wordTypes);
    } catch (e) {
        console.error(e);
        return res.sendStatus(500);
    }
});

router.get('/:wordTypeId', async (req, res) => {
    const wordTypeId = req.params.wordTypeId;

    try {
        const wordType = await getWordType(wordTypeId);
        if (wordType === undefined) {
            return res.sendStatus(404);
        }
        return res.json(wordType);
    } catch (e) {
        console.error(e);
        return res.sendStatus(500);
    }
});

router.post('/', async (req, res) => {
    const { name, description } = req.body;
    const id = v4();

    try {
        const response = await addWordType({ id, name, description });
        if (response === undefined) {
            return res.sendStatus(500);
        }
        return res.json({ id, message: 'WordType has been created' });
    } catch (e) {
        console.error(e);
        return res.sendStatus(500);
    }
});

router.patch('/:wordTypeId', async (req, res) => {
    const wordTypeId = req.params.wordTypeId;
    const { name, description } = req.body;

    try {
        const updatedWordType = await updateWordType(wordTypeId, { name, description });
        if (updatedWordType === undefined) {
            return res.sendStatus(404);
        }
        return res.json(updatedWordType);
    } catch (e) {
        console.error(e);
        return res.sendStatus(500);
    }
});

router.delete('/:wordTypeId', async (req, res) => {
    const wordTypeId = req.params.wordTypeId;

    try {
        const response = await deleteWordTypeById(wordTypeId);
        if (response === undefined || response.rowCount === 0) {
            return res.sendStatus(404);
        }
        return res.json({ id: wordTypeId, message: 'WordType has been deleted' });
    } catch (e) {
        console.error(e);
        return res.sendStatus(500);
    }
});

module.exports = router;
