const expect = require("chai").expect
const nock = require('nock')
const fs = require('fs')
const proxyquire = require('proxyquire')
const sinon = require('sinon')

const dynamo = { ExperiencesTable: {} , PeopleTable: {} }
const askbob = proxyquire('../askbob', { './dynamo/schema': dynamo });


const askbobCall = nock('http://askbob.octo.com')


const tge = JSON.parse(fs.readFileSync(__dirname + '/data/askbob-TGE.json').toString('utf8'))

describe("Askbob's integration: ", () => {
  beforeEach(() => {
    dynamo.PeopleTable.getP = sinon.stub()
    dynamo.PeopleTable.createP = sinon.stub()
  })

  afterEach(() => {
    dynamo.PeopleTable.getP.reset();
    dynamo.PeopleTable.createP.reset();
  })
  const nig = {
    trigram: 'NIG',
    name: 'default'
  }
  describe("when getting the CV from the DB", () => {
    describe("when the user is found", () => {
      it("return the user", () => {
        //given
        dynamo.PeopleTable.getP.withArgs("NIG", 'default').resolves({attrs: nig})

        //when
        return askbob.retrieveInfoFromDB("NIG", 'default').then((data) => {

          //then
          expect(data).to.deep.equal(nig)
        })
      })
    })

    describe("when the user is not found", () => {
      it("return the cv with the name object", () => {
        //given
        dynamo.PeopleTable.getP.withArgs("NIG", 'default').resolves(null)

        //when
        return askbob.retrieveInfoFromDB("NIG", 'default').then((data) => {

          //then
          expect(data).to.deep.equal({ name: 'default' })
        })
      })
    })
  })

  describe("when calling calling the api", () => {
    it("we get the JSON result", () => {
      //given
      const resultCall = askbobCall
                        .get('/api/v1/toto/people/TGE')
                        .reply(200, tge);

      //when
      const basicP = askbob.getInfo('toto', 'TGE');

      //then
      return basicP.then((basic) => {
        resultCall.isDone();
        expect(basic).to.deep.equal(tge.items[0])
      })
    })

    describe('from the http response', () => {
      describe("extracting basic info", () => {

        it("we return the old data", () => {
          //when
          const basic = askbob.extractBasic({ toto:"toto" }, tge.items[0]);

          //then
          expect(basic.toto).to.equal('toto')
        })

        it("we can extract name, firstname and job", () => {
          //when
          const basic = askbob.extractBasic({}, tge.items[0]);

          //then
          expect(basic.trigram).to.equal('TGE')
          expect(basic.firstName).to.equal('Thibaut')
          expect(basic.lastName).to.equal('Géry')
          expect(basic.job).to.equal('Consultant confirmé')
        })

        it("the data of the DB override the askbob data", () => {
          //when
          const basic = askbob.extractBasic({lastName: "GERY"}, tge.items[0]);

          //then
          expect(basic.trigram).to.equal('TGE')
          expect(basic.firstName).to.equal('Thibaut')
          expect(basic.lastName).to.equal('GERY')
          expect(basic.job).to.equal('Consultant confirmé')
        })
      })

      describe("extracting the picture", () => {
        it("we return the old data", () => {
          //when
          const basic = askbob.extractPicture({ toto:"toto" }, tge.items[0]);

          //then
          expect(basic.toto).to.equal('toto')
        })

        it("it add the preview picture from octopod", () => {
          //when
          const basic = askbob.extractPicture({}, tge.items[0]);

          //then
          expect(basic.pictureUrl).to.equal("http://s3.amazonaws.com/askbob/users/photos/312/preview/CINE1232.jpg")
        })

        it("it should not oveerride the existing picture", () => {
          //when
          const basic = askbob.extractPicture({ pictureUrl: "toto" }, tge.items[0]);

          //then
          expect(basic.pictureUrl).to.equal("toto")
        })
      })

      describe("extracting the skills", () => {
        it("we return the old data", () => {
          //when
          const basic = askbob.extractSkills({ toto:"toto" }, tge.items[0]);

          //then
          expect(basic.toto).to.equal('toto')
        })


        it("we populate the skills with skill > level 2", () => {
          //when
          const basic = askbob.extractSkills({}, tge.items[0]);

          //then
          expect(basic.skills.others).to.have.lengthOf(1)
          expect(basic.skills.others).to.include("PostgreSQL")
        })
      })
    })
  })
})
