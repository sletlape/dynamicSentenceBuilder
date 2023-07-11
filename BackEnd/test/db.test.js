const { expect } = require("chai");
const { Client } = require('pg');

const dbClient = require('../app/db');

describe('Testing dbClient', () => {
    it('Verifies that exported dbClient is instance of pg Client', () => {
        expect(dbClient instanceof Client).to.be.true;
    });
})