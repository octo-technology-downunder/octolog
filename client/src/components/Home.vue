<template>
  <div class="home">
    <h2>Enter your trigram</h2>
    <input class="trigram" v-model="trigram">
    <button class="validate" v-on:click="goToCv">OK</button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      trigram: ''
    }
  },
  created () {
  },
  methods: {
    goToCv: function () {
      this.$router.push({path: 'cv', query: {trigram: this.trigram.toUpperCase()}})
    }
  }
}
</script>
