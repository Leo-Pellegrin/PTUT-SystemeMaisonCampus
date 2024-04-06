<template>
    <v-container fluid class="d-flex justify-center align-center">
        <v-row justify="center">
            <v-col cols="12" class="d-flex flex-column justify-center align-center">
                <v-card color="#F8F0E5" class="fill-height" width="60%" id="cardlogin" elevation="8">
                    <div class="d-flex justify-center">
                        <v-card-title class="font-weight-bold">Connexion</v-card-title>
                    </div>
                    <v-card-text color="#DAC0A3">
                        <v-form @submit.prevent="submit">
                            <v-text-field v-model="email" label="Email" :rules="emailrules" required></v-text-field>
                            <v-text-field v-model="password" label="Mot de passe" required :rules="passwordrules"
                                :type="show1 ? 'text' : 'password'" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append="show1 = !show1"></v-text-field>
                            <a href="" @click.prevent="forgotPassword()">Mot de passe oublié ?</a>
                            <v-alert class="ma-5" v-model="alert" color="error" icon="$error"
                                title="Veuillez renseigner votre email" closable></v-alert>

                            <div class="d-flex justify-center">
                                <v-btn class="mt-2" type="submit">Se connecter</v-btn>
                            </div>
                            <v-alert class="ma-5" v-model="alertsuccess" color="success" icon="$success"
                                title="Un email vous a été envoyé pour réinitialiser votre mot de passe"
                                closable></v-alert>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import router from '@/router';
import axios from 'axios';
import { onMounted } from 'vue';
import { ref } from 'vue';

const email = ref('');
const password = ref('');

const alert = ref(false);
const alertsuccess = ref(false);

const show1 = ref(false);

const emailrules = [
    value => !!value || 'Veuillez saisir votre adresse email',
    value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Adresse email invalide',
];

const passwordrules = [
    value => !!value || 'Veuillez saisir votre mot de passe',
    //   value => (value && value.length >= 6) || 'Le mot de passe doit comporter au moins 6 caractères',
];

async function submit(event) {
    event.preventDefault();
    console.log(email.value)

    axios.post('https://ptut-ptutcomptagemaisoncampus.koyeb.app/user/login/', {
        username: email.value,
        password: password.value
    }).then((response) => {
        console.log(response.data);
        if (response.status === 201) {
            localStorage.setItem("username", email.value)
            localStorage.setItem("oldpassword", password.value)
            router.push({ path: '/changepassword' })
        }
        else if (response.status === 200) {
            console.log("Connexion réussie")
            localStorage.setItem("token", response.data.token)
            router.push({ path: '/home' })
        }
        else {
            console.log("Erreur de connexion")
        }
    }).catch((error) => {
        console.log(error);
    });
}

async function forgotPassword() {
    if (email.value === '') {
        alert.value = true;
        setTimeout(() => {
            alert.value = false;
        }, 5000);
    } else {
        axios.post('https://ptut-ptutcomptagemaisoncampus.koyeb.app/user/forgotpassword', {
            email: email.value
        }).then((response) => {
            console.log(response.data);
            alertsuccess.value = true;
            setTimeout(() => {
                alertsuccess.value = false;
            }, 5000);
        }).catch((error) => {
            console.log(error);
        });
    }
}

onMounted(() => {
    if(localStorage.getItem("token")){
        router.push({ path: '/home' })
    }
})

</script>

<style scoped>
.v-alert-title {
    font-size: 1rem !important;
}

#cardlogin {
    margin-top: 15%;
    padding: 20px;
}
</style>