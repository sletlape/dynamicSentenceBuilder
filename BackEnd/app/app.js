const express = require('express');
const cors = require('cors');
const wordTypeRouter = require('./routes/wordType');
const sentenceRouter = require('./routes/sentence');
const wordRouter = require('./routes/word');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use('/word', wordRouter);
app.use('/sentence', sentenceRouter);
app.use('/wordType', wordTypeRouter);
app.listen(process.env.PORT || 4000);
console.log('Listening on port: ', process.env.PORT);

module.exports = app;