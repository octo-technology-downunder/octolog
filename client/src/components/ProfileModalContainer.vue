<template>
  <div class="modal-mask" v-if="active">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="person-edit">
          <h1>profile</h1>
          <input v-model="profile.job" />
          <input v-model="profile.pictureUrl" size="120" />          
        </div>
        <div class="education">
          <h1>education</h1>
          <textarea v-model="education" placeholder="- ..." rows="5" cols="120"></textarea>
        </div>
        <div class="skills">
          <h1>skills</h1>
          <div class="bloc bloc-skills">
            <h2>Technical skills</h2>
            <textarea v-model="technicalSkills" placeholder="- ..." rows="5" cols="50"></textarea>
          </div>
          <div class="bloc bloc-skills">
            <h2>Architecture &amp; Technologies</h2>
            <textarea v-model="architectureTechnologySkills" placeholder="- ..." rows="5" cols="50"></textarea>
          </div>
          <div class="divider"></div>
          <div class="bloc bloc-skills">
            <h2>Methodologies</h2>
            <textarea v-model="methodologySkills" placeholder="- ..." rows="5" cols="50"></textarea>
          </div>
          <div class="bloc bloc-skills">
            <h2>Publications / Responsibilities / Certifications</h2>
             <textarea v-model="achievementSkills" placeholder="- ..." rows="5" cols="50"></textarea>
          </div>
          <div class="divider"></div>
          <div class="bloc bloc-skills">
            <h2>Others</h2>
            <textarea v-model="otherSkills" placeholder="- ..." rows="5" cols="50"></textarea>
          </div>
          <button class="modal-default-button" v-on:click="updateProfile">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ProfileModalHub from '@/components/events/ProfileModalHub'
import axios from 'axios'

export default {
  data () {
    return {
      active: false,
      profile: {skills: {}},
      education: '',
      technicalSkills: '',
      architectureTechnologySkills: '',
      methodologySkills: '',
      achievementSkills: '',
      otherSkills: '',
      trigram: ''
    }
  },
  mounted () {
    this.$nextTick(function () {
      ProfileModalHub.$on('set-modal-data', this.set)
      ProfileModalHub.$on('open-modal', this.open)
    }.bind(this))
  },
  destroyed () {
    ProfileModalHub.$off('set-modal-data', this.set)
    ProfileModalHub.$off('open-modal', this.open)
  },
  methods: {
    open () {
      this.active = true
    },
    set (profile, trigram) {
      this.profile = profile
      this.education = this.mapArrayToMultilineList(profile.education)
      this.technicalSkills = this.mapArrayToMultilineList(profile.skills.technical)
      this.architectureTechnologySkills = this.mapArrayToMultilineList(profile.skills.architectureTechnologies)
      this.methodologySkills = this.mapArrayToMultilineList(profile.skills.methodologies)
      this.achievementSkills = this.mapArrayToMultilineList(profile.skills.achievements)
      this.otherSkills = this.mapArrayToMultilineList(profile.skills.others)
      this.trigram = trigram
    },
    updateProfile () {
      this.profile.education = this.mapMultilineListToArray(this.education)
      this.profile.skills.technical = this.mapMultilineListToArray(this.technicalSkills)
      this.profile.skills.architectureTechnologies = this.mapMultilineListToArray(this.architectureTechnologySkills)
      this.profile.skills.methodologies = this.mapMultilineListToArray(this.methodologySkills)
      this.profile.skills.achievements = this.mapMultilineListToArray(this.achievementSkills)
      this.profile.skills.others = this.mapMultilineListToArray(this.otherSkills)
      return axios.put(process.env.API_URL + process.env.UPDATE_BASICS_PATH.replace('{trigram}', this.trigram))
        .then((response) => {
          this.profile = response.data
          this.active = false
        })
        .catch(e => {
          console.log(e)
          this.errors.push(e)
        })
    },
    mapArrayToMultilineList (jsonArray) {
      if (jsonArray && jsonArray.length > 0) {
        return '- ' + jsonArray.join('\n- ')
      }
      return ''
    },
    mapMultilineListToArray (multilineList) {
      if (multilineList && multilineList.startsWith('- ')) {
        return multilineList.substring(2).split('\n- ')
      }
      return []
    }
  }
}
</script>
