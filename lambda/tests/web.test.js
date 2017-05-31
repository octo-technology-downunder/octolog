const expect = require("chai").expect

const web = require('../lib/web')

describe("lib/web: ", () => {
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
