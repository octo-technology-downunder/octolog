import Vue from 'vue'
import Skills from '@/components/Skills'

function getRenderedEl (Component, propsData) {
  const Ctor = Vue.extend(Component)
  const vm = new Ctor({ propsData }).$mount()
  return vm.$el
}

describe('Skills.vue', () => {
  it('should render technical skills title', () => {
    const renderedElement = getRenderedEl(Skills, {skills: {}})
    expect(renderedElement.querySelectorAll('.bloc-skills h2')[0].textContent).to.equal('Technical skills')
  })

  it('should render architecture skills title', () => {
    const renderedElement = getRenderedEl(Skills, {skills: {}})
    expect(renderedElement.querySelectorAll('.bloc-skills h2')[1].textContent).to.equal('Architecture & Technologies')
  })

  it('should render methodologies skills title', () => {
    const renderedElement = getRenderedEl(Skills, {skills: {}})
    expect(renderedElement.querySelectorAll('.bloc-skills h2')[2].textContent).to.equal('Methodologies')
  })

  it('should render achievments skills title', () => {
    const renderedElement = getRenderedEl(Skills, {skills: {}})
    expect(renderedElement.querySelectorAll('.bloc-skills h2')[3].textContent).to.equal('Publications / Responsibilities / Certifications')
  })

  it('should render all skills', () => {
    const renderedElement = getRenderedEl(Skills, {skills: fakeSkills})
    expect(renderedElement.querySelectorAll('.bloc-skills li')).to.have.lengthOf(8)
  })
})

const fakeSkills = {
  'technical': ['platform/frameworks: node, iOS, Rails, J2EE, Play', 'Devops: Ansible, Puppet, Capistrano'],
  'architectureTechnologies': ['Architecture studies', 'Audits', 'API Design'],
  'methodologies': ['Agile', 'Lean', 'Lean Startup'],
  'achievments': ['Speaker', 'Blog articles']
}
