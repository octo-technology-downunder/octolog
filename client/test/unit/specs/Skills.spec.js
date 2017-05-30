import Vue from 'vue'
import Skills from '@/components/Skills'
import store from '../store'

function getRenderedEl (Component, propsData) {
  const Constructor = Vue.extend(Component)
  const vm = new Constructor({ store, propsData }).$mount()
  return vm.$el
}

describe('Skills.vue', () => {
  it('should not render any skill title if empty', () => {
    const renderedElement = getRenderedEl(Skills, {skills: {}})
    expect(renderedElement.querySelectorAll('.bloc-skills h2')).to.have.lengthOf(0)
  })

  it('should render technical skills title if some', () => {
    const renderedElement = getRenderedEl(Skills, {skills: {technical: ['something']}})
    expect(renderedElement.querySelectorAll('.bloc-skills h2')[0].textContent).to.equal('Technical skills')
  })

  it('should render architecture skills title', () => {
    const renderedElement = getRenderedEl(Skills, {skills: {architectureTechnologies: ['something']}})
    expect(renderedElement.querySelectorAll('.bloc-skills h2')[0].textContent).to.equal('Architecture & Technologies')
  })

  it('should render methodologies skills title', () => {
    const renderedElement = getRenderedEl(Skills, {skills: {methodologies: ['something']}})
    expect(renderedElement.querySelectorAll('.bloc-skills h2')[0].textContent).to.equal('Methodologies')
  })

  it('should render achievments skills title', () => {
    const renderedElement = getRenderedEl(Skills, {skills: {achievements: ['something']}})
    expect(renderedElement.querySelectorAll('.bloc-skills h2')[0].textContent).to.equal('Publications / Responsibilities / Certifications')
  })

  it('should render others skills title', () => {
    const renderedElement = getRenderedEl(Skills, {skills: {others: ['something']}})
    expect(renderedElement.querySelectorAll('.bloc-skills h2')[0].textContent).to.equal('Others')
  })

  it('should render all skills', () => {
    const renderedElement = getRenderedEl(Skills, {skills: fakeSkills})
    expect(renderedElement.querySelectorAll('.bloc-skills li')).to.have.lengthOf(10)
  })
})

const fakeSkills = {
  'technical': ['platform/frameworks: node, iOS, Rails, J2EE, Play', 'Devops: Ansible, Puppet, Capistrano'],
  'architectureTechnologies': ['Architecture studies', 'Audits', 'API Design'],
  'methodologies': ['Agile', 'Lean', 'Lean Startup'],
  'achievments': ['Speaker', 'Blog articles'],
  'others': ['English', 'Chinese']
}
