<template>
  <div class="skills">
    <h1>skills</h1>
    <div v-if="skills.technical && skills.technical.length > 0" class="bloc bloc-skills">
      <h2>Technical skills</h2>
      <ul>
        <li v-for="technical in skills.technical">{{ technical }}</li>
      </ul>
    </div>
    <div v-if="skills.architectureTechnologies && skills.architectureTechnologies.length > 0" class="bloc bloc-skills">
      <h2>Architecture &amp; Technologies</h2>
      <ul>
        <li v-for="architectureTechnology in skills.architectureTechnologies">{{ architectureTechnology }}</li>
      </ul>
    </div>
    <div class="divider"></div>
    <div v-if="skills.methodologies && skills.methodologies.length > 0" class="bloc bloc-skills">
      <h2>Methodologies</h2>
      <ul>
        <li v-for="methodology in skills.methodologies">{{ methodology }}</li>
      </ul>
    </div>
    <div v-if="skills.achievements && skills.achievements.length > 0" class="bloc bloc-skills">
      <h2>Publications / Responsibilities / Certifications</h2>
      <ul>
        <li v-for="achievement in skills.achievements">{{ achievement }}</li>
      </ul>
    </div>
    <div class="divider"></div>
    <div v-if="skills.others && skills.others.length > 0" class="bloc bloc-skills">
      <h2>Others</h2>
      <ul>
        <li v-for="other in skills.others">{{ other }}</li>
      </ul>
    </div>

  </div>
</template>

<script>
export default {
  props: ['skills']
}
</script>
