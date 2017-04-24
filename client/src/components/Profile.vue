<template>
  <header>
    <img class="octo-logo" src="../assets/octo_logo.jpg" alt="Logo d'OCTO" width="190" height="100"/>
    <div class="person">
      <p>{{ profile.lastName }}<br>{{ profile.firstName }}<br>{{ profile.job }}</p>
      <img v-bind:src="profile.pictureUrl" alt="Picture">
    </div>
  </header>
</template>

<script>
export default {
  props: ['profile']
}
</script>
