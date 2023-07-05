const { expect } = require("chai");
const { Client } = require('pg');

const client = require('../app/db');

describe('Testing client', () => {
    it('Verifies that exported client is instance of pg Client', () => {
        expect(client instanceof Client).to.be.true;
    });
})