const expect = require("chai").expect
const nock = require('nock')
const fs = require('fs')
const proxyquire = require('proxyquire')
const sinon = require('sinon')

const dynamo = { ExperiencesTable: {} , PeopleTable: {} }
const askbob = proxyquire('../askbob', { './dynamo/schema': dynamo });


const askbobCall = nock('http://askbob.octo.com')


const tge = JSON.parse(fs.readFileSync(__dirname + '/data/askbob-TGE.json').toString('utf8'))

describe("Askbob API: ", () => {
  beforeEach(() => {
    dynamo.PeopleTable.getP = sinon.stub()
    dynamo.PeopleTable.createP = sinon.stub()
  })

  afterEach(() => {
    dynamo.PeopleTable.getP.reset();
    dynamo.PeopleTable.createP.reset();
  })
  const nig = {
    trigram: 'NIG'
  }
  describe("when getting the CV from the DB", () => {
    describe("when the user is found", () => {
      it("return the user", () => {
        //given
        dynamo.PeopleTable.getP.withArgs("NIG").resolves({attrs: nig})

        //when
        return askbob.retrieveInfoFromDB("NIG").then((data) => {

          //then
          expect(data).to.deep.equal(nig)
        })
      })
    })

    describe("when the user is not found", () => {
      it("return the empty object", () => {
        //given
        dynamo.PeopleTable.getP.withArgs("NIG").resolves(null)

        //when
        return askbob.retrieveInfoFromDB("NIG").then((data) => {

          //then
          expect(data).to.deep.equal({})
        })
      })
    })
  })

  describe("when calling calling the api", () => {
    it("we get the JSON result", () => {
      //given
      const resultCall = askbobCall
                        .get('/api/v1/people/TGE?api_key=toto')
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
      })

      describe("extracting the picture", () => {
        it("we return the old data", () => {
          //when
          const basic = askbob.extractSkills({ toto:"toto" }, tge.items[0]);

          //then
          expect(basic.toto).to.equal('toto')
        })
      })
    })
  })
})
