import Vue from 'vue'
import Mission from '@/components/Mission'
import store from '@/store'

function getRenderedEl (Component, propsData) {
  const Constructor = Vue.extend(Component)
  const vm = new Constructor({ store, propsData }).$mount()
  return vm.$el
}

describe('Mission.vue', () => {
  beforeEach(function () {
    store.commit('setTrigram', 'TRI')
  })

  it('should not render without mission', () => {
    const renderedElement = getRenderedEl(Mission, {mission: {tags: []}})
    expect(renderedElement.textContent).to.equal('  –  Edit experience Delete experience  for   ')
  })

  it('should render mission keywords', () => {
    const renderedElement = getRenderedEl(Mission, {mission: fakeMission})
    expect(renderedElement.querySelector('.mission-keywords').textContent).to.equal('java, spring-boot, HSM, SSM, cryptography, agile')
  })

  it('should render mission time span', () => {
    const renderedElement = getRenderedEl(Mission, {mission: fakeMission})
    expect(renderedElement.querySelector('.mission-logo-time p').textContent).to.equal('Sep 2016 – Apr 2017')
  })

  it('should render mission description', () => {
    const renderedElement = getRenderedEl(Mission, {mission: fakeMission})
    expect(renderedElement.querySelectorAll('.mission-desc li')).to.have.lengthOf(3)
    expect(renderedElement.querySelectorAll('.mission-desc li')[0].textContent).to.equal('Frame internal API product')
    expect(renderedElement.querySelectorAll('.mission-desc li')[1].textContent).to.equal('Design solution and push up technology choices')
    expect(renderedElement.querySelectorAll('.mission-desc li')[2].textContent).to.equal('Develop solution')
  })
})

const fakeMission = {
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
}
