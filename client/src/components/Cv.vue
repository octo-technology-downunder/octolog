<template>
  <div class="cv">
    <profile v-bind:profile="profile"></profile>
    <education v-bind:education="profile.education"></education>
    <skills v-bind:skills="profile.skills"></skills>
    <profileModalContainer></profileModalContainer>
    <button v-on:click="syncAskbob" class="hidden-print">Retrieve details from AskBob</button>
    <button v-on:click="editProfile(profile)" class="hidden-print">Edit profile</button>
    <experience></experience>
  </div>
</template>

<script>
import Profile from '@/components/Profile'
import Experience from '@/components/Experience'
import Education from '@/components/Education'
import Skills from '@/components/Skills'
import axios from 'axios'
import ProfileModalContainer from '@/components/ProfileModalContainer'
import ProfileModalHub from '@/components/events/ProfileModalHub'
import { mapGetters } from 'vuex'

export default {
  components: {Profile, Education, Skills, Experience, ProfileModalContainer, ProfileModalHub},
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters([
      'trigram'
    ])
  },
  data () {
    return {
      profile: {education: {}, skills: {}},
      errors: []
    }
  },
  created () {
    this.fetchProfile()
  },
  methods: {
    fetchProfile: function () {
      return axios.get(process.env.API_URL + process.env.UPDATE_BASICS_PATH.replace('{trigram}', this.trigram))
        .then((response) => {
          this.profile = response.data
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    editProfile: function (profile) {
      console.log('editing profile ' + profile)
      ProfileModalHub.$emit('open-modal')
      ProfileModalHub.$emit('set-modal-data', this.profile, this.trigram)
    },
    syncAskbob () {
      return axios.post(process.env.API_URL + process.env.SYNC_ASKBOB_PATH.replace('{trigram}', this.trigram))
        .then((response) => {
          Object.assign(this.profile, response.data)
          console.log(this.profile)
        })
        .catch(e => {
          this.errors.push(e)
        })
    }
  }
}
</script>
