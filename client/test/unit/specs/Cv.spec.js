import Vue from 'vue'
import Cv from '@/components/Cv'
import moxios from 'moxios'

describe('Cv.vue', () => {
  beforeEach(function () {
    moxios.install()
    moxios.stubRequest(process.env.API_URL + process.env.LIST_BASICS_PATH.replace('{trigram}', 'TRI'), {
      status: 200,
      responseText: fakeProfile
    })
  })

  afterEach(function () {
    moxios.uninstall()
  })

  it('should populate the profile data with API response', (done) => {
    const Constructor = Vue.extend(Cv)
    const vm = new Constructor().$mount()
    expect(vm.profile).to.be.an('object')
    expect(vm.profile).to.have.all.keys('education', 'skills')
    expect(vm.profile.education).to.be.empty
    expect(vm.profile.skills).to.be.empty
    vm.fetchProfile().then(() => {
      expect(vm.profile).to.be.an('object')
      expect(vm.profile).to.have.all.keys('firstName', 'lastName', 'pictureUrl', 'job', 'education', 'skills')
    }).then(done, done)
  })

  it('should have empty profile data', () => {
    const Constructor = Vue.extend(Cv)
    const vm = new Constructor().$mount()
    expect(vm.profile).to.have.all.keys('education', 'skills')
    expect(vm.profile.education).to.be.empty
    expect(vm.profile.skills).to.be.empty
  })

  it('should have empty errors data', () => {
    const Constructor = Vue.extend(Cv)
    const vm = new Constructor().$mount()
    expect(vm.errors).to.be.empty
  })
})

const fakeProfile = {
  'firstName': 'Billy',
  'lastName': 'Joe',
  'pictureUrl': 'https://pbs.twimg.com/profile_images/456738286732455936/uJGJyDbl.jpeg',
  'job': 'Architect',
  'education': ['UTC (Technical University of Compiegne)', 'City University of Hong Kong'],
  'skills': {
    'technical': ['platform/frameworks: node, iOS, Rails, J2EE, Play', 'Devops: Ansible, Puppet, Capistrano'],
    'architectureTechnologies': ['Architecture studies', 'Audits', 'API Design'],
    'methodologies': ['Agile', 'Lean', 'Lean Startup'],
    'achievments': ['Speaker', 'Blog articles']
  }
}
