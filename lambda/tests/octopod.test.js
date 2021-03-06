const expect = require("chai").expect
const nock = require('nock')
const fs = require('fs')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const _ = require('lodash')
const dynamo = { ExperiencesTable: {} , PeopleTable: {} }
const logo = {}
const octopod = proxyquire('../octopod', {
  './dynamo/schema': dynamo,
  './logo': logo
});


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

describe("Octopod's integration: ", () => {
  describe("when getting the token", () => {
    it("return the token", () => {

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
      it("return the id", () => {
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
      it("return an error", (done) => {
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

  describe("when getting the activity", () => {
    it("return the activities", () => {
      //given
      const httpResponse = fs.readFileSync( __dirname + '/data/time_input.json')
      const actCall = octopodCallWithAuth
                        .get('/api/v0/people/EKL/time_input?page=1&per_page=1000')
                        .reply(200, httpResponse);

      //when
      const activitiesP = octopod.getActivitiesFromOctopod('Bearer toto', 'EKL');

      //then
      return activitiesP.then((activities) => {
        actCall.isDone();
        expect(activities).to.have.length(4)
        expect(activities[0]).to.deep.equal({
            "id": 3000003189,
            "title": "Shadowing",
            "from": "2013-11-12",
            "to": "2013-11-22",
            "nb_days": "6.0",
            "average_daily_rate": "0.0",
            "kind": "billable",
            "project": {
              "id": 2146900417,
              "url": "https://octopod.octo.com/api/v0/projects/2146900417",
              "name": "Refonte Neptune",
              "kind": "fixed_price",
              "reference": "F2013-392",
              "status": "mission_done",
              "customer": {
                "id": 1285,
                "name": "Pacifica"
              }
            }
          })
      })
    })
  })
  describe("when inserting the experience in the DB", () => {

    beforeEach(() => {
      dynamo.ExperiencesTable.getExperienceByOctopodActivityIdP = sinon.stub()
      dynamo.ExperiencesTable.createP = sinon.stub()
      logo.main = sinon.stub()

    })

    afterEach(() => {
      dynamo.ExperiencesTable.getExperienceByOctopodActivityIdP.reset();
      dynamo.ExperiencesTable.createP.reset();
      logo.main.reset();
    })

    const experience = {
        id: "345",
        octopodProjectId: 2146904557,
        octopodActivityId: 3000024114,
        octopodCustomerId: 2001,
        from: "2016-08-09",
        cvName: "default",
        to: "2016-08-23",
        trigram: 'TGE',
        isOcto: true,
        mission: "Catering prediction as a service",
        customer: "Qantas",
        role: "Consultant Senior"
      }

    const activity = {
      "id": 3000024114,
      "title": "Consultant Senior",
      "nb_days": "5.0",
      "from": "2016-08-09",
      "to": "2016-08-23",
      "average_daily_rate": "1800.0",
      "kind": "billable",
      "project": {
        "id": 2146904557,
        "url": "https://octopod.octo.com/api/v0/projects/2146904557",
        "name": "Catering prediction as a service",
        "kind": "fixed_price",
        "reference": "F2017-22",
        "status": "mission_signed",
        "customer": {
          "id": 2001,
          "name": "Qantas"
        }
      }
    }

    describe("there is no experience in the DB", () => {
      it("insert the activity as a experience", () => {
        //given
        const experienceFromOtherCV = _.cloneDeep(experience)
        experienceFromOtherCV.cvName = "other"
        dynamo.ExperiencesTable.getExperienceByOctopodActivityIdP.withArgs(3000024114).resolves([experienceFromOtherCV])
        dynamo.ExperiencesTable.createP.resolves({attrs: experience})
        logo.main.resolves('http://static.octo.com/assets/logo.png')

        //when
        return octopod.createExperienceIfNotexisting([activity], 'TGE', 'default')
          .then(experiences => {

            //then
            const actualExperience = experiences[0]
            const expectedExperience = experience
            expectedExperience.description = []
            expect(actualExperience).to.deep.equal(expectedExperience)
            const expectedExp = _.cloneDeep(experience)
            delete expectedExp.id
            expectedExp.customerLogo = 'http://static.octo.com/assets/logo.png'
            expect(dynamo.ExperiencesTable.createP.args[0][0]).to.deep.equal(expectedExp)
          })
      })
    })

    describe("there is already the experience in the DB", () => {
      it("does't insert the activity as a experience", () => {

        dynamo.ExperiencesTable.getExperienceByOctopodActivityIdP.withArgs(3000024114).resolves([experience])
        dynamo.ExperiencesTable.createP.resolves({attrs: experience})

        //when
        return octopod.createExperienceIfNotexisting([activity], 'TGE', 'default')
          .then(experiences => {

            //then
            const experience = experiences[0]
            expect(experience).to.deep.equal(experience)
            expect(dynamo.ExperiencesTable.createP.calledWithExactly(experience)).to.be.false;
          })
      })
    })
  })
})
