const expect = require("chai").expect
const nock = require('nock')
const octopod = require("../octopod")

const octopodCall = nock('https://octopod.octo.com')
const octopodCallWithAuth = nock('https://octopod.octo.com', {
      reqheaders: {Authorization: "Bearer toto"}})

const people = [
  {
    "id": 2142664765,
    "last_name": "Lamrani",
    "first_name": "El Khadir",
    "nickname": "EKL",
    "url": "https://octopod.octo.com/api/v0/people/2142664765",
    "email": "eklamrani@octo.com",
    "job": {
      "id": 49,
      "name": "Consultant",
      "url": "https://octopod.octo.com/api/v0/jobs/49"
    },
    "lob": {
      "id": 9,
      "abbreviation": "MA",
      "url": "https://octopod.octo.com/api/v0/lobs/9"
    },
    "included_in_activity_rate": true,
    "created_at": "2017-04-18T07:18:30Z",
    "updated_at": "2017-04-18T07:18:30Z",
    "entry_date": "2017-04-17",
    "leaving_date": null
  },
  {
    "id": 2142664764,
    "last_name": "Noël-Leroux",
    "first_name": "Philippe",
    "nickname": "PNL",
    "url": "https://octopod.octo.com/api/v0/people/2142664764",
    "email": "pleroux@octo.com",
    "job": {
      "id": 58,
      "name": "Manager Biz",
      "url": "https://octopod.octo.com/api/v0/jobs/58"
    },
    "lob": {
      "id": 80,
      "abbreviation": "GBIZ",
      "url": "https://octopod.octo.com/api/v0/lobs/80"
    },
    "included_in_activity_rate": true,
    "created_at": "2017-04-10T13:01:21Z",
    "updated_at": "2017-04-18T11:38:27Z",
    "entry_date": "2017-05-02",
    "leaving_date": null
  }
]

describe("Octopod'integration: ", () => {
  describe("when getting the token", () => {
    it("return the  token", () => {

      //given
      const authCall = octopodCall
                        .post('/api/oauth/token',
                        "grant_type=client_credentials&client_id=client_credentials&client_secret=client_secret")
                        .reply(200, {
                          access_token: "4f44c9a8b8fe900583d711c5fb6a23f0766bf4b7214425b098d4f7319977445",
                          token_type: "bearer",
                          expires_in: 7200,
                          created_at: 1492567576
                        });

      //when
      const auth = octopod.getAuth('client_credentials', 'client_secret');

      //then
      return auth.then((token) => {
        authCall.isDone();
        expect(token).to.equal("Bearer 4f44c9a8b8fe900583d711c5fb6a23f0766bf4b7214425b098d4f7319977445")
      })
    })
  })

  describe("when getting the trigrams", () => {
    describe("when the trigram exist", () => {
      it("return the  token", () => {
        //given
        const idCall = octopodCallWithAuth
                          .get('/api/v0/people?all=true')
                          .reply(200, people);

        //when
        const idP = octopod.getOctoId('EKL', 'Bearer toto');

        //then
        return idP.then((id) => {
          idCall.isDone();
          expect(id).to.equal(2142664765)
        })
      })
    })

    describe("when the trigram doesn't exist", () => {
      it("return the  token", (done) => {
        //givenconst
        idCall = octopodCallWithAuth
                  .get('/api/v0/people?all=true')
                  .reply(200, people);
        //when
        const idP = octopod.getOctoId('TGE', 'Bearer toto');

        //then
        idP.then(done).catch(err => {
          expect(err.message).to.equal("Person TGE not found")
          done()
        })
      })
    })

  })
})
