const express = require('express');
const wordTypeRouter = require('./routes/wordType');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
console.log("hello");
app.use('/wordType', wordTypeRouter);

app.listen(process.env.PORT || 4000);

module.exports = app;