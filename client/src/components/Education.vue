<template>
  <div class="education">
     <h1>education</h1>
      <div class="bloc">
        <p v-for="educationItem in education">{{ educationItem }}</p>
      </div>
  </div>
</template>

<script>

export default {
  props: ['education']
}
</script>
