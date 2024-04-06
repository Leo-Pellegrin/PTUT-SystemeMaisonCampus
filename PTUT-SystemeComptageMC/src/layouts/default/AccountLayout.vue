<template>
    <v-app class="backgroundcolor">
        <default-bar />
        <AccountView />
    </v-app>
</template>
  
<script setup>
import AccountView from '@/views/AccountView.vue';
import DefaultBar from './AppBar.vue'
</script>
  
<style scoped>

</style>
