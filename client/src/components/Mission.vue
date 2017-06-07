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
    // mix the getters into computed with object spread operator
    ...mapGetters([
      'trigram'
    ])
  },
  methods: {
    editMission: function (mission) {
      MissionModalHub.$emit('open-modal')
      MissionModalHub.$emit('set-modal-data', this.mission, this.trigram)
    },
    deleteMission: function (mission) {
      const expId = mission.id

      return axios.delete(process.env.API_URL + process.env.DELETE_EXPERIENCE_PATH.replace('{id}', expId).replace('{trigram}', this.trigram))
        .then((response) => {
          // TODO: send event to parent to remove mission from the list
          this.mission = null
        })
        .catch(e => {
          console.log(e)
          this.errors.push(e)
        })
    }
  }
}
</script>
