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
        dynamo.PeopleTable.getP.withArgs("TGE").resolves(null)
        const input = {
          path: {id: 'TGE'}
        }
        //when
        basics.delete(input, {}, (err, data) => {
          expect(err.message).to.equal('The person TGE was not found')
          expect(data).to.not.exist
          done()
        })
      })
    })

    describe("when there is a CV in the DB", () => {
      it("remove the CV", (done) => {
        //given
        dynamo.PeopleTable.getP.withArgs("TGE").resolves(tge)
        dynamo.PeopleTable.destroyP.withArgs("TGE").resolves({})

        const input = {
          path: {id: 'TGE'}
        }
        //when
        basics.delete(input, {}, (err, data) => {
          expect(err).to.not.exist
          expect(dynamo.PeopleTable.destroyP.calledWithExactly("TGE")).to.be.true;
          done()
        })
      })
    })
  })
})
