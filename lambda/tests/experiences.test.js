const expect = require("chai").expect
const fs = require('fs')
const proxyquire = require('proxyquire')
const sinon = require('sinon')

const dynamo = { ExperiencesTable: {} , PeopleTable: {}, query: {} }
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

  describe("when updating the experience in the DB", () => {

    beforeEach(() => {
      dynamo.ExperiencesTable.getP = sinon.stub()
      dynamo.ExperiencesTable.createP = sinon.stub()
      dynamo.ExperiencesTable.updateP = sinon.stub()
    })

    afterEach(() => {
      dynamo.ExperiencesTable.getP.reset();
      dynamo.ExperiencesTable.createP.reset();
      dynamo.ExperiencesTable.updateP.reset();
    })

    describe("when the parameters 'trigram' is not present", () => {
      it("return an 400 error", (done) => {
        //given
        const input = {
          pathParameters: {
            id: 'default'
          },
          body: "{}"
        }

        //when
        experiences.update(input, {}, (err, httpResponse) => {
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
          },
          body: "{}"
        }

        //when
        experiences.update(input, {}, (err, httpResponse) => {
          expect(err).to.not.exist
          const json = JSON.parse(httpResponse.body)
          expect(httpResponse.statusCode).to.equal(400)
          expect(json.message).to.equal("The path parameter 'id' is required")
          done()
        })
      })
    })

    describe("when there is no experience in the DB", () => {
      it("create the experience", (done) => {
        //given
        const exp = {
          trigram: 'TGE',
          id: '1234'
        }
        dynamo.ExperiencesTable.getP.withArgs("TGE", '1234').resolves(null)
        dynamo.ExperiencesTable.createP.resolves({ attrs: exp })
        const input = {
          pathParameters: {
            trigram: 'TGE',
            id: '1234'
          },
          body: "{}"
        }

        //when
        experiences.update(input, {}, (err, httpResponse) => {

          //then
          expect(err).to.not.exist
          const json = JSON.parse(httpResponse.body)
          expect(json.trigram).to.equal('TGE')
          expect(json.id).to.equal('1234')
          expect(dynamo.ExperiencesTable.createP.calledWithExactly(exp)).to.be.true;
          expect(dynamo.ExperiencesTable.updateP.called).to.be.false;
          done()
        })
      })
    })

    describe("when there is a experience in the DB", () => {
      it("update the experience", (done) => {
        //given
        const exp = {
          trigram: 'TGE',
          id: '1234'
        }
        dynamo.ExperiencesTable.getP.withArgs("TGE", '1234').resolves({ attrs: exp })
        dynamo.ExperiencesTable.updateP.resolves({ attrs: exp })
        const input = {
          pathParameters: {
            trigram: 'TGE',
            id: '1234'
          },
          body: "{}"
        }

        //when
        experiences.update(input, {}, (err, httpResponse) => {

          //then
          expect(err).to.not.exist
          const json = JSON.parse(httpResponse.body)
          expect(json.trigram).to.equal('TGE')
          expect(json.id).to.equal('1234')
          expect(dynamo.ExperiencesTable.createP.called).to.be.false;
          expect(dynamo.ExperiencesTable.updateP.calledWithExactly(exp)).to.be.true;

          done()
        })
      })
    })
  })

  describe("when creating the experience in the DB", () => {

    beforeEach(() => {
      dynamo.ExperiencesTable.createP = sinon.stub()
    })

    afterEach(() => {
      dynamo.ExperiencesTable.createP.reset();
    })
    describe("when the parameters 'trigram' is not present", () => {
      it("return an 400 error", (done) => {
        //given
        const input = {
          pathParameters: {
            name: 'default'
          },
          body: "{}"
        }

        //when
        experiences.create(input, {}, (err, httpResponse) => {
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
          },
          body: "{}"
        }

        //when
        experiences.create(input, {}, (err, httpResponse) => {
          expect(err).to.not.exist
          const json = JSON.parse(httpResponse.body)
          expect(httpResponse.statusCode).to.equal(400)
          expect(json.message).to.equal("The path parameter 'name' is required")
          done()
        })
      })
    })


    describe("when there is no errors", () => {
      it("return the CV", (done) => {
        //given
        const cv = {
          name: 'default',
          trigram: 'TGE'
        }

        dynamo.ExperiencesTable.createP.resolves({ attrs: cv})
        const input = {
          pathParameters: {
            trigram: 'TGE',
            name: 'default'
          },
          body: "{}"
        }

        //when
        experiences.create(input, {}, (err, httpResponse) => {
          expect(err).to.not.exist
          expect(httpResponse.statusCode).to.equal(201)
          const json = JSON.parse(httpResponse.body)
          expect(json.name).to.equal('default')
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

  describe("when getting all the experience of one resume", () => {

    beforeEach(() => {
      dynamo.ExperiencesTable.query = sinon.stub()
      dynamo.query.exec = sinon.stub()
    })

    afterEach(() => {
      dynamo.ExperiencesTable.query.reset();
      dynamo.query.exec.reset();
    })

    describe("when the parameters 'trigram' is not present", () => {
      it("return an 400 error", (done) => {
        //given
        const input = {
          pathParameters: {
            name: 'default'
          }
        }

        //when
        experiences.getAll(input, {}, (err, httpResponse) => {
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
        experiences.getAll(input, {}, (err, httpResponse) => {
          expect(err).to.not.exist
          const json = JSON.parse(httpResponse.body)
          expect(httpResponse.statusCode).to.equal(400)
          expect(json.message).to.equal("The path parameter 'name' is required")
          done()
        })
      })
    })


    describe("when there is no issue", () => {
      it("return the CV with the correct name", (done) => {
        //given
        const experiencesData = [{
          id: '1234',
          trigram: 'TGE',
          cvName: 'default',
          isOcto: true
        },
        {
          id: '12345',
          trigram: 'TGE',
          cvName: 'other',
          isOcto: true
        }]

        function exec(cb) {
          cb(null, { Items: experiencesData.map(z => { return {attrs: z} })})
        }

        dynamo.ExperiencesTable.query.withArgs("TGE").returns({ exec })
        const input = {
          pathParameters: {
            trigram: 'TGE',
            name: 'default'
          }
        }

        //when
        experiences.getAll(input, {}, (err, httpResponse) => {
          expect(err).to.not.exist
          expect(httpResponse.statusCode).to.equal(200)
          const json = JSON.parse(httpResponse.body)
          console.log(json)
          expect(json.octo.length).to.equal(1)
          expect(json.octo[0].id).to.equal('1234')
          expect(json.octo[0].trigram).to.equal('TGE')
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
