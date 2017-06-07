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
import { mapGetters } from 'vuex'

export default {
  components: {Mission, MissionModalContainer},
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters([
      'trigram'
    ])
  },
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
      const latestEndingFirst = function (a, b) {
        if (a.to < b.to) {
          return 1
        }
        if (a.to > b.to) {
          return -1
        }
        return 0
      }
      return axios.get(process.env.API_URL + process.env.LIST_EXPERIENCES_PATH.replace('{trigram}', this.trigram))
        .then((response) => {
          this.octoMissions = response.data.octo
          if (this.octoMissions.length > 1) {
            this.octoMissions.sort(latestEndingFirst)
          }
          this.priorExperience = response.data.priorToOcto
          if (this.priorExperience.length > 1) {
            this.priorExperience.sort(latestEndingFirst)
          }
        })
        .catch(e => {
          console.log(e)
          this.errors.push(e)
        })
    },
    syncOctopod () {
      return axios.post(process.env.API_URL + process.env.SYNC_OCTOPOD_PATH.replace('{trigram}', this.trigram))
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
