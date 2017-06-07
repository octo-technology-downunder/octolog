import Vue from 'vue'
import Experience from '@/components/Experience'
import moxios from 'moxios'
import store from '../store'

function getRenderedVm (Component, propsData) {
  const Constructor = Vue.extend(Component)
  const vm = new Constructor({ store, propsData }).$mount()
  return vm
}

const fakeTrigram = 'TRI'

describe('Experience.vue', () => {
  beforeEach(function () {
    moxios.install()
    moxios.stubRequest(process.env.API_URL + process.env.LIST_EXPERIENCES_PATH.replace('{trigram}', fakeTrigram), {
      status: 200,
      responseText: fakeExperiences
    })
  })

  afterEach(function () {
    moxios.uninstall()
  })

  it('should populate the Octo missions data with API response', (done) => {
    const vm = getRenderedVm(Experience, {trigram: fakeTrigram})
    expect(vm.octoMissions).to.be.an('array')
    expect(vm.octoMissions).to.be.empty
    vm.fetchExperience().then(() => {
      expect(vm.octoMissions).to.be.an('array')
      expect(vm.octoMissions).to.have.length(2)
    }).then(done, done)
  })

  it('should render title', () => {
    const vm = getRenderedVm(Experience, {trigram: fakeTrigram})
    expect(vm.$el.querySelector('.experience h1').textContent).to.equal('missions  - for OCTO Technology')
  })

  it('should have empty Octo missions data', () => {
    store.commit('setExperiences', {octo: [], priorToOcto: []})
    const vm = getRenderedVm(Experience, {trigram: fakeTrigram})
    expect(vm.octoMissions).to.be.empty
  })

  it('should have empty errors data', () => {
    const vm = getRenderedVm(Experience, {trigram: fakeTrigram})
    expect(vm.errors).to.be.empty
  })

  it('should display experiences when vm.octoMissions is populated', done => {
    store.commit('setExperiences', fakeExperiences)
    const vm = getRenderedVm(Experience, {trigram: fakeTrigram})
    Vue.nextTick(() => {
      expect(vm.$el.querySelectorAll('.mission')).to.have.lengthOf(3)
      done()
    })
  })
})

const fakeExperiences = {
  'octo': [
    {
      'id': 1,
      'projectId': 2146903904,
      'mission': 'R2016-877 - ING DIRECT AUSTRALIA - AGILE TEAM',
      'customer': 'ING Direct Australia',
      'customerLogo': 'https://vuejs.org/images/logo.png',
      'role': 'Developer 1',
      'from': 'Sep 2016',
      'to': 'Apr 2017',
      'description': [
        'Frame internal API product',
        'Design solution and push up technology choices',
        'Develop solution'
      ],
      'tags': ['java', 'spring-boot', 'HSM', 'SSM', 'cryptography', 'agile']
    },
    {
      'id': 2,
      'projectId': 2146903523,
      'mission': 'F2016-496 - GOUVERNEMENT DE NOUVELLE-CALÉDONIE (AU) - PROJET PAIEMENT EN LIGNE',
      'customer': 'Gouvernement de Nouvelle-Calédonie (AU)',
      'customerLogo': 'http://www.welcometothejungle.co/uploads/company/logo/octo-technology.png',
      'role': 'Developer',
      'from': 'Jun 2016',
      'to': 'Sep 2016',
      'description': [
        'Help Econum frame the MVP of an online paying service for government of New-Caledonia',
        'Help Econum apply the Lean Startup approach',
        'Design the Software Solution',
        'Develop the solution full stack',
        'Setup environments and CI/CD on AWS'
      ],
      'tags': ['java', 'spring-boot', 'angular2', 'agile', 'lean startup']
    }
  ],
  'priorToOcto': [
    {
      'id': '123456789',
      'customer': 'Atari',
      'customerLogo': 'https://upload.wikimedia.org/wikipedia/fr/thumb/b/ba/Atari_Inc._2003_Logo.png/280px-Atari_Inc._2003_Logo.png',
      'role': 'Intern',
      'from': '2008-09-23',
      'to': '2009-11-14',
      'description': [
        'Improve coffee quality',
        'Automate printer low ink alert',
        'Develop closest sandwich shop application'
      ],
      'tags': ['coffee', 'printer', 'ink', 'errand']
    }
  ]}
