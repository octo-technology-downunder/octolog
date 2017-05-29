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
export default {
  data () {
    return {
      trigram: '',
      password: ''
    }
  },
  created () {
  },
  methods: {
    goToCv: function () {
      this.$store.commit('setPassword', this.password)
      this.$router.push({path: 'cv', query: {trigram: this.trigram.toUpperCase()}})
    }
  }
}
</script>
