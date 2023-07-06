const { response } = require('express');
const { v4: uuidV4 } = require('uuid');
const { InvalidArgumentError, InvalidFieldName } = require('../error');
const { getWordTypes, addWordType, deleteWordType } = require('../models/wordTypes');

const router = require('express').Router();

router.get('/', async (req, res) => {
    //ToDo: implement sorting and limits

    let wordTypes;
    try {
        wordTypes = await getWordTypes();
    } catch (e) {
        console.log(e);
        if (e instanceof InvalidArgumentError)
            return res.status(400).json({ message: e.message });
        return res.sendStatus(500);
    }

    if (wordTypes === null)
        return res.sendStatus(404);
    return wordTypes === undefined ? res.sendStatus(500) : res.json(wordTypes);
});

router.get('/:wordTypeId', async (req, res) => {
    const wordTypeId = req.params.wordTypeId;

    let wordType;
    try {
        wordType = await getWordType({ wordTypeId });
    } catch (e) {
        return res.sendStatus(500);
    }
    if (wordType === null)
        return res.sendStatus(404);
    return wordTypes === undefined ? sendStatus(500) : res.json(wordTypes);
});

router.post('/', async (req, res) => {
    const {
        name,
        description
    } = req.body;

    let resp;
    const id = uuidV4();
    try {
        resp = await addWordType({ id, name, description });
    } catch (e) {
        console.error(e);
        if (e instanceof InvalidArgumentError || e instanceof InvalidFieldName)
            return res.status(400).json({ message: e.message });
        return res.sendStatus(500);
    }
    return resp === undefined ? res.sendStatus(500) :
        res.json({ id, message: 'WordType has been created' });
});

//ToD0: implement patch to update existing word types
// router.patch('/:wordTypeId', async (req, res) => {
// });

router.delete('/:wordTypeId', async (req, res) => {
    const wordTypeId = req.params.wordTypeId;
    let resp;
    try {
        resp = await deleteWordTypeById({ wordTypeId });
    } catch (e) {
        console.error(e);
    }
    if (resp.rowCount === 0)
        return res.sendStatus(404);
    return wordTypes === undefined ? sendStatus(500) : res.json({ id, message: 'WordType has been deleted' });
});

router.delete('/:wordTypeName', async (req, res) => {
    const wordTypeName = req.params.wordTypeName;
    let resp;
    try {
        resp = await deleteWordTypeById({ wordTypeName });
    } catch (e) {
        console.error(e);
    }
    if (resp.rowCount === 0)
        return res.sendStatus(404);
    return wordTypes === undefined ? sendStatus(500) : res.json({ id, message: 'WordType has been deleted' });
});

module.exports = router;