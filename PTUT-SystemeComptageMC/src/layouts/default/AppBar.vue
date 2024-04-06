<template>
  <div>
    <v-app-bar color="#0F2C59" :elevation="3">
      <v-app-bar-title>
        <p class="text-h4" v-on:click="$router.push({ path: '/' })">MC Count</p>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn v-if="connected" variant="plain" size="x-large" v-on:click="$router.push({ path: '/historique' })">Historique</v-btn>

      <v-btn icon v-on:click="$router.push({path: '/account'})" v-if="connected">
        <v-icon  size="x-large">mdi-account-circle</v-icon>
      </v-btn>

      <v-btn v-if="connected" v-on:click="logout()">
        <v-icon  size="x-large">mdi-logout</v-icon>
      </v-btn>

    </v-app-bar>
  </div>

</template>

<script setup>
import router from '@/router';
import { onMounted } from 'vue';
import { ref } from 'vue';

const connected = ref(false);

onMounted(() => {
  connected.value = localStorage.getItem("token");
}); 

function logout(){
  localStorage.clear();
  router.push({path: '/'})
}

</script>

<style scoped>
.text-h4 {
  color: white;
}
</style>