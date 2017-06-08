<template>
  <div class="mission">
    <div class="mission-logo-time">
      <img v-bind:src="mission.customerLogo"/>
      <p>{{ mission.from }} – {{ mission.to }}</p>
      <div class="actions">
        <button v-on:click="editMission(mission)" class="hidden-print">Edit experience</button>
        <button v-on:click="deleteMission(mission)" class="hidden-print">Delete experience</button>
      </div>
    </div>
    <div class="mission-desc">
      <h2>{{ mission.role }} for {{ mission.customer }}</h2>
      <ul>
        <li v-for="(descriptionValue, descriptionKey) in mission.description">{{ descriptionValue }}</li>
      </ul>
      <p class="mission-keywords">{{ mission.tags ? mission.tags.join(', ') : ''}}</p>
    </div>
  </div>
</template>

<script>
import MissionModalHub from '@/components/events/MissionModalHub'
import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
  props: ['mission'],
  computed: {
    ...mapGetters([
      'trigram'
    ])
  },
  methods: {
    editMission: function (mission) {
      MissionModalHub.$emit('open-modal')
      MissionModalHub.$emit('set-modal-data', this.mission)
    },
    deleteMission: function (mission) {
      const experienceId = mission.id

      return axios.delete(process.env.API_URL + process.env.DELETE_EXPERIENCE_PATH.replace('{id}', experienceId).replace('{trigram}', this.trigram))
        .then((response) => {
          this.$store.commit('deleteOctoExperience', this.mission)
        })
        .catch(e => {
          console.log(e)
          this.errors.push(e)
        })
    }
  }
}
</script>
