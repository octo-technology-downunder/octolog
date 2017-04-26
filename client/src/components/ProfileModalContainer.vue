<template>
  <div class="modal-mask" v-if="active">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="education">
          <h1>education</h1>
          <textarea v-model="education" placeholder="- ...\n- ..." rows="5" cols="120"></textarea>
        </div>
        <div class="skills">
          <h1>skills</h1>
          <div class="bloc bloc-skills">
            <h2>Technical skills</h2>
            <textarea v-model="technicalSkills" placeholder="- ...\n- ..." rows="5" cols="50"></textarea>
          </div>
          <div class="bloc bloc-skills">
            <h2>Architecture &amp; Technologies</h2>
            <textarea v-model="architectureTechnologySkills" placeholder="- ...\n- ..." rows="5" cols="50"></textarea>
          </div>
          <div class="divider"></div>
          <div class="bloc bloc-skills">
            <h2>Methodologies</h2>
            <textarea v-model="methodologySkills" placeholder="- ...\n- ..." rows="5" cols="50"></textarea>
          </div>
          <div class="bloc bloc-skills">
            <h2>Publications / Responsibilities / Certifications</h2>
             <textarea v-model="achievementSkills" placeholder="- ...\n- ..." rows="5" cols="50"></textarea>
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
      this.education = '- ' + profile.education.join('\n- ')
      this.technicalSkills = '- ' + profile.skills.technical.join('\n- ')
      this.architectureTechnologySkills = '- ' + profile.skills.architectureTechnologies.join('\n- ')
      this.methodologySkills = '- ' + profile.skills.methodologies.join('\n- ')
      this.achievementSkills = '- ' + profile.skills.achievements.join('\n- ')
      this.trigram = trigram
    },
    updateProfile () {
      this.profile.education = this.education.substring(2).split('\n- ')
      this.profile.skills.technical = this.technicalSkills.substring(2).split('\n- ')
      this.profile.skills.architectureTechnologies = this.architectureTechnologySkills.substring(2).split('\n- ')
      this.profile.skills.methodologies = this.methodologySkills.substring(2).split('\n- ')
      this.profile.skills.achievements = this.achievementSkills.substring(2).split('\n- ')
      return axios.put(process.env.API_URL + process.env.UPDATE_BASICS_PATH.replace('{trigram}', this.profile.trigram))
        .then((response) => {
          this.profile = response.data
          this.active = false
        })
        .catch(e => {
          this.errors.push(e)
        })
    }
  }
}
</script>
