const expect = require("chai").expect
const nock = require('nock')
const octopod = require("../octopod")

const octopodCall = nock('https://octopod.octo.com')

describe("Octopod: ", () => {
  describe("when getting the token", () => {
    it("return the  token", (done) => {
      const authCall = octopodCall
                        .post('/api/oauth/token',
                        "grant_type=client_credentials&client_id=client_credentials&client_secret=client_secret")
                        .reply(200, {
                          access_token: "4f44c9a8b8fe900583d711c5fb6a23f0766bf4b7214425b098d4f7319977445",
                          token_type: "bearer",
                          expires_in: 7200,
                          created_at: 1492567576
                        });
      const auth = octopod.getAuth('client_credentials', 'client_secret');
      auth.then((token) => {
        authCall.isDone();
        expect(token).to.equal("Authorization: Bearer 4f44c9a8b8fe900583d711c5fb6a23f0766bf4b7214425b098d4f7319977445")
        done();
      }, done)
    })
  })
})
