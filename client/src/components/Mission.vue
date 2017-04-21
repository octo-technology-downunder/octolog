<template>
  <div class="mission">
    <div class="mission-logo-time">
      <img src="../assets/logo-octo-technology.jpg">
      <p>{{ mission.from }} – {{ mission.to }}</p>
      <div class="actions">
        <button v-on:click="editMission(mission)">Edit experience</button>
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

export default {
  props: ['mission'],
  methods: {
    editMission: function (mission) {
      console.log('editing mission ' + mission.customer)
      MissionModalHub.$emit('open-modal')
      MissionModalHub.$emit('set-modal-data', this.mission)
    }
  }
}
</script>
