<script setup lang="ts">
import {ref} from "vue";

defineOptions({
  name: 'WelcomePage'
})

const name = ref("");
</script>

<template>
  <div text="red-500 2xl" p="4">
    welcome
  </div>
  <input type="text" v-model="name" pa="6" border="2 blue-500 rounded-lg" placeholder="Enter your name">
</template>
