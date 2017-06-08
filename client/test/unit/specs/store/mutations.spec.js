import { mutations } from '@/store/mutations'

const { mergeProfile } = mutations

describe.only('store mutations', () => {
  it('should merge profile details', () => {
    const state = { profile: { education: ['two'], skills: { technical: ['something else'] } } }
    const addedProfile = { education: ['one'], skills: { technical: ['something'] } }
    mergeProfile(state, addedProfile)
    const expectedResult = { education: ['one', 'two'], skills: { technical: ['something', 'something else'] } }
    expect(state.profile).to.deep.equal(expectedResult)
  })
})
