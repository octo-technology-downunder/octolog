<template>
  <div class="education">
     <h1>education</h1>
      <div class="bloc">
        <p v-for="educationItem in education">{{ educationItem }}</p>
      </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'education'
    ])
  }
}
</script>
