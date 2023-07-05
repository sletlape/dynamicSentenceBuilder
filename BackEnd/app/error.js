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

class InvalidIdFieldType extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidIdFieldType';
    }
}

module.exports = { InvalidArgumentError, InvalidFieldName, InvalidIdFieldType }