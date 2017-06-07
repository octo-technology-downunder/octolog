import Vue from 'vue'
import Education from '@/components/Education'
import store from '../store'

function getRenderedEl (Component) {
  const Constructor = Vue.extend(Component)
  const vm = new Constructor({ store }).$mount()
  return vm.$el
}

describe('Education.vue', () => {
  beforeEach(function () {
    store.commit('setTrigram', 'TRI')
    store.commit('setProfile', {education: [], skills: {}})
  })

  it('should render title', () => {
    const renderedElement = getRenderedEl(Education)
    expect(renderedElement.querySelector('.education h1').textContent).to.equal('education')
  })

  it('should render correctly with one education item', () => {
    const fakeEducation = ['UTC']
    store.commit('setProfile', {education: fakeEducation, skills: {}})
    const renderedElement = getRenderedEl(Education)
    expect(renderedElement.querySelector('.bloc p').textContent).to.equal('UTC')
  })

  it('should render correctly with two education item', () => {
    const fakeEducation = ['UTC', 'CTU']
    store.commit('setProfile', {education: fakeEducation, skills: {}})
    const renderedElement = getRenderedEl(Education)
    expect(renderedElement.querySelectorAll('.bloc p')).to.have.lengthOf(2)
    expect(renderedElement.querySelectorAll('.bloc p')[0].textContent).to.equal('UTC')
    expect(renderedElement.querySelectorAll('.bloc p')[1].textContent).to.equal('CTU')
  })
})
