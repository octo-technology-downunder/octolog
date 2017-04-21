<template>
  <div class="cv">
    <profile v-bind:profile="profile"></profile>
    <education v-bind:education="profile.education"></education>
    <skills v-bind:skills="profile.skills"></skills>
    <experience></experience>
  </div>
</template>

<script>
import Profile from '@/components/Profile'
import Experience from '@/components/Experience'
import Education from '@/components/Education'
import Skills from '@/components/Skills'
import axios from 'axios'

export default {
  components: {Profile, Education, Skills, Experience},
  data () {
    return {
      trigram: 'TGE',
      profile: {education: {}, skills: {}},
      errors: []
    }
  },
  created () {
    this.fetchProfile()
  },
  methods: {
    fetchProfile: function () {
      return axios.get(process.env.API_URL + process.env.LIST_BASICS_PATH.replace('{trigram}', this.trigram))
        .then((response) => {
          this.profile = response.data
        })
        .catch(e => {
          this.errors.push(e)
        })
    }
  }
}
</script>
