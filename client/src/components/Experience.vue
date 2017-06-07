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
import MissionModalHub from '@/components/events/MissionModalHub'
import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
  components: {Mission, MissionModalContainer},
  computed: {
    ...mapGetters([
      'trigram',
      'octoMissions',
      'priorExperience'
    ])
  },
  data () {
    return {
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
          this.$store.commit('setExperiences', response.data)
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
      MissionModalHub.$emit('open-modal')
    }
  }
}
</script>
