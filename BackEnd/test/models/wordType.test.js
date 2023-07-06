const { expect } = require('chai');
const { v4: uuidv4, validate: validateUuidv4 } = require('uuid');
const dbClient = require('../../app/db');
const { InvalidArgumentError, InvalidIdFieldType } = require('../../app/error');
const {
    getWordType,
    getWordTypes,
    addWordType,
    deleteWordTypeById,
    deleteWordTypeByWordTypeName
} = require('../../app/models/wordTypes');
// const { query } = require('express');

async function removeById(id) {
    await dbClient.query(`
            delete from wordTypes
            where id = $1
        `, [id]);
}

describe('Testing wordType model', () => {

    async function clearTable() {
        await dbClient.query(`
            DELETE FROM wordTypes
        `);
    }

    let testingWordTypeInputs = {};
    beforeEach(async () => {
        console.log("Universal Before")
        testingWordTypeInputs = {
            id: uuidv4(),
            name: 'Noun',
            description: 'testing with valid input'
        };
        await removeById(testingWordTypeInputs.id);
    });

    afterEach(async () => {
        if(validateUuidv4(testingWordTypeInputs.id))
            await removeById(testingWordTypeInputs.id);
    });

    describe('Testing add wordType', () => {
        describe('Positive tests:', () => {
            it('adds record with valid recod {all fields provided}', async () => {
                await addWordType(testingWordTypeInputs);
                const resp = await dbClient.query(`
                select id, name, description
                from wordTypes
                where id = $1
            `, [testingWordTypeInputs.id]);
                expect(resp.rows.length).to.equal(1);
                const wordType = resp.rows[0];

                expect(wordType).to.deep.equal(testingWordTypeInputs);
            });

            it('adds record with only name field validyl provided {no description}', async () => {
                const resp = await dbClient.query(`
                select id, name, description
                from wordTypes
                where id = $1
            `, [testingWordTypeInputs.id]);
                testingWordTypeInputs.description = null;

                console.log('-------No description------')
                console.log(resp)
                console.log('-------No description------')
                expect(resp.rows.length).to.equal(1);
                const wordType = resp.rows[0];
                expect(wordType).to.deep.equal(testingWordTypeInputs);
            });
        });

        describe('Negative tests:', () => {
            it('Correct error message for no input: ID', async () => {
                delete testingWordTypeInputs.id
                let err = '';
                try {
                    await addWordType(testingWordTypeInputs);
                } catch (e) {
                    err = e.message;
                }
                expect(err).to.equal('Error generating Id!')
            });

            it('Correct error message for invalid input: ID', async () => {
                testingWordTypeInputs.id = 123;
                let err = '';
                try {
                    await addWordType(testingWordTypeInputs);
                } catch (e) {
                    err = e.message;
                    expect(e instanceof InvalidIdFieldType);
                }
                expect(err).to.equal('Error generating Id!')
            });

            it('Correct error message for no input: Name', async () => {
                delete testingWordTypeInputs.name
                let err = '';
                try {
                    await addWordType(testingWordTypeInputs);
                } catch (e) {
                    err = e.message;
                    expect(e instanceof InvalidArgumentError);
                }
                expect(err).to.equal('Dimension, name, should be a non-empty stirng')
            });

            it('Correct error message for invalid input: Name', async () => {
                testingWordTypeInputs.name = 123;
                let err = '';
                try {
                    await addWordType(testingWordTypeInputs);
                } catch (e) {
                    err = e.message;
                    expect(e instanceof InvalidArgumentError);
                }
                expect(err).to.equal('Dimension, name, should be a non-empty stirng')
            });

            it('Correct error message for no input: Description', async () => {
                testingWordTypeInputs.description = 123;
                let err = '';
                try {
                    await addWordType(testingWordTypeInputs);
                } catch (e) {
                    err = e.message;
                    expect(e instanceof InvalidArgumentError);
                }
                expect(err).to.equal('Dimension, description, should be a non-empty stirng')
            });
        });
    });

    describe('Testing get wordType', () => {
        describe('Positive tests:', () => {
            it('Testing adding valid values', async () => {
                await addWordType(testingWordTypeInputs);

                const wordType = await getWordType({ wordTypeId: testingWordTypeInputs.id });
                console.log("+++", wordType)
                expect(wordType).to.deep.equal(testingWordTypeInputs);
            });
        });

        describe('Negative tests:', () => {
            it('Testing getting non-existant wordType', async () => {
                const wordType = await getWordType({ wordTypeId: uuidv4() });
                expect(wordType).to.null;
            });
        });
    });

    describe('Testing delete wordTypeById', () => {
        beforeEach(async () => {
            console.log('))))In Delete befor')
            await addWordType(testingWordTypeInputs);
        });

        describe('Positive tests:', () => {
            it('should delete wordType by Id', async () => {
                console.log("<><><><><><><><><><><><><>)))", testingWordTypeInputs.id)
                let resp = await deleteWordTypeById(testingWordTypeInputs.id)
                expect(resp).to.have.property('rowCount', 1);

                const fetchedWordType = await getWordType(testingWordTypeInputs.id)
                expect(fetchedWordType).to.be.undefined;
            });
        });

        describe('Negative tests:', () => {
            it('should fail to delete a wordType with id type', async () => {
                // let err;
                // try {
                //     await deleteWordTypeById(123);
                // } catch (e) {
                //     err = e.message;
                //     expect(e instanceof InvalidIdFieldType);
                // }
                // expect(err).to.equal('ID should be of type UUIDv4');
                const invalidDelete = await deleteWordTypeById(123);
                expect(invalidDelete).to.be.undefined;
            });

            it('should fail to delete a wordType with id', async () => {
                const invalidDelete = await deleteWordTypeById(uuidv4());
                expect(invalidDelete).to.have.property('command', 'DELETE');
                expect(invalidDelete).to.have.property('rowCount', 0);
            });
        });
    });

    describe('Testing delete wordTypeByName', () => {
        beforeEach(async () => {
            console.log('))))In Delete befor')
            await addWordType(testingWordTypeInputs);
        });

        describe('Positive tests:', () => {
            it('should delete wordType by name', async () => {
                let resp = await deleteWordTypeByWordTypeName({ WordTypeName: testingWordTypeInputs.name });
                expect(resp).to.not.be.undefined;
                expect(resp).to.have.property('rowCount', 1);
                expect(resp.rowCount).to.equal(1);

                const fetchedWordType = await getWordType({ wordTypeName: testingWordTypeInputs.name });
                expect(fetchedWordType).to.be.undefined;
            });
        });

        describe('Negative tests:', () => {
            it('should fail to delete a wordType with id type', async () => {
                const invalidDelete = await deleteWordTypeByWordTypeName(123);
                expect(invalidDelete).to.be.undefined;
            });


            it('should fail to delete a wordType with id', async () => {
                const invalidDelete = await deleteWordTypeByWordTypeName('abc');
                expect(invalidDelete).to.be.undefined;
                expect(invalidDelete instanceof InvalidArgumentError);
            });
        });
    });
});