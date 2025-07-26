<script setup lang="ts">
import { ref } from 'vue'

defineOptions({
  name: 'WelcomePage',
})

const name = ref('')
</script>

<template>
  <div m="10">
    <div text="blue-500 2xl">
      Welcome<span v-if="name">,</span> <span color="green-600">{{ name }}</span>
    </div>
    <input v-model="name" mt="4" type="text" placeholder="Type name" class="input placeholder:text-pink-400">
  </div>
</template>
