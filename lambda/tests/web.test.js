const expect = require("chai").expect

const web = require('../lib/web')

describe("lib/web: ", () => {

  describe("when doing a doing a HTTP request", () => {
    it('setup the CORS header', (done) => {
      //given

      //when
      web.prepareHttpRequest(999, {}, (err, res) => {
        //then
        expect(err).to.not.exists
        expect(res.statusCode).to.equal(999)
        expect(res.headers['Access-Control-Allow-Origin']).to.equal('*')
        expect(res.headers['Access-Control-Allow-Credentials']).to.be.true
        done()
      })
    })
  })

  describe("when ask for not found error", () => {
    it('return an 404 formated error', (done) => {
      //given
      errMsg = 'the error message'

      //when
      web.notFound(errMsg, (err, res) => {
        //then
        expect(err).to.not.exists
        expect(res.statusCode).to.equal(404)
        const json = JSON.parse(res.body)
        expect(json.message).to.equal(errMsg)
        done()
      })
    })
  })

  describe("when ask for param error", () => {
    it('return an 404 formated error', (done) => {
      //given
      errMsg = 'the error message'

      //when
      web.paramError(errMsg, (err, res) => {
        //then
        expect(err).to.not.exists
        expect(res.statusCode).to.equal(400)
        const json = JSON.parse(res.body)
        expect(json.message).to.equal(errMsg)
        done()
      })
    })
  })

  describe("when ask for deleted", () => {
    it('return an 204 without any body', (done) => {
      //given

      //when
      web.deleted((err, res) => {
        //then
        expect(err).to.not.exists
        expect(res.statusCode).to.equal(204)
        expect(res.body).to.deep.equal('deleted')
        done()
      })
    })
  })

  describe("when ask for created answer", () => {
    it('return an 201 with the body as string', (done) => {
      //given
      body = ['toto', 'titi']

      //when
      web.created(body, (err, res) => {
        //then
        expect(err).to.not.exists
        expect(res.statusCode).to.equal(201)
        const json = JSON.parse(res.body)
        expect(json).to.deep.equal(body)
        done()
      })
    })
  })

  describe("when ask for ok answer", () => {
    it('return an 200 with the body as string', (done) => {
      //given
      body = ['toto', 'titi']

      //when
      web.ok(body, (err, res) => {
        //then
        expect(err).to.not.exists
        expect(res.statusCode).to.equal(200)
        const json = JSON.parse(res.body)
        expect(json).to.deep.equal(body)
        done()
      })
    })
  })
})
