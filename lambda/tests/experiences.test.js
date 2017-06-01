const expect = require("chai").expect
const fs = require('fs')
const proxyquire = require('proxyquire')
const sinon = require('sinon')

const dynamo = { ExperiencesTable: {} , PeopleTable: {} }
const experiences = proxyquire('../experiences', { './dynamo/schema': dynamo });

const exp = {}


describe("experiences webservice: ", () => {

  describe("when getting the experience in the DB", () => {

    beforeEach(() => {
      dynamo.ExperiencesTable.getP = sinon.stub()
    })

    afterEach(() => {
      dynamo.ExperiencesTable.getP.reset();
    })
    describe("when the parameters 'trigram' is not present", () => {
      it("return an 400 error", (done) => {
        //given
        const input = {
          pathParameters: {
            id: 'default'
          }
        }

        //when
        experiences.get(input, {}, (err, httpResponse) => {
          expect(err).to.not.exist
          expect(httpResponse.statusCode).to.equal(400)
          const json = JSON.parse(httpResponse.body)
          expect(json.message).to.equal("The path parameter 'trigram' is required")
          done()
        })
      })
    })

    describe("when the parameters 'name' is not present", () => {
      it("return an 400 error", (done) => {
        //given
        const input = {
          pathParameters: {
            trigram: 'TGE'
          }
        }

        //when
        experiences.get(input, {}, (err, httpResponse) => {
          expect(err).to.not.exist
          const json = JSON.parse(httpResponse.body)
          expect(httpResponse.statusCode).to.equal(400)
          expect(json.message).to.equal("The path parameter 'id' is required")
          done()
        })
      })
    })
    describe("when there is no experience in the DB", () => {
      it("return an 404 error", (done) => {
        //given
        dynamo.ExperiencesTable.getP.withArgs("TGE", '1234').resolves(null)
        const input = {
          pathParameters: {
            trigram: 'TGE',
            id: '1234'
          }
        }

        //when
        experiences.get(input, {}, (err, httpResponse) => {
          expect(err).to.not.exist
          const json = JSON.parse(httpResponse.body)
          expect(json.message).to.equal('The experience 1234 of TGE was not found')
          done()
        })
      })
    })

    describe("when there is a CV in the DB", () => {
      it("return the CV", (done) => {
        //given
        const cv = {
          id: '1234',
          trigram: 'TGE',
        }
        dynamo.ExperiencesTable.getP.withArgs("TGE", '1234').resolves({ attrs: cv})
        const input = {
          pathParameters: {
            trigram: 'TGE',
            id: '1234'
          }
        }

        //when
        experiences.get(input, {}, (err, httpResponse) => {
          expect(err).to.not.exist
          expect(httpResponse.statusCode).to.equal(200)
          const json = JSON.parse(httpResponse.body)
          expect(json.id).to.equal('1234')
          expect(json.trigram).to.equal('TGE')
          done()
        })
      })
    })
  })


  describe("when deleting the experience in the DB", () => {

    beforeEach(() => {
      dynamo.ExperiencesTable.getP = sinon.stub()
      dynamo.ExperiencesTable.destroyP = sinon.stub()
    })

    afterEach(() => {
      dynamo.ExperiencesTable.getP.reset();
      dynamo.ExperiencesTable.destroyP.reset();
    })

    describe("when the parameters 'trigram' is not present", () => {
      it("return an 400 error", (done) => {
        //given
        const input = {
          pathParameters: {
            id: 'default'
          }
        }

        //when
        experiences.delete(input, {}, (err, httpResponse) => {
          expect(err).to.not.exist
          expect(httpResponse.statusCode).to.equal(400)
          const json = JSON.parse(httpResponse.body)
          expect(json.message).to.equal("The path parameter 'trigram' is required")
          done()
        })
      })
    })

    describe("when the parameters 'id' is not present", () => {
      it("return an 400 error", (done) => {
        //given
        const input = {
          pathParameters: {
            trigram: 'TGE'
          }
        }

        //when
        experiences.delete(input, {}, (err, httpResponse) => {
          expect(err).to.not.exist
          const json = JSON.parse(httpResponse.body)
          expect(httpResponse.statusCode).to.equal(400)
          expect(json.message).to.equal("The path parameter 'id' is required")
          done()
        })
      })
    })

    describe("when there is no CV in the DB", () => {
      it("return an error", (done) => {
        //given
        dynamo.ExperiencesTable.getP.withArgs("TGE", "1234").resolves(null)
        const input = {
          pathParameters: {
            id: '1234',
            trigram: 'TGE'
          }
        }
        //when
        experiences.delete(input, {}, (err, httpResponse) => {
          console.log(err)
          expect(err).to.not.exist
          const json = JSON.parse(httpResponse.body)
          expect(httpResponse.statusCode).to.equal(404)
          expect(json.message).to.equal('The experience 1234 was not found')
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
          pathParameters: {
            id: '1234',
            trigram: 'TGE'
          }
        }
        //when
        experiences.delete(input, {}, (err, httpResponse) => {
          expect(err).to.not.exist
          expect(httpResponse.statusCode).to.equal(204)
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


describe('experience model', () => {
  describe('default are setup', () => {
    describe('when no tags', () => {
      it('the tags are initialised with an empty list', () => {
        //given
        const input = {}

        //when
        const actual = experiences.setupDefault(input)

        //then
        expect(actual.tags).to.deep.equal([])
      })
    })

    describe('when there is a  tags', () => {
      it('the tags stay the same', () => {
        //given
        const input = {
          tags: [ 'toto', 'titi' ]
        }

        //when
        const actual = experiences.setupDefault(input)

        //then
        expect(actual.tags).to.deep.equal(input.tags)
      })
    })

    describe('when no description', () => {
      it('the description is initialised with an empty list', () => {
        //given
        const input = {}

        //when
        const actual = experiences.setupDefault(input)

        //then
        expect(actual.description).to.deep.equal([])
      })
    })

    describe('when there is a description', () => {
      it('the description stay the same', () => {
        //given
        const input = {
          description: [ 'toto', 'titi' ]
        }

        //when
        const actual = experiences.setupDefault(input)

        //then
        expect(actual.description).to.deep.equal(input.description)
      })
    })

    describe('when there is no logo url', () => {
      it('the logo URL is initialised with an empty list', () => {
        //given
        const input = {}

        //when
        const actual = experiences.setupDefault(input)

        //then
        expect(actual.customerLogo).to.equal('')
      })
    })

    describe('when there is a logo', () => {
      it('the logo stay the same', () => {
        //given
        const input = {
          customerLogo: 'URL_LOGO'
        }

        //when
        const actual = experiences.setupDefault(input)

        //then
        expect(actual.customerLogo).to.deep.equal(input.customerLogo)
      })
    })
  })
})
