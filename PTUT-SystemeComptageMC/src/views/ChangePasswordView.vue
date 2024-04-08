<template>
    <v-container fluid class="d-flex justify-center align-center">
        <v-row justify="center">
            <v-col cols="12" class="d-flex flex-column justify-center align-center">
                <v-card color="#F8F0E5" class="fill-height" width="60%" id="cardlogin" elevation="8">
                    <div class="d-flex justify-center">
                        <v-card-title class="font-weight-bold">Changement de mot de passe</v-card-title>
                    </div>
                    <v-card-text color="#DAC0A3">
                        <v-form @submit.prevent="submit">
                            <v-text-field v-model="oldpassword" label="Ancien mot de passe" required
                                :rules="passwordrules" :type="show1 ? 'text' : 'password'"
                                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append="show1 = !show1"></v-text-field>
                            <v-text-field v-model="newpassword" label="Nouveau mot de passe" required
                                :rules="passwordrules" :type="show2 ? 'text' : 'password'"
                                :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append="show2 = !show2"></v-text-field>
                            <v-text-field v-model="confirmpassword" label="Confirmer nouveau mot de passe" required
                                :rules="passwordrules" :type="show3 ? 'text' : 'password'"
                                :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append="show3 = !show3"></v-text-field>
                            <v-alert class="ma-5" v-model="alerterror" color="error" icon="$error"
                                title="Les mots de passe ne correspondent pas" closable></v-alert>

                            <div class="d-flex justify-center">
                                <v-btn class="mt-2" type="submit">Changer son mot de passe</v-btn>
                            </div>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue'
import router from '@/router';

onMounted(() => {
    oldpassword.value = localStorage.getItem("oldpassword")
})

const oldpassword = ref('')
const newpassword = ref('')
const confirmpassword = ref('')

const alerterror = ref(false)

const show1 = ref(false)
const show2 = ref(false)
const show3 = ref(false)

async function submit(event) {
    event.preventDefault()

    if (newpassword.value !== confirmpassword.value) {
        alerterror.value = true;
        setTimeout(() => {
            alerterror.value = false;
        }, 3000);
    }
    axios.post('https://ptut-ptutcomptagemaisoncampus.koyeb.app/user/changepassword/', {
        username: localStorage.getItem("username"),
        password: oldpassword.value,
        newPassword: newpassword.value
    })
        .then(response => {
            if(response.status == 200){
                localStorage.clear();
                router.push({path: '/'})
            }
        })
        .catch(error => {
            console.log(error)
        })
}

</script>