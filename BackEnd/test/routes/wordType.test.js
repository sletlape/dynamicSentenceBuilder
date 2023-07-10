const chai = require('chai');
const { expect } = require('chai');
const chaiHTTP = require('chai-http');

const app = require('../../app/app');
const dbClient = require('../../app/db');
const { getWordType, getAllWordTypes } = require('../../app/models/wordTypes');

chai.use(chaiHTTP);

describe('Testing wordType endpoints', () => {
    //#region Dummy data for post tests
    const wtNameAndDesc = {
        name: 'magnet',
        description: 'letter troops explain huge into coast although price require cover correct allow degree art useful loud affect after increase source writing pencil call satisfied'
    };
    const wtNameOnly = {
        name: 'principal',
    };
    const wtInvalidName = {
        name: 123,
        description: 'party camera poetry driven generally newspaper else feel suddenly been more cell mission football drew fellow split congress feature milk become dozen band consider'
    };
    const wtInvalidDescription = {
        name: 'beginning',
        description: 123
    };
    //#endregion

    async function cleanup() {
        await dbClient.query(
            `DELETE FROM wordTypes WHERE name IN ($1, $2,$3)`,
            [wtNameAndDesc.name, wtNameOnly.name, wtInvalidName.name]
        );
    }

    describe('Testing POST on wordType endpoint', () => {


        before(async () => {
            await cleanup();
        });

        describe('Positive Tests', () => {
            describe('Adding wordType correctly', () => {
                it('should respond with statuss 200 for wordType with name and description', (done) => {
                    chai.request(app)
                        .post('/wordType')
                        .send(wtNameAndDesc)
                        .end((_err, res) => {
                            expect(res).to.have.status(200);
                            expect(res.body).to.have.property('id');
                            wtNameAndDesc.id = res.body.id;
                            done();
                        });
                });

                it('should respond with statuss 200 for wordType with only name', (done) => {
                    //#ToDo: add make request a function, less repetition;
                    chai.request(app)
                        .post('/wordType')
                        .send(wtNameOnly)
                        .end((_err, res) => {
                            expect(res).to.have.status(200);
                            expect(res.body).to.have.property('id');
                            wtNameOnly.id = res.body.id;
                            done();
                        });
                });

                it('should give back the created wordType as in dummy data wtNameOnly. {get by id}', async () => {
                    const wordType = await getWordType({ wordTypeId: wtNameOnly.id });
                    console.log('wwwwwwww: ',wordType)
                    expect(wordType.id).to.equal(wtNameOnly.id);
                    expect(wordType.name).to.equal(wtNameOnly.name);
                    expect(wordType.description).to.equal(null)
                });
            });
        });

        describe('Negative Tests', () => {
            let rowsBefore;
            before(async () => {
                await cleanup();
            });

            describe('Adding wordType incorrectly. Request made with no data', () => {
                it('shoule return error with status 400', (done) => {
                    chai.request(app)
                        .post('/wordType')
                        .send()
                        .end((_err, res) => {
                            expect(res).to.have.status(400);
                            expect(res.body).to.have.property('message').to
                                .equal('Dimension, name, should be a non-empty string');
                            done();
                        })
                });
            });

            describe('Adding wordType incorrectly. Request made with invalid data', () => {
                it('shoule return error with status 400 due to invalid description', (done) => {
                    chai.request(app)
                        .post('/wordType')
                        .send(wtInvalidDescription)
                        .end((_err, res) => {
                            expect(res).to.have.status(400);
                            expect(res.body).to.have.property('message').to
                                .equal('Dimension, description, should be a non-empty string');
                            done();
                        })
                });
            });

        });
    });

    describe('Testing Get on the wordType endpoint', () => {

    });
});