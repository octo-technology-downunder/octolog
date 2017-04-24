<template>
  <div class="experience">
    <h1>missions <span> - for OCTO Technology</span>&nbsp;<button v-on:click="syncOctopod">Retrieve latest missions</button></h1>
    <missionModalContainer></missionModalContainer>
    <div class="experience">
      <mission v-for="mission in missions" v-bind:mission="mission" :key="mission.id"></mission>
    </div>
    <h1>experience <span> - prior to OCTO Technology</span></h1>
  </div>
</template>

<script>
import Mission from '@/components/Mission'
import MissionModalContainer from '@/components/MissionModalContainer'
import axios from 'axios'

export default {
  components: {Mission, MissionModalContainer},
  data () {
    return {
      trigram: 'TGE',
      missions: [],
      errors: []
    }
  },
  created () {
    this.fetchExperience()
  },
  methods: {
    fetchExperience () {
      return axios.get(process.env.API_URL + process.env.LIST_EXPERIENCES_PATH.replace('{trigram}', this.trigram))
        .then((response) => {
          this.missions = response.data
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    syncOctopod () {
      return axios.post(process.env.API_URL + process.env.SYNC_OCTOPOD_PATH)
        .then((response) => {
          this.missions = response.data
          console.log(response.data)
        })
        .catch(e => {
          this.errors.push(e)
        })
    }
  }
}
</script>
