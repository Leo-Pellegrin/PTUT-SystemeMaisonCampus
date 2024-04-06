<template>
    <v-container fluid>
        <v-row no-gutters class="mt-10">
            <v-sheet class="d-flex align-center w-100 mt-10" color="#F8F0E5" rounded="xl" :elevation="8">
                <div class="flex-grow-1"> <!-- Utilisation de la classe flex-grow-1 -->
                    <p class="text-h5 font-weight-bold ma-3">Détails du profil</p>
                </div>

                <div class="d-flex mx-5">
                    <v-btn v-if="Role == 'admin'" @click="dialogInvite = true" class="text-none" flat color="#4781de"
                        variant="outlined"><v-icon class="mr-1">mdi-plus</v-icon>Créer</v-btn>
                </div>
            </v-sheet>
        </v-row>

        <v-sheet class="mt-10" color="#F8F0E5" rounded="xl" :elevation="8">
            <v-row class="mt-10 d-flex justify-center">

                <v-col cols="6" class="mx-5">
                    <div>
                        <p>Informations générales</p>
                        <v-text-field class="mt-5" v-model="email" label="Email" :rules="emailrules" variant="outlined" required
                            placeholder="Entrez votre e-mail" readonly></v-text-field>

                        <v-text-field v-model="Role" label="Role" readonly variant="outlined"></v-text-field>
                        <v-text-field v-model="etablissement" label="Établissement" readonly
                            variant="outlined"></v-text-field>
                        <v-btn @click.prevent="$router.push({ path: '/changepassword' })">
                            Modifier le mot de passe
                        </v-btn>
                        <v-alert class="ma-5" v-model="alertsuccess" color="success" icon="$success"
                            title="Création du compte réussi" closable></v-alert>
                    
                    </div>
                </v-col>
            </v-row>
        </v-sheet>
        <v-dialog v-model="dialogInvite" max-width="400px" transition="dialog-top-transition">
            <v-card color="#F8F0E5" class="pa-5">
                <v-card-title>Création d'un compte</v-card-title>
                <v-form @submit.prevent="submit">
                    <v-text-field v-model="emailnewAccount" label="Email" :rules="emailrules" required></v-text-field>
                    <v-select label="Rôle" v-model="etabSelected" :items="listeEtabs" item-title="nometab"
                        item-value="numeroetab">
                    </v-select>
                    <div class="d-flex justify-center">
                        <v-btn class="mt-2" type="submit">Se connecter</v-btn>
                    </div>
                    <v-alert class="ma-5" v-model="alerterror" color="error" icon="$error"
                        title="Erreur dans la création d'un nouveau compte" text="L'email est peut être déjà utilisé"
                        closable></v-alert>
                </v-form>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup>
import router from '@/router';
import axios from 'axios';
import { onMounted, ref } from 'vue'


const email = ref('')
const Role = ref('')
const etablissement = ref('')
const listeEtabs = ref([])
const dialogInvite = ref(false);
const etabSelected = ref({ "nometab": "Administrateur", "id": "admin" });
const emailnewAccount = ref('')

const alerterror = ref(false)
const alertsuccess = ref(false)

onMounted(() => {
    getProfileData();
    getAllEtabs();
})

async function getAllEtabs() {
    axios.get('https://ptut-ptutcomptagemaisoncampus.koyeb.app/etablissement', {
        headers: {
            Authorization: localStorage.getItem("token")
        },
    }).then((response) => {
        response.data.forEach(element => {
            let etab = { nometab: element.nometab, id: element.numeroetab }
            listeEtabs.value.push(etab)
        });
        let admin = { nometab: 'Administrateur', id: "admin" }
        listeEtabs.value.push(admin)
    })
        .catch((error) => {
            if (error.response.status == 403) {
                localStorage.clear();
                router.push({ path: '/' })
            }
        })

}

async function getProfileData() {
    let data = atob(localStorage.getItem("token").split('.')[1])
    let user = JSON.parse(data)
    console.log(user)
    email.value = user.username
    Role.value = user.role
    if (user.role === 'admin') {
        etablissement.value = 'Tous les établissements'
    } else {
        axios.get('https://ptut-ptutcomptagemaisoncampus.koyeb.app/etablissement/2', {
            headers: {
                Authorization: localStorage.getItem("token")
            },
        }).then((response) => {
            etablissement.value = response.data[0].nometab
        })
            .catch((error) => {
                if (error.response.status == 403) {
                    localStorage.clear();
                    router.push({ path: '/' })
                }
            })
    }

}

async function submit() {
    console.log(etabSelected.value)
    console.log(emailnewAccount.value)

    axios.post('https://ptut-ptutcomptagemaisoncampus.koyeb.app/user/register', {
        username: emailnewAccount.value,
        role: etabSelected.value.id
    }, {
        headers: {
            Authorization: localStorage.getItem("token")
        }
    }).then((response) => {
        if (response.status == 403) {
            localStorage.clear();
            router.push({ path: '/' })
        }

        if (response.status == 200) {
            dialogInvite.value = false;
            alertsuccess.value = true;
            setTimeout(() => {
                alertsuccess.value = false;
            }, 3000);
        }
    }).catch(() => {
        alerterror.value = true;
        setTimeout(() => {
            alerterror.value = false;
        }, 3000);
    })
}

</script>

<style scoped></style>