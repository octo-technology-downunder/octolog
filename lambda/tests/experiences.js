const expect = require("chai").expect
const fs = require('fs')
const proxyquire = require('proxyquire')
const sinon = require('sinon')

const dynamo = { ExperiencesTable: {} , PeopleTable: {} }
const experiences = proxyquire('../experiences', { './dynamo/schema': dynamo });

const exp = {}


describe("experiences webservice: ", () => {

  describe("when deleting the experience in the DB", () => {

    beforeEach(() => {
      dynamo.ExperiencesTable.getP = sinon.stub()
      dynamo.ExperiencesTable.destroyP = sinon.stub()
    })

    afterEach(() => {
      dynamo.ExperiencesTable.getP.reset();
      dynamo.ExperiencesTable.destroyP.reset();
    })

    describe("when there is no CV in the DB", () => {
      it("return an error", (done) => {
        //given
        dynamo.ExperiencesTable.getP.withArgs("1234").resolves(null)
        const input = {
          path: {id: '1234'}
        }
        //when
        experiences.delete(input, {}, (err, data) => {
          expect(err.message).to.equal('The experience 1234 was not found')
          expect(data).to.not.exist
          done()
        })
      })
    })

    describe("when there is a CV in the DB", () => {
      it("remove the CV", (done) => {
        //given
        dynamo.ExperiencesTable.getP.withArgs("1234").resolves(exp)
        dynamo.ExperiencesTable.destroyP.withArgs("1234").resolves({})

        const input = {
          path: {id: '1234'}
        }
        //when
        experiences.delete(input, {}, (err, data) => {
          expect(err).to.not.exist
          expect(dynamo.ExperiencesTable.destroyP.calledWithExactly("1234")).to.be.true;
          done()
        })
      })
    })
  })
})
