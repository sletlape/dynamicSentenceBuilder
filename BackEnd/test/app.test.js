const { expect } = require('chai');

const app = require('../app/app');

describe('Testing creation of app', () => {
    it('App is exported correctly', () => {
        expect(typeof app).to.equal('function');
    });
});