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
        dynamo.ExperiencesTable.getP.withArgs("TGE", "1234").resolves(null)
        const input = {
          path: {
            id: '1234',
            trigram: 'TGE'
          }
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
        dynamo.ExperiencesTable.getP.withArgs("TGE", "1234").resolves(exp)
        dynamo.ExperiencesTable.destroyP.withArgs("TGE", "1234").resolves({})

        const input = {
          path: {
            id: '1234',
            trigram: 'TGE'
          }
        }
        //when
        experiences.delete(input, {}, (err, data) => {
          expect(err).to.not.exist
          expect(dynamo.ExperiencesTable.destroyP.calledWithExactly("TGE", "1234")).to.be.true;
          done()
        })
      })
    })
  })
})


describe('experience web model', () => {
  describe('when there is no experiences', () => {
    it('initialise two empty list', () => {
      //given
      const input = []

      //when
      const actual = experiences.separateOctoAndNoneOctoExp(input)

      //then
      const expected = {
        octo: [],
        priorToOcto: []
      }
      expect(actual).to.deep.equal(expected)
    })
  })

  describe('when there is octo experiences', () => {
    it('fill the octo list', () => {
      //given
      const input = [{
        id: 1,
        isOcto: true
      }]

      //when
      const actual = experiences.separateOctoAndNoneOctoExp(input)

      //then
      const expected = {
        octo: [
          {
            id: 1
          }
        ],
        priorToOcto: []
      }
      expect(actual).to.deep.equal(expected)
    })
  })

  describe('when there is both experiences type', () => {
    it('fill the octo list', () => {
      //given
      const input = [{
        id: 1,
        isOcto: true
      },
      {
        id: 2,
        isOcto: false
      }]

      //when
      const actual = experiences.separateOctoAndNoneOctoExp(input)

      //then
      const expected = {
        octo: [
          {
            id: 1
          }
        ],
        priorToOcto: [
          {
            id: 2
          }
        ]
      }
      expect(actual).to.deep.equal(expected)
    })
  })
})
