<template>
  <div class="skills">
    <h1>skills</h1>
    <div class="bloc bloc-skills">
      <h2>Technical skills</h2>
      <ul>
        <li v-for="skill in skills.technical">{{ skill }}</li>
      </ul>
    </div>
    <div class="bloc bloc-skills">
      <h2>Architecture &amp; Technologies</h2>
      <ul>
        <li v-for="skill in skills.architectureTechnologies">{{ skill }}</li>
      </ul>
    </div>
    <div class="divider"></div>
    <div class="bloc bloc-skills">
      <h2>Methodologies</h2>
      <ul>
        <li v-for="skill in skills.methodologies">{{ skill }}</li>
      </ul>
    </div>
    <div class="bloc bloc-skills">
      <h2>Publications / Responsibilities / Certifications</h2>
      <ul>
        <li v-for="skill in skills.achievements">{{ skill }}</li>
      </ul>
    </div>

  </div>
</template>

<script>
export default {
  props: ['skills']
}
</script>
