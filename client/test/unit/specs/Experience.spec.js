import Vue from 'vue'
import Experience from '@/components/Experience'
import moxios from 'moxios'

describe('Experience.vue', () => {
  beforeEach(function () {
    moxios.install()
    moxios.stubRequest(process.env.API_URL + process.env.LIST_EXPERIENCES_PATH.replace('{trigram}', 'TGE'), {
      status: 200,
      responseText: fakeExperiences
    })
  })

  afterEach(function () {
    moxios.uninstall()
  })

  it('should populate the missions data with API response', (done) => {
    const Constructor = Vue.extend(Experience)
    const vm = new Constructor().$mount()
    expect(vm.missions).to.be.an('array')
    expect(vm.missions).to.be.empty
    vm.fetchExperience().then(() => {
      expect(vm.missions).to.be.an('array')
      expect(vm.missions).to.have.length(2)
    }).then(done, done)
  })

  it('should render title', () => {
    const Constructor = Vue.extend(Experience)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.experience h1').textContent).to.equal('missions  - for OCTO Technology Retrieve latest missions')
  })

  it('should have empty missions data', () => {
    const Constructor = Vue.extend(Experience)
    const vm = new Constructor().$mount()
    expect(vm.missions).to.be.empty
  })

  it('should have empty errors data', () => {
    const Constructor = Vue.extend(Experience)
    const vm = new Constructor().$mount()
    expect(vm.errors).to.be.empty
  })

  it('should display experiences vm.missions is populated', done => {
    const vm = new Vue(Experience).$mount()
    vm.missions = fakeExperiences
    Vue.nextTick(() => {
      expect(vm.$el.querySelectorAll('.mission')).to.have.lengthOf(2)
      done()
    })
  })
})

const fakeExperiences = [
  {
    'id': 1,
    'projectId': 2146903904,
    'mission': 'R2016-877 - ING DIRECT AUSTRALIA - AGILE TEAM',
    'customer': 'ING Direct Australia',
    'role': 'Developer 1',
    'from': 'Sep 2016',
    'to': 'Apr 2017',
    'description': {
      '1': 'Frame internal API product',
      '2': 'Design solution and push up technology choices',
      '3': 'Develop solution'
    },
    'tags': ['java', 'spring-boot', 'HSM', 'SSM', 'cryptography', 'agile']
  },
  {
    'id': 2,
    'projectId': 2146903523,
    'mission': 'F2016-496 - GOUVERNEMENT DE NOUVELLE-CALÉDONIE (AU) - PROJET PAIEMENT EN LIGNE',
    'customer': 'Gouvernement de Nouvelle-Calédonie (AU)',
    'role': 'Developer',
    'from': 'Jun 2016',
    'to': 'Sep 2016',
    'description': {
      '1': 'Help Econum frame the MVP of an online paying service for government of New-Caledonia',
      '2': 'Help Econum apply the Lean Startup approach',
      '3': 'Design the Software Solution',
      '4': 'Develop the solution full stack',
      '5': 'Setup environments and CI/CD on AWS'
    },
    'tags': ['java', 'spring-boot', 'angular2', 'agile', 'lean startup']
  }
]
