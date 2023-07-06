const chai = require('chai');
const { expect } = require('chai');
const chaiHTTP = require('chai-http');

const app = require('../../app/app');
const dbClient = require('../../app/db');

chai.use(chaiHTTP);

describe('Testing wordType endpoints', () => {
    //#region Dummy data
    const wtOne = {
        name: 'magnet',
        description: 'letter troops explain huge into coast although price require cover correct allow degree art useful loud affect after increase source writing pencil call satisfied'
    };
    const wtTwo= {
        name: 'principal',
        description: 'press tobacco distance sum spring trouble brother origin hair are value tight source belong service did story consider his worried rocky lesson organization arrange'
    };
    const wtThree = {
        name: 'beginning',
        description: 'party camera poetry driven generally newspaper else feel suddenly been more cell mission football drew fellow split congress feature milk become dozen band consider'
    };
    //#endregion
    
    async function cleanup() {
        await dbClient.query(`
            delete from wordTypes
            where name in ($1, $2, $3)
            `, [wtOne.name, wtTwo.name, wtThree.name]);
    };

    describe('Testing POST on wordType endpoint', () => {
        before(async () => {
            await cleanup();
        });

        describe('Positive Tests', () => {
            describe('Adding wordType correctly', () => {
                it('should respond with statuss 200 for wordType with name and description', (done) => {
                    chai.request(app)
                        .post('/wordType')
                        .send(wtOne)
                        .end((_err, res) => {
                            console.log("bbbbbbbb", res.body.id)
                            expect(res).to.have.status(200);
                            expect(res.body).to.have.property('id');
                            wtOne.id = res.body.id;
                            done();
                        });
                });
            });
        });
        describe('Negative Tests', () => { });
    });
});