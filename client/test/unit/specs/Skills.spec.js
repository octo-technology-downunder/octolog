import Vue from 'vue'
import Skills from '@/components/Skills'
import store from '@/store'

function getRenderedEl (Component) {
  const Constructor = Vue.extend(Component)
  const vm = new Constructor({ store }).$mount()
  return vm.$el
}

describe('Skills.vue', () => {
  beforeEach(function () {
    store.commit('setTrigram', 'TRI')
    store.commit('setProfile', {education: [], skills: {}})
  })

  it('should not render any skill title if empty', () => {
    const renderedElement = getRenderedEl(Skills)
    expect(renderedElement.querySelectorAll('.bloc-skills h2')).to.have.lengthOf(0)
  })

  it('should render technical skills title if some', () => {
    store.commit('setProfile', {education: [], skills: {technical: ['something']}})
    const renderedElement = getRenderedEl(Skills)
    expect(renderedElement.querySelectorAll('.bloc-skills h2')[0].textContent).to.equal('Technical skills')
  })

  it('should render architecture skills title', () => {
    store.commit('setProfile', {education: [], skills: {architectureTechnologies: ['something']}})
    const renderedElement = getRenderedEl(Skills)
    expect(renderedElement.querySelectorAll('.bloc-skills h2')[0].textContent).to.equal('Architecture & Technologies')
  })

  it('should render methodologies skills title', () => {
    store.commit('setProfile', {education: [], skills: {methodologies: ['something']}})
    const renderedElement = getRenderedEl(Skills)
    expect(renderedElement.querySelectorAll('.bloc-skills h2')[0].textContent).to.equal('Methodologies')
  })

  it('should render achievments skills title', () => {
    store.commit('setProfile', {education: [], skills: {achievements: ['something']}})
    const renderedElement = getRenderedEl(Skills)
    expect(renderedElement.querySelectorAll('.bloc-skills h2')[0].textContent).to.equal('Publications / Responsibilities / Certifications')
  })

  it('should render others skills title', () => {
    store.commit('setProfile', {education: [], skills: {others: ['something']}})
    const renderedElement = getRenderedEl(Skills)
    expect(renderedElement.querySelectorAll('.bloc-skills h2')[0].textContent).to.equal('Others')
  })

  it('should render all skills', () => {
    store.commit('setProfile', {education: [], skills: fakeSkills})
    const renderedElement = getRenderedEl(Skills)
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
