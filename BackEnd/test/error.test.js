const { expect } = require('chai');
const {InvalidArgumentError, InvalidFieldName} = require('../app/error');

describe('Testing Invalid Argument error', () => {
    const customMessage = 'Custom message';
    const argumentError = new InvalidArgumentError(customMessage);

    it('Custom error is instance of Error', () => {
        expect(argumentError instanceof Error).to.be.true
    });

    it('Name is et correctly', () => {
        expect(argumentError.name).to.equal('InvalidArgumentError');
    });

    it('Message is set correctly', () => {
        expect(argumentError.message).to.equal(customMessage);
    });
});
 
describe('Testing Invalid Parameter error', () => {
    const customMessage = 'Custom message';
    const param = new InvalidFieldName(customMessage);

    it('Custom error is instance of Error', () => {
        expect(param instanceof Error).to.be.true
    });

    it('Name is et correctly', () => {
        expect(param.name).to.equal('InvalidFieldName');
    });

    it('Message is set correctly', () => {
        expect(param.message).to.equal(customMessage);
    });
});