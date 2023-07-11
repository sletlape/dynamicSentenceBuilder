const express = require('express');
const router = express.Router();
const {
    addSentence,
    getSentences,
    getSentence,
    updateSentence,
    deleteSentenceById,
} = require('../models/sentences');
const { v4 } = require('uuid');


router.get('/', async (req, res) => {
    try {
        const sentences = await getSentences();
        if (sentences === undefined) {
            return res.sendStatus(500);
        }
        return res.json(sentences);
    } catch (e) {
        console.error(e);
        return res.sendStatus(500);
    }
});

router.get('/:sentenceId', async (req, res) => {
    const sentenceId = req.params.sentenceId;

    try {
        const sentence = await getSentence(sentenceId);
        if (sentence === undefined) {
            return res.sendStatus(404);
        }
        return res.json(sentence);
    } catch (e) {
        console.error(e);
        return res.sendStatus(500);
    }
});

router.post('/', async (req, res) => {
    const { content } = req.body;
    const id = v4();

    try {
        const response = await addSentence({ id, content });
        if (response === undefined) {
            return res.sendStatus(500);
        }
        return res.json({ id, message: 'Sentence has been created' });
    } catch (error) {
        console.error(error);
        if (error instanceof InvalidArgumentError || error instanceof InvalidFieldName)
            return res.status(400).json({ message: error.message });
    }
});

router.patch('/:sentenceId', async (req, res) => {
    const sentenceId = req.params.sentenceId;
    const { content } = req.body;

    try {
        const updatedSentence = await updateSentence(sentenceId, { content });
        if (updatedSentence === undefined) {
            return res.sendStatus(404);
        }
        return res.json(updatedSentence);
    } catch (e) {
        console.error(e);
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
    } catch (e) {
        console.error(e);
        return res.sendStatus(500);
    }
});

module.exports = router;
