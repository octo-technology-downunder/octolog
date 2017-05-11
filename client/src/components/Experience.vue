<template>
  <div class="experience">
    <h1>missions <span> - for OCTO Technology</span></h1>
    <missionModalContainer></missionModalContainer>
    <div class="experience">
      <mission v-for="mission in missions" v-bind:mission="mission" v-bind:trigram="trigram" :key="mission.id"></mission>
    </div>
    <button v-on:click="syncOctopod" class="hidden-print">Retrieve latest missions from Octopod</button>    
    <h1>experience <span> - prior to OCTO Technology</span></h1>
  </div>
</template>

<script>
import Mission from '@/components/Mission'
import MissionModalContainer from '@/components/MissionModalContainer'
import axios from 'axios'

export default {
  props: ['trigram'],
  components: {Mission, MissionModalContainer},
  data () {
    return {
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
      return axios.post(process.env.API_URL + process.env.SYNC_OCTOPOD_PATH.replace('{trigram}', this.trigram))
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
