import { getters } from '@/store/getters'

describe('store getters', () => {
  it('should order the octo missions by latest first', () => {
    const state = {
      experiences: fakeExperiences
    }
    const result = getters.octoMissions(state)
    expect(result).to.have.lengthOf(3)
    expect(result[0].to).to.equal('2010-11-22')
    expect(result[1].to).to.equal('2010-11-20')
    expect(result[2].to).to.equal('2010-11-19')
  })

  it('should order the prior to octo missions by latest first', () => {
    const state = {
      experiences: fakeExperiences
    }
    const result = getters.priorExperience(state)
    expect(result).to.have.lengthOf(2)
    expect(result[0].to).to.equal('2009-11-15')
    expect(result[1].to).to.equal('2009-11-14')
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
      'from': '2010-11-19',
      'to': '2010-11-20',
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
      'from': '2010-11-17',
      'to': '2010-11-22',
      'description': [
        'Help Econum frame the MVP of an online paying service for government of New-Caledonia',
        'Help Econum apply the Lean Startup approach',
        'Design the Software Solution',
        'Develop the solution full stack',
        'Setup environments and CI/CD on AWS'
      ],
      'tags': ['java', 'spring-boot', 'angular2', 'agile', 'lean startup']
    },
    {
      'id': 3,
      'projectId': 2146903523,
      'mission': 'F2016-496 - GOUVERNEMENT DE NOUVELLE-CALÉDONIE (AU) - PROJET PAIEMENT EN LIGNE',
      'customer': 'Gouvernement de Nouvelle-Calédonie (AU)',
      'customerLogo': 'http://www.welcometothejungle.co/uploads/company/logo/octo-technology.png',
      'role': 'Developer',
      'from': '2010-11-18',
      'to': '2010-11-19',
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
    },
    {
      'id': '123456789',
      'customer': 'Atari',
      'customerLogo': 'https://upload.wikimedia.org/wikipedia/fr/thumb/b/ba/Atari_Inc._2003_Logo.png/280px-Atari_Inc._2003_Logo.png',
      'role': 'Intern',
      'from': '2008-09-23',
      'to': '2009-11-15',
      'description': [
        'Improve coffee quality',
        'Automate printer low ink alert',
        'Develop closest sandwich shop application'
      ],
      'tags': ['coffee', 'printer', 'ink', 'errand']
    }
  ]
}
