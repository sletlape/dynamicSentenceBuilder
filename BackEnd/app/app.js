const express = require('express');
const wordTypeRouter = require('./routes/wordType');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/wordType', wordTypeRouter);
console.log('/wordType endpoint live!');
app.listen(process.env.PORT || 4000);
console.log('Listening on port: ', process.env.PORT);

module.exports = app;