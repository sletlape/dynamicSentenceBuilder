class InvalidArgumentError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidArgumentError';
    }
}

class InvalidFieldName extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidFieldName';
    }
}

module.exports = { InvalidArgumentError, InvalidFieldName}