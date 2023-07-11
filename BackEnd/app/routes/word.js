const { v4: uuidV4 } = require('uuid');
const { InvalidArgumentError, InvalidFieldName } = require('../error');
const { getWords, getWord, addWord, deleteWordById, updateWord } = require('../models/words');

const router = require('express').Router();

router.get('/', async (req, res) => {
    try {
        const words = await getWords();
        if (words === undefined) {
            return res.sendStatus(500);
        }
        return res.json(words);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
});

router.get('/:wordId', async (req, res) => {
    const wordId = req.params.wordId;

    try {
        const word = await getWord({ wordId });
        if (word === undefined) {
            return res.sendStatus(404);
        }
        return res.json(word);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
});

router.post('/', async (req, res) => {
    const { wordTypeId, name, description } = req.body;
    const id = uuidV4();

    try {
        const response = await addWord({ id, wordTypeId, name, description });
        if (response === undefined) {
            return res.sendStatus(500);
        }
        return res.json({ id, message: 'Word has been created' });
    } catch (error) {
        console.error(error);
        if (error instanceof InvalidArgumentError || error instanceof InvalidFieldName) {
            return res.status(400).json({ message: error.message });
        }
        return res.sendStatus(500);
    }
});

router.delete('/:wordId', async (req, res) => {
    const wordId = req.params.wordId;

    try {
        const response = await deleteWordById(wordId);
        if (response === undefined || response.rowCount === 0) {
            return res.sendStatus(404);
        }
        return res.json({ id: wordId, message: 'Word has been deleted' });
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
});

router.patch('/:wordId', async (req, res) => {
    const wordId = req.params.wordId;
    const { wordTypeId, name, description } = req.body;

    try {
        const response = await updateWord({ id: wordId, wordTypeId, name, description });
        if (response === undefined) {
            return res.sendStatus(404);
        }
        return res.json({ id: wordId, message: 'Word has been updated' });
    } catch (error) {
        console.error(error);
        if (error instanceof InvalidArgumentError || error instanceof InvalidFieldName) {
            return res.status(400).json({ message: error.message });
        }
        return res.sendStatus(500);
    }
});

module.exports = router;
