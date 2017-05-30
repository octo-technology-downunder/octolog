import Vue from 'vue'
import Education from '@/components/Education'
import store from '../store'

function getRenderedEl (Component, propsData) {
  const Constructor = Vue.extend(Component)
  const vm = new Constructor({ store, propsData }).$mount()
  return vm.$el
}

describe('Education.vue', () => {
  it('should render title', () => {
    const renderedElement = getRenderedEl(Education, {education: []})
    expect(renderedElement.querySelector('.education h1').textContent).to.equal('education')
  })

  it('should render correctly with one education item', () => {
    const fakeEducation = ['UTC']
    const renderedElement = getRenderedEl(Education, {education: fakeEducation})
    expect(renderedElement.querySelector('.bloc p').textContent).to.equal('UTC')
  })

  it('should render correctly with two education item', () => {
    const fakeEducation = ['UTC', 'CTU']
    const renderedElement = getRenderedEl(Education, {education: fakeEducation})
    expect(renderedElement.querySelectorAll('.bloc p')).to.have.lengthOf(2)
    expect(renderedElement.querySelectorAll('.bloc p')[0].textContent).to.equal('UTC')
    expect(renderedElement.querySelectorAll('.bloc p')[1].textContent).to.equal('CTU')
  })
})
