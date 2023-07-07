const { v4: uuidV4 } = require('uuid');
const { InvalidArgumentError, InvalidFieldName } = require('../error');
const {
    getSentences,
    getSentence,
    addSentence,
    deleteSentenceById
} = require('../models/sentences');

const router = require('express').Router();

router.get('/', async (req, res) => {
    try {
        const sentences = await getSentences();
        if (sentences === undefined) {
            return res.sendStatus(500);
        }
        return res.json(sentences);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
});

router.get('/:sentenceId', async (req, res) => {
    const sentenceId = req.params.sentenceId;

    try {
        const sentence = await getSentence({ sentenceId });
        if (sentence === undefined) {
            return res.sendStatus(404);
        }
        return res.json(sentence);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
});

router.post('/', async (req, res) => {
    const { content } = req.body;
    const id = uuidV4();

    try {
        const response = await addSentence({ id, content });
        if (response === undefined) {
            return res.sendStatus(500);
        }
        return res.json({ id, message: 'Sentence has been created' });
    } catch (error) {
        console.error(error);
        if (error instanceof InvalidArgumentError || error instanceof InvalidFieldName) {
            return res.status(400).json({ message: error.message });
        }
        return res.sendStatus(500);
    }
});

router.delete('/:sentenceId', async (req, res) => {
    const sentenceId = req.params.sentenceId;

    try {
        const response = await deleteSentenceById(sentenceId);
        if (response === undefined || response.rowCount === 0) {
            return res.sendStatus(404);
        }
        return res.json({ id: sentenceId, message: 'Sentence has been deleted' });
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
});

module.exports = router;
