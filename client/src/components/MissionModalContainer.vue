<template>
  <div class="mission-modal-mask" v-if="active">
    <div class="mission-modal-wrapper">
      <div class="mission-modal-container">
        <div class="mission">
          <div class="mission-logo-time">
            <img src="../assets/logo-octo-technology.jpg">
            <input v-model="mission.from">
            <input v-model="mission.to">
          </div>
          <div class="mission-desc">
            <h2><input v-model="mission.role"> for <input v-model="mission.customer"></h2>
            <textarea v-model="missionDescription" placeholder="- ...\n- ..." rows="5" cols="100"></textarea>
            <p class="mission-keywords"><input v-model.lazy="missionTags"></p>
          </div>
          <button class="mission-modal-default-button" v-on:click="close">
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MissionModalHub from '@/components/events/MissionModalHub'
import axios from 'axios'

export default {
  data () {
    return {
      active: false,
      mission: {},
      missionTags: '',
      missionDescription: ''
    }
  },
  mounted () {
    this.$nextTick(function () {
      MissionModalHub.$on('set-modal-data', this.set)
      MissionModalHub.$on('open-modal', this.open)
    }.bind(this))
  },
  destroyed () {
    MissionModalHub.$off('set-modal-data', this.set)
    MissionModalHub.$off('open-modal', this.open)
  },
  methods: {
    close () {
      this.updateMission()
    },
    open () {
      this.active = true
    },
    set (mission) {
      this.mission = mission
      this.missionTags = mission.tags ? mission.tags.join(',') : ''
      this.missionDescription = '- ' + (mission.description ? mission.description.join('\n- ') : '...')
    },
    updateMission () {
      this.mission.tags = this.missionTags.split(',')
      this.mission.description = this.missionDescription.substring(2).split('\n- ')
      console.log('Updating mission ' + JSON.stringify(this.mission))
      return axios.put(process.env.API_URL + process.env.UPDATE_EXPERIENCE_PATH.replace('{id}', this.mission.id))
        .then((response) => {
          this.mission = response.data
          console.log('Updating mission ' + JSON.stringify(this.mission))
          this.active = false
        })
        .catch(e => {
          this.errors.push(e)
        })
    }
  }
}
</script>
