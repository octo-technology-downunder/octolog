<template>
  <div class="home">
    <h2>Trigram</h2>
    <input class="trigram" v-model="trigram">
    <h2>OCTOLog Password</h2>
    <input type="password" class="password" v-model="password">
    <button class="validate" v-on:click="goToCv">OK</button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      trigram: '',
      password: ''
    }
  },
  methods: {
    goToCv: function () {
      axios.defaults.headers.common['X-Api-Key'] = this.password
      this.$store.commit('setPassword', this.password)
      this.$store.commit('setTrigram', this.trigram)
      this.$router.push({path: 'cv'})
    }
  }
}
</script>
