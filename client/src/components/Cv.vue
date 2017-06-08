<template>
  <div class="cv">
    <profile></profile>
    <education></education>
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
    ...mapGetters([
      'trigram',
      'profile'
    ])
  },
  data () {
    return {
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
          this.$store.commit('setProfile', response.data)
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    editProfile: function (profile) {
      ProfileModalHub.$emit('open-modal')
      ProfileModalHub.$emit('set-modal-data')
    },
    syncAskbob () {
      return axios.post(process.env.API_URL + process.env.SYNC_ASKBOB_PATH.replace('{trigram}', this.trigram))
        .then((response) => {
          this.$store.commit('mergeProfile', response.data)
        })
        .catch(e => {
          this.errors.push(e)
        })
    }
  }
}
</script>
