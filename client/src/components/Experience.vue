<template>
  <div class="experience">
    <h1>missions <span> - for OCTO Technology</span></h1>
    <missionModalContainer></missionModalContainer>
    <div class="experience">
      <mission v-for="mission in octoMissions" v-bind:mission="mission" :key="mission.id"></mission>
    </div>
    <button v-on:click="syncOctopod" class="hidden-print">Retrieve latest missions from Octopod</button>    
    <h1>experience <span> - prior to OCTO Technology</span></h1>
    <div class="experience">
      <mission v-for="mission in priorExperience" v-bind:mission="mission" :key="mission.id"></mission>
    </div>
    <button v-on:click="addExperience" class="hidden-print">Add previous experience</button>    
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
      octoMissions: [],
      priorExperience: [],
      errors: []
    }
  },
  created () {
    this.fetchExperience()
  },
  methods: {
    fetchExperience () {
      const trigram = this.$store.state.trigram
      return axios.get(process.env.API_URL + process.env.LIST_EXPERIENCES_PATH.replace('{trigram}', trigram))
        .then((response) => {
          this.octoMissions = response.data.octo
          this.priorExperience = response.data.priorToOcto
        })
        .catch(e => {
          console.log(e)
          this.errors.push(e)
        })
    },
    syncOctopod () {
      const trigram = this.$store.state.trigram
      return axios.post(process.env.API_URL + process.env.SYNC_OCTOPOD_PATH.replace('{trigram}', trigram))
        .then((response) => {
          this.octoMissions = response.data
        })
        .catch(e => {
          console.log(e)
          this.errors.push(e)
        })
    },
    addExperience () {
    }
  }
}
</script>
