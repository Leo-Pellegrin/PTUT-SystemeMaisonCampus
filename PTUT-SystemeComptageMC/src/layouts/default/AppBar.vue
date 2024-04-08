<template>
  <div>
    <v-app-bar color="#0F2C59" :elevation="3">
      <v-app-bar-title>
        <p class="text-h4" v-on:click="$router.push({ path: '/' })">MC Count</p>
      </v-app-bar-title>
      <v-select v-if="connected" class="mt-5" v-model="selected" :disabled="!isAdmin" :items="items" item-title="name"
        item-value="id" label="Choisir l'établissement'" @update:model-value="changeBuilding" return-object></v-select>

      <v-spacer></v-spacer>

      <v-btn v-if="connected" variant="plain" size="x-large"
        v-on:click="$router.push({ path: '/historique' })">Historique</v-btn>

      <v-btn icon v-on:click="$router.push({ path: '/account' })" v-if="connected">
        <v-icon size="x-large">mdi-account-circle</v-icon>
      </v-btn>

      <v-btn v-if="connected" v-on:click="logout()">
        <v-icon size="x-large">mdi-logout</v-icon>
      </v-btn>

    </v-app-bar>
  </div>

</template>

<script setup>
import router from '@/router';
import { onMounted, ref, computed } from 'vue';
import axios from 'axios';

const connected = ref(false);
const items = ref([]);
const selected = ref({});
const userrole = ref("");

onMounted(() => {
  connected.value = localStorage.getItem("token");
  init()
});

async function getAllsBatiments() {

  await axios.get('https://ptut-ptutcomptagemaisoncampus.koyeb.app/etablissement/', {
    headers: {
      Authorization: localStorage.getItem("token")
    },
  }).then((response) => {
    response.data.forEach(element => {
      let etab = { name: element.nometab, id: element.numeroetab }
      items.value.push(etab)
    });
    selected.value = items.value[0];
  })
}

function logout() {
  localStorage.clear();
  router.push({ path: '/' })
}

function changeBuilding() {
  console.log("selected", selected.value)
  localStorage.setItem("idetab", selected.value.id);
  window.location.reload();
}

const isAdmin = computed(() => {
  const token = localStorage.getItem("token");
  if (token) {
    const user = JSON.parse(atob(token.split('.')[1]));
    if (user.role === "admin") {
      return true;
    }
  }
  return false;
});

async function init() {
  if (isAdmin.value) {
    await getAllsBatiments();
    if (localStorage.getItem("idetab") == null) {
      localStorage.setItem("idetab", selected.value.id);
      selected.value = items.value[0];
    }
    else {
      selected.value = items.value.find(item => item.id == localStorage.getItem("idetab"));
    }
  }
  else {
    userrole.value = JSON.parse(atob(localStorage.getItem("token").split('.')[1])).role;

    await axios
      .get('https://ptut-ptutcomptagemaisoncampus.koyeb.app/etablissement/' + userrole.value, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
      .then((response) => {
        selected.value = { name: response.data[0].nometab, id: response.data[0].numeroetab };
        localStorage.setItem("idetab", userrole.value);
      })
      .catch((error) => {
        console.log(error)
      });

  }
}


</script>

<style scoped>
.text-h4 {
  color: white;
}
</style>