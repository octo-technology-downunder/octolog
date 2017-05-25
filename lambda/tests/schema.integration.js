const expect = require("chai").expect
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const ExperiencesTable = require('../dynamo/schema').ExperiencesTable


describe("Schema: ", () => {

  describe('working with experiences', () => {
    const exp1 = {
      id: "890",
      trigram: "IDD",
      cvName: "toto",
      isOcto: true,
      octopodActivityId: 1234,
      octopodProjectId: 5678
    }

    const exp2 = {
      id: "8901",
      trigram: "IDD",
      cvName: "tutu",
      isOcto: true,
      octopodActivityId: 12341,
      octopodProjectId: 56781
    }

    beforeEach(() => {
      return Promise.all([
          ExperiencesTable.createP(exp1),
          ExperiencesTable.createP(exp2)
        ])
    })

    afterEach(() => {
      return Promise.all([
          ExperiencesTable.destroyP(exp1.trigram, exp1.id),
          ExperiencesTable.destroyP(exp2.trigram, exp2.id)
        ])
    })

    describe('when requesting by activity ID', () => {
      describe('when the experience exist in DB', () => {
        it("return the correct experience", () => {

          //when
          return ExperiencesTable.getExperienceByOctopodActivityIdP(1234)
            .then(actual => {

              //then
              expect(actual).to.deep.equal(exp1)
            })
        })
      })

      describe("when the experience doesn't existe in DB", () => {
        it("return null", () => {

          //when
          return ExperiencesTable.getExperienceByOctopodActivityIdP(123456)
            .then(actual => {

              //then
              expect(actual).to.deep.equal(null)
            })
        })
      })

    })

  })
})
