const expect = require("chai").expect
const fs = require('fs')
const proxyquire = require('proxyquire')
const sinon = require('sinon')

const dynamo = { ExperiencesTable: {} , PeopleTable: {} }
const basics = proxyquire('../basics', { './dynamo/schema': dynamo });

const tge = {
  "firstName": "Thibaut",
  "lastName": "Gery",
  "trigram": "TGE",
  "name": "default",
  "pictureUrl": "http://s3.amazonaws.com/askbob/users/photos/252/preview/221591_65_o.jpg",
  "job": "Consultant confirmé"
}


describe("CV webservice: ", () => {

  describe("when deleting the experience in the DB", () => {

    beforeEach(() => {
      dynamo.PeopleTable.getP = sinon.stub()
      dynamo.PeopleTable.destroyP = sinon.stub()
    })

    afterEach(() => {
      dynamo.PeopleTable.getP.reset();
      dynamo.PeopleTable.destroyP.reset();
    })

    describe("when there is no CV in the DB", () => {
      it("return an error", (done) => {
        //given
        dynamo.PeopleTable.getP.withArgs("TGE", 'default').resolves(null)
        const input = {
          path: {
            trigram: 'TGE',
            name: 'default'
          }
        }
        //when
        basics.delete(input, {}, (err, data) => {
          expect(err.message).to.equal('The CV default of TGE was not found')
          expect(data).to.not.exist
          done()
        })
      })
    })

    describe("when there is a CV in the DB", () => {
      it("remove the CV", (done) => {
        //given
        dynamo.PeopleTable.getP.withArgs("TGE", 'default').resolves(tge)
        dynamo.PeopleTable.destroyP.withArgs("TGE", 'default').resolves({})

        const input = {
          path: {
            trigram: 'TGE',
            name: 'default'
          }
        }
        //when
        basics.delete(input, {}, (err, data) => {
          expect(err).to.not.exist
          expect(dynamo.PeopleTable.destroyP.calledWithExactly("TGE", 'default')).to.be.true;
          done()
        })
      })
    })
  })
})


describe('CV model', () => {
  describe('default are setup', () => {
    describe('when no education', () => {
      // https://www.youtube.com/watch?v=YR5ApYxkU-U
      it('the education is initialised with an empty list', () => {
        //given
        const input = {}

        //when
        const actual = basics.setupDefault(input)

        //then
        expect(actual.education).to.deep.equal([])
      })
    })

    describe('when no skills', () => {
      it('the skill are initialise with an empty list', () => {
        //given
        const input = {}

        //when
        const actual = basics.setupDefault(input)

        //then
        expect(actual.skills).to.deep.equal({
            technical: [],
            architectureTechnologies: [],
            methodologies: [],
            achievements: [],
            others: []
        })
      })
    })
    describe('when there is a few skills', () => {
      it('the skill are initialise with an empty list and we keep the present one', () => {
        //given
        const input = {
          skills: {
            others: [ "toto" ]
          }
        }

        //when
        const actual = basics.setupDefault(input)

        //then
        expect(actual.skills).to.deep.equal({
            technical: [],
            architectureTechnologies: [],
            methodologies: [],
            achievements: [],
            others: [ "toto" ]
        })
      })
    })
  })
})
