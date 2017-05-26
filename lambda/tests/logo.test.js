const expect = require("chai").expect
const nock = require('nock')
const fs = require('fs')
const sinon = require('sinon')
const _ = require('lodash')
const logo = require('../logo')


const wikiCall = nock('https://en.wikipedia.org')


describe("wikipedia's integration: ", () => {
  describe("when getting the list of company", () => {
    it("return the first item with name 'company'", () => {
      //given
      wikiCall.get('/w/api.php?action=query&format=json&errorformat=bc&errorlang=uselang&list=search&utf8=1&srsearch=AMP')
              .replyWithFile(200, __dirname + '/data/wikipedia/search_AMP.json');

      //when
      return logo.getLogoUrl('AMP')
        .then(data => {

          //then
          expect(data).to.equal('https://en.wikipedia.org/wiki/AMP%20Limited')
        })
    })

    describe('when no company key word', () => {
      it("return the first item", () => {
        //given
        wikiCall.get('/w/api.php?action=query&format=json&errorformat=bc&errorlang=uselang&list=search&utf8=1&srsearch=reddit')
                .replyWithFile(200, __dirname + '/data/wikipedia/search_reddit.json');

        //when
        return logo.getLogoUrl('reddit')
          .then(data => {

            //then
            expect(data).to.equal('https://en.wikipedia.org/wiki/Reddit')
          })
      })
    })

    describe('when no results', () => {
      it("return the first item", () => {
        //given
        wikiCall.get('/w/api.php?action=query&format=json&errorformat=bc&errorlang=uselang&list=search&utf8=1&srsearch=reddit')
                .replyWithFile(200, __dirname + '/data/wikipedia/search_empty.json');

        //when
        return logo.getLogoUrl('reddit')
          .then(data => {

            //then
            expect(data).to.equal('')
          })
      })
    })
  })
})
