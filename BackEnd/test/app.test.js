const { expect } = require('chai');

const app = require('../app/app');

describe('Testing creation of app', () => {
    it('correctly exports the app', () => {
        expect(typeof app).to.equal('function');
    });
});