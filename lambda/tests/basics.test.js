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

  describe("when getting the CV in the DB", () => {

    beforeEach(() => {
      dynamo.PeopleTable.getP = sinon.stub()
    })

    afterEach(() => {
      dynamo.PeopleTable.getP.reset();
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
        basics.get(input, {}, (err, httpResponse) => {
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
        basics.get(input, {}, (err, httpResponse) => {
          expect(err).to.not.exist
          const json = JSON.parse(httpResponse.body)
          expect(httpResponse.statusCode).to.equal(400)
          expect(json.message).to.equal("The path parameter 'name' is required")
          done()
        })
      })
    })
    describe("when there is no CV in the DB", () => {
      it("return an 404 error", (done) => {
        //given
        dynamo.PeopleTable.getP.withArgs("TGE", 'default').resolves(null)
        const input = {
          pathParameters: {
            trigram: 'TGE',
            name: 'default'
          }
        }

        //when
        basics.get(input, {}, (err, httpResponse) => {
          expect(err).to.not.exist
          const json = JSON.parse(httpResponse.body)
          expect(json.message).to.equal('The CV default of TGE was not found')
          done()
        })
      })
    })

    describe("when there is a CV in the DB", () => {
      it("return the CV", (done) => {
        //given
        const cv = {
          name: 'default',
          trigram: 'TGE',
          education: ['ISEP', 'UW']
        }
        dynamo.PeopleTable.getP.withArgs("TGE", 'default').resolves({ attrs: cv})
        const input = {
          pathParameters: {
            trigram: 'TGE',
            name: 'default'
          }
        }

        //when
        basics.get(input, {}, (err, httpResponse) => {
          expect(err).to.not.exist
          const json = JSON.parse(httpResponse.body)
          expect(json.name).to.equal('default')
          expect(json.trigram).to.equal('TGE')
          expect(json.skills.technical).to.deep.equal([])
          done()
        })
      })
    })
  })

  describe("when updating the experience in the DB", () => {

    beforeEach(() => {
      dynamo.PeopleTable.getP = sinon.stub()
      dynamo.PeopleTable.createP = sinon.stub()
      dynamo.PeopleTable.updateP = sinon.stub()
    })

    afterEach(() => {
      dynamo.PeopleTable.getP.reset();
      dynamo.PeopleTable.createP.reset();
      dynamo.PeopleTable.updateP.reset();
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
        basics.update(input, {}, (err, httpResponse) => {
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
        basics.update(input, {}, (err, httpResponse) => {
          expect(err).to.not.exist
          const json = JSON.parse(httpResponse.body)
          expect(httpResponse.statusCode).to.equal(400)
          expect(json.message).to.equal("The path parameter 'name' is required")
          done()
        })
      })
    })

    describe("when there is no CV in the DB", () => {
      it("create the CV", (done) => {
        //given
        const cv = {
          trigram: 'TGE',
          name: 'default'
        }
        dynamo.PeopleTable.getP.withArgs("TGE", 'default').resolves(null)
        dynamo.PeopleTable.createP.resolves({ attrs: cv })
        const input = {
          pathParameters: {
            trigram: 'TGE',
            name: 'default'
          },
          body: "{}"
        }

        //when
        basics.update(input, {}, (err, httpResponse) => {

          //then
          expect(err).to.not.exist
          const json = JSON.parse(httpResponse.body)
          expect(json.trigram).to.equal('TGE')
          expect(json.name).to.equal('default')
          expect(dynamo.PeopleTable.createP.calledWithExactly(cv)).to.be.true;
          expect(dynamo.PeopleTable.updateP.called).to.be.false;
          done()
        })
      })
    })

    describe("when there is a CV in the DB", () => {
      it("update the CV", (done) => {
        //given
        const cv = {
          trigram: 'TGE',
          name: 'default'
        }
        dynamo.PeopleTable.getP.withArgs("TGE", 'default').resolves({ attrs: cv })
        dynamo.PeopleTable.updateP.resolves({ attrs: cv })
        const input = {
          pathParameters: {
            trigram: 'TGE',
            name: 'default'
          },
          body: "{}"
        }

        //when
        basics.update(input, {}, (err, httpResponse) => {

          //then
          expect(err).to.not.exist
          const json = JSON.parse(httpResponse.body)
          expect(json.trigram).to.equal('TGE')
          expect(json.name).to.equal('default')
          expect(dynamo.PeopleTable.createP.called).to.be.false;
          expect(dynamo.PeopleTable.updateP.calledWithExactly(cv)).to.be.true;

          done()
        })
      })
    })
  })

  describe("when deleting the experience in the DB", () => {

    beforeEach(() => {
      dynamo.PeopleTable.getP = sinon.stub()
      dynamo.PeopleTable.destroyP = sinon.stub()
    })

    afterEach(() => {
      dynamo.PeopleTable.getP.reset();
      dynamo.PeopleTable.destroyP.reset();
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
        basics.delete(input, {}, (err, httpResponse) => {
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
        basics.delete(input, {}, (err, httpResponse) => {
          expect(err).to.not.exist
          const json = JSON.parse(httpResponse.body)
          expect(httpResponse.statusCode).to.equal(400)
          expect(json.message).to.equal("The path parameter 'name' is required")
          done()
        })
      })
    })

    describe("when there is no CV in the DB", () => {
      it("return an error", (done) => {
        //given
        dynamo.PeopleTable.getP.withArgs("TGE", 'default').resolves(null)
        const input = {
          pathParameters: {
            trigram: 'TGE',
            name: 'default'
          }
        }
        //when
        basics.delete(input, {}, (err, data) => {
          expect(JSON.parse(data.body).message).to.equal('The CV default of TGE was not found')
          expect(err).to.not.exist
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
          pathParameters: {
            trigram: 'TGE',
            name: 'default'
          }
        }
        //when
        basics.delete(input, {}, (err, data) => {
          expect(err).to.not.exist
          expect(data.statusCode).to.equal(204)

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
