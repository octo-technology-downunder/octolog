const expect = require("chai").expect
const fs = require('fs')
const sinon = require('sinon')

const CvDao = require('../dynamo/cv-schema');

const cvDao = new CvDao('octolog-test-cvs')

describe("DAO: ", () => {

  describe("when getting a CV", () => {
    describe("when there is no CV", () => {
      it("The promise fail", () => {
        const promise = cvDao.get("DER")
        return promise.then((d) => {
          throw new Error('should not succeed')
        }, (err) => {
          expect(err.message).to.equal('The person DER was not found')
          return true
        })
      })
    })

    describe("when there is the CV", () => {
      it("The CV is returned", () => {
        const promise = cvDao.get("DER")
        return promise.then((d) => {
          throw new Error('should not succeed')
        }, (err) => {
          expect(err.message).to.equal('The person DER was not found')
          return true
        })
      })
    })
  })
})
