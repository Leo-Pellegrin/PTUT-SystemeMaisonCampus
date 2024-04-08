<template>
    <v-container fluid>
        <!-- Bar de paramètres -->
        <v-row no-gutters class="mt-4">
            <v-sheet class="d-flex align-center w-100 mt-10" color="#F8F0E5" rounded="xl" :elevation="8">
                <v-btn class="justify-start text-body-1 ma-5" color="#DAC0A3" rounded="xl"
                    v-on:click="dialogSalle = true">
                    <p>Sélection Salle</p>
                    <v-icon size="x-large" class="ml-2" icon="mdi-menu-down" color="#0F2C59"></v-icon>
                </v-btn>
                <v-dialog v-model="dialogSalle" max-width="400px" transition="dialog-top-transition">
                    <v-card color="#F8F0E5">
                        <v-card-title>Sélection Salles</v-card-title>
                        <v-card-text color="#DAC0A3">
                            <v-checkbox v-model="selectAll" @change="selectAllItems"
                                :label="selectAll ? 'Désélectionner tout' : 'Sélectionner tout'" class="mb-n3">
                            </v-checkbox>
                            <v-checkbox v-model="selectGlobal" @change="selectGlobalItems"
                                :label="selectGlobal ? 'Fréquentation par salle' : 'Fréquentation globale'"
                                class="mb-n3">
                            </v-checkbox>
                            <v-divider :thickness="2"></v-divider>
                            <v-checkbox v-for="(item, index) in salles" :key="index" v-model="selectedSalles"
                                @change="selectDatachart" :label="item.name" :value="item.name">
                            </v-checkbox>
                        </v-card-text>
                    </v-card>
                </v-dialog>


                <v-btn class="justify-start text-body-1 ma-5" color="#DAC0A3" rounded="xl"
                    v-on:click="dialogDate = true">
                    <p>Sélection Date</p>
                    <v-icon size="x-large" class="ml-2" icon="mdi-menu-down" color="#0F2C59"></v-icon>
                </v-btn>
                <v-dialog v-model="dialogDate" max-width="400px" transition="dialog-top-transition">
                    <v-sheet color="#F8F0E5" class="d-flex justify-center">
                        <v-col>
                            <p class="text-h5 font-weight-bold text-center mb-3">Sélection des dates</p>
                            <v-locale-provider locale="fr">
                                <v-date-picker style="border: 1px solid #102C59" class="mx-auto my-5" :hide-header=true
                                    color="#102C59" bg-color="#F8F0E5" v-model="selectedDates" multiple="range"
                                    @update:model-value="selectedDateRange()"></v-date-picker>
                            </v-locale-provider>


                            <div class="d-flex justify-center">
                                <v-btn
                                    v-on:click="selectedDates = []; firstDate = undefined; lastDate = undefined; getDataFromApi()"
                                    :elevation="5" color="#102C59">Réinitialiser</v-btn>
                            </div>
                        </v-col>
                    </v-sheet>
                </v-dialog>

                <v-spacer></v-spacer>

                <v-btn class="justify-start text-body-1 ma-5" color="#DAC0A3" rounded="xl"
                    v-on:click="dialogExport = true">
                    <p>Exportation</p>
                </v-btn>
                <v-dialog v-model="dialogExport" max-width="400px" transition="dialog-top-transition">
                    <v-card>
                        <v-card-title>Exportation</v-card-title>
                    </v-card>
                </v-dialog>
            </v-sheet>
        </v-row>

        <!-- Visualisation graph -->
        <v-row no-gutters>
            <v-sheet class="d-flex justify-center w-100 mt-10" color="#F8F0E5" rounded="xl" :elevation="8">
                <div id="chart" class="mt-2">
                    <apexchart width="1600" height="500" type="area" :options="AreaChartOptions"
                        :series="AreaChartDataSelected"></apexchart>
                </div>
            </v-sheet>
        </v-row>

        <!-- Moyenne par salle -->
        <v-row no-gutters>
            <v-sheet class="w-100 mt-10" color="#F8F0E5" rounded="xl" :elevation="8">
                <!-- Titre -->
                <div class="d-flex text-h5 font-weight-bold text-center mb-3">
                    <p class="text-left mx-7 mt-5"> {{ titleBarChart }}</p>
                    <v-checkbox class="mt-2" v-model="moyenneSalles" @change="calcMoyenneParDate()"
                        :label="moyenneSalles ? 'Moyenne par salle' : 'Moyenne par heure'">
                    </v-checkbox>
                </div>


                <!-- Graphique -->
                <div id="chart" class="d-flex justify-center ">
                    <apexchart width="1600" height="200" type="bar" :options="BarChartOptionsSelected"
                        :series="BarChartDataSelected">
                    </apexchart>
                </div>
            </v-sheet>
        </v-row>
    </v-container>
</template>

<script setup>
// Import
import { ref, computed, onMounted } from 'vue';
import axios from 'axios'
import moment from 'moment';
import router from '@/router';
import { onBeforeMount } from 'vue';

// Dialog variables
const dialogSalle = ref(false);
const dialogDate = ref(false);
const dialogExport = ref(false);

// Variables pour les dates sélectionnées
const selectedDates = ref([]);

// Titre du graphique en bar en fonction des dates sélectionnées
const titleBarChart = computed(() => {
    const startDate = firstDate.value ? moment(firstDate.value).format("YYYY-MM-DD") : undefined;
    const endDate = lastDate.value ? moment(lastDate.value).format("YYYY-MM-DD") : undefined;
    let dateRange;

    if (startDate && endDate) {
        if (startDate === endDate) {
            dateRange = ` du ${formatDateTitle(startDate)}`;
        } else {
            dateRange = ` du ${formatDateTitle(startDate)} au ${formatDateTitle(endDate)}`;
        }
    } else {
        dateRange = "";
    }

    if (moyenneSalles.value) {
        return `Moyenne par heure${dateRange}`;
    }
    else {
        return `Moyenne par salle${dateRange}`;
    }
})

// Variables pour les dates sélectionnées
const firstDate = ref('');
const lastDate = ref('');

const TimeRange = [{ start: '08:00', end: '09:00' }, { start: '09:00', end: '10:00' }, { start: '10:00', end: '11:00' }, { start: '11:00', end: '12:00' }, { start: '12:00', end: '13:00' }, { start: '13:00', end: '14:00' }, { start: '14:00', end: '15:00' }, { start: '15:00', end: '16:00' }, { start: '16:00', end: '17:00' }, { start: '17:00', end: '18:00' }, { start: '18:00', end: '19:00' }, { start: '19:00', end: '20:00' }]


const colors = ['#496989', '#58A399', '#A8CD9F', '#E2F4C5']
// Options pour graph en ligne
const AreaChartOptions = {
    chart: {
        id: "areacharthistorique",
        type: "area",
        defaultLocale: 'fr',
        locales: [{
            name: 'fr',
            options: {
                months: [
                    "Janvier",
                    "Février",
                    "Mars",
                    "Avril",
                    "Mai",
                    "Juin",
                    "Juillet",
                    "Août",
                    "Septembre",
                    "Octobre",
                    "Novembre",
                    "Décembre"
                ],
                shortMonths: [
                    "Jan",
                    "Fév",
                    "Mar",
                    "Avr",
                    "Mai",
                    "Juin",
                    "Juil",
                    "Août",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Déc"
                ],
                days: [
                    "Lundi",
                    "Mardi",
                    "Mercredi",
                    "Jeudi",
                    "Vendredi",
                    "Samedi",
                    "Dimanche",
                ],
                shortDays: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
                toolbar: {
                    exportToSVG: "Télécharger en SVG",
                    exportToPNG: "Télécharger en PNG",
                    exportToCSV: "Télécharger en CSV",
                    selection: "Sélection",
                    selectionZoom: "Sélectionner pour zoomer",
                    zoomIn: "Zoomer",
                    zoomOut: "Dézoomer",
                    pan: "Déplacer",
                    reset: "Réinitialiser le zoom"
                }
            }
        }],
    },
    xaxis: {
        type: 'datetime',
        labels: {
            datetimeUTC: false
        }
    },
    fill: {
        type: 'gradient',
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0,
            opacityTo: 0,
            stops: [0, 100]
        }
    },
    tooltip: {
        x: {
            show: true,
            format: 'dd MMM yyyy HH:mm'
        },

    },
    responsive: [
        {
            breakpoint: 1650,
            options: {
                chart: {
                    width: "1400",
                    height: "300"
                },
            },
        },
        {
            breakpoint: 1450,
            options: {
                chart: {
                    width: "1200",
                    height: "300"
                },
            },
        },
        {
            breakpoint: 1250,
            options: {
                chart: {
                    width: "1000",
                    height: "300"
                },
            },
        },
        {
            breakpoint: 1050,
            options: {
                chart: {
                    width: "800",
                    height: "300"
                },
            },
        }
    ],
    dataLabels: {
        enabled: false,
    },
    stroke: {
        curve: 'smooth'
    },

}

// Options pour graph en bar
const BarChartOptionsSalles = {
    chart: {
        id: "barcharthistorique",
        type: "bar",
        dropShadow: {
            enabled: true,
            color: '#000',
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2
        },
        defaultLocale: 'fr',
        locales: [{
            name: 'fr',
            options: {
                months: [
                    "Janvier",
                    "Février",
                    "Mars",
                    "Avril",
                    "Mai",
                    "Juin",
                    "Juillet",
                    "Août",
                    "Septembre",
                    "Octobre",
                    "Novembre",
                    "Décembre"
                ],
                shortMonths: [
                    "Jan",
                    "Fév",
                    "Mar",
                    "Avr",
                    "Mai",
                    "Juin",
                    "Juil",
                    "Août",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Déc"
                ],
                days: [
                    "Lundi",
                    "Mardi",
                    "Mercredi",
                    "Jeudi",
                    "Vendredi",
                    "Samedi",
                    "Dimanche",
                ],
                shortDays: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
                toolbar: {
                    exportToSVG: "Télécharger en SVG",
                    exportToPNG: "Télécharger en PNG",
                    exportToCSV: "Télécharger en CSV",
                    selection: "Sélection",
                    selectionZoom: "Sélectionner pour zoomer",
                    zoomIn: "Zoomer",
                    zoomOut: "Dézoomer",
                    pan: "Déplacer",
                    reset: "Réinitialiser le zoom"
                }
            }
        }],
    },
    xaxis: {
        categories: [],
    },
    responsive: [
        {
            breakpoint: 1650,
            options: {
                chart: {
                    width: "1400",
                    height: "300"
                },
            },
        },
        {
            breakpoint: 1450,
            options: {
                chart: {
                    width: "1200",
                    height: "300"
                },
            },
        },
        {
            breakpoint: 1250,
            options: {
                chart: {
                    width: "1000",
                    height: "300"
                },
            },
        },
        {
            breakpoint: 1050,
            options: {
                chart: {
                    width: "800",
                    height: "300"
                },
            },
        }
    ],
    dataLabels: {
        enabled: true,
    },
}

const BarChartOptionsDate = {
    chart: {
        id: "barcharthistorique",
        type: "bar",
        dropShadow: {
            enabled: true,
            color: '#000',
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2
        },
        defaultLocale: 'fr',
        locales: [{
            name: 'fr',
            options: {
                months: [
                    "Janvier",
                    "Février",
                    "Mars",
                    "Avril",
                    "Mai",
                    "Juin",
                    "Juillet",
                    "Août",
                    "Septembre",
                    "Octobre",
                    "Novembre",
                    "Décembre"
                ],
                shortMonths: [
                    "Jan",
                    "Fév",
                    "Mar",
                    "Avr",
                    "Mai",
                    "Juin",
                    "Juil",
                    "Août",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Déc"
                ],
                days: [
                    "Lundi",
                    "Mardi",
                    "Mercredi",
                    "Jeudi",
                    "Vendredi",
                    "Samedi",
                    "Dimanche",
                ],
                shortDays: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
                toolbar: {
                    exportToSVG: "Télécharger en SVG",
                    exportToPNG: "Télécharger en PNG",
                    exportToCSV: "Télécharger en CSV",
                    selection: "Sélection",
                    selectionZoom: "Sélectionner pour zoomer",
                    zoomIn: "Zoomer",
                    zoomOut: "Dézoomer",
                    pan: "Déplacer",
                    reset: "Réinitialiser le zoom"
                }
            }
        }],
    },
    xaxis: {
        categories: ['8h-9h', '9h-10h', '10h-11h', '11h-12h', '12h-13h', '13h-14h', '14h-15h', '15h-16h', '16h-17h', '17h-18h', '18h-19h', '19h-20h'],
    },
    responsive: [
        {
            breakpoint: 1650,
            options: {
                chart: {
                    width: "1400",
                    height: "300"
                },
            },
        },
        {
            breakpoint: 1450,
            options: {
                chart: {
                    width: "1200",
                    height: "300"
                },
            },
        },
        {
            breakpoint: 1250,
            options: {
                chart: {
                    width: "1000",
                    height: "300"
                },
            },
        },
        {
            breakpoint: 1050,
            options: {
                chart: {
                    width: "800",
                    height: "300"
                },
            },
        }
    ],
    dataLabels: {
        enabled: true,
    },
}

const BarChartOptionsSelected = computed(() => {
    if (moyenneSalles.value) {
        return BarChartOptionsDate;
    }
    else {
        return BarChartOptionsSalles;
    }
})

// Calcule la moyenne de chaque jour pour le graph en bar
const BarChartDataSalles = ref([
    {
        name: "Moyenne par salle",
        backgroundColor: colors[Math.random() * colors.length - 1 | 0],
        data: []
    }
]);

const BarChartDataHour = ref([
    {
        name: "Moyenne par heure",
        backgroundColor: colors[Math.random() * colors.length - 1 | 0],
        data: []
    }
]);

const BarChartDataSelected = computed(() => {
    if (moyenneSalles.value) {
        return BarChartDataHour.value;
    }
    else {
        return BarChartDataSalles.value;
    }
})

let AreaChartData = ref([]);

let AreaChartAverageData = ref([]);

let AreaChartDataSelected = ref([])

// Variables pour les salles
const salles = ref([]);

// Variables pour les salles sélectionnées
const selectedSalles = ref([]);
const selectAll = ref(false);

const selectGlobal = ref(false);

const moyenneSalles = ref(false);

function calcMoyenneParDate() {
    if (moyenneSalles.value) {
        return;
    }
    else {
        getDataFromApi();
    }

}

// Callback pour sélectionner les salles dans le dialog checkbox
function selectDatachart() {
    if (selectedSalles.value.length > 0) {
        selectAll.value = false;
        if (AreaChartDataSelected.value.length > 0) {
            AreaChartDataSelected.value = [];
        }

        AreaChartData.value.forEach((salle) => {
            if (selectedSalles.value.includes(salle.name)) {
                AreaChartDataSelected.value.push(salle);
            }
        });
    }
    else {
        selectAll.value = true;
        AreaChartDataSelected.value = AreaChartData.value;
    }
}

// Callback pour sélectionner toutes les salles dans le dialog checkbox
function selectAllItems() {
    if (selectAll.value) {
        AreaChartDataSelected.value = []
        AreaChartDataSelected.value = AreaChartData.value
    }
    else {
        selectedSalles.value = [];
        AreaChartDataSelected.value = [];
    }
}

function selectGlobalItems() {
    if (!selectGlobal.value) {
        selectedSalles.value = [];
        selectAll.value = true;
        AreaChartDataSelected.value = AreaChartData.value;
    }
    else {
        AreaChartDataSelected.value = [];
        AreaChartDataSelected.value = AreaChartAverageData.value

    }

}

// Callback pour sélectionner les dates dans le datepicker
async function selectedDateRange() {
    firstDate.value = selectedDates.value[0];
    lastDate.value = selectedDates.value[selectedDates.value.length - 1];

    getDataFromApi();
}

// Fonction pour récupérer les données de l'API
async function getDataFromApi() {
    if (firstDate.value && lastDate.value) {
        // Mettre dates dans le bon format tel que 2024-02-10T16:56:05.368Z
        let firstDateFormatted = moment(firstDate.value).format();
        let lastDateFormatted = moment(lastDate.value).format();

        if (firstDateFormatted == lastDateFormatted) {
            lastDateFormatted = moment(lastDate.value).add(1, 'days').format();
        }

        firstDateFormatted = firstDateFormatted.slice(0, -6) + '0Z';
        lastDateFormatted = lastDateFormatted.slice(0, -6) + '0Z';

        let idetab = localStorage.getItem("idetab");

        await axios
            .get('https://ptut-ptutcomptagemaisoncampus.koyeb.app/etablissement/'+ idetab + '/passage/periode?dateDebut=' + firstDateFormatted + '&dateFin=' + lastDateFormatted, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            .then((response) => {

                aggregateValueToChart(response);

                AreaChartData.value = [];
                AreaChartDataSelected.value = [];
                BarChartDataSalles.value = [{
                    name: "Moyenne par salle",
                    backgroundColor: colors[Math.random() * colors.length - 1 | 0],
                    data: []
                }];


                BarChartDataHour.value = [{
                    name: "Moyenne par heure",
                    backgroundColor: colors[Math.random() * colors.length - 1 | 0],
                    data: []
                }];

                salles.value.forEach(() => {
                    BarChartDataSalles.value[0].data.push(0);
                    BarChartDataHour.value[0].data.push(0);
                })

                const datasalles = getUniqueSalleNames(response.data);

                datasalles.forEach((salle) => {
                    let AreaData;
                    if (salle == "Salle 9") {
                        AreaData = {
                            name: "Salle Multimodale",
                            data: [],
                            backgroundColor: colors[Math.random() * colors.length - 1 | 0]
                        }
                    }
                    else {
                        AreaData = {
                            name: salle,
                            data: [],
                            backgroundColor: colors[Math.random() * colors.length - 1 | 0]
                        }
                    }

                    let somme = 0;

                    const passageCountPerHour = new Array(TimeRange.length).fill(0);

                    response.data.forEach((passage) => {
                        // Calculer l'occupation moyenne par tranche horaire
                        const passageDate = new Date(passage.datepassage);
                        const passageHour = passageDate.getHours();

                        // On itère sur chaque tranche horaire pour vérifier si le passage est dans cette tranche
                        TimeRange.forEach((time, index) => {
                            const startTime = time.start.split(':');
                            const endTime = time.end.split(':');
                            if (passageHour >= startTime[0] && passageHour < endTime[0]) {
                                BarChartDataHour.value[0].data[TimeRange.indexOf(time)] += passage.nbpersonne;
                                passageCountPerHour[index]++;
                            }
                        });

                        if (passage.nomsalle === salle) {
                            AreaData.data.push({ x: passage.datepassage, y: passage.nbpersonne });
                            somme += passage.nbpersonne;
                        }
                    });
                    BarChartDataHour.value[0].data.forEach((value, index) => {
                        const passageCount = passageCountPerHour[index];
                        if (passageCount > 0) {
                            BarChartDataHour.value[0].data[index] = Math.round((BarChartDataHour.value[0].data[index] / passageCount) * 10) / 10;
                        }
                    });

                    AreaChartData.value.push(AreaData);

                    addValueToBarChart(somme, AreaData.data.length);
                })
                if (selectedSalles.value.length > 0) {
                    // Gérer les categories pour le graph en ligne en fonction des dates
                    selectDatachart();
                }
                else {
                    AreaChartDataSelected.value = AreaChartData.value;
                    // Gérer les categories pour le graph en ligne en fonction des dates
                }
            })
            .catch((error) => {
                if (error.response) {

                    if (error.response.status == 403) {
                        localStorage.clear();
                        router.push({ path: '/' })
                    }
                }
            })
    }
    else {
        // Afficher les données de la semaine actuelle
        let currentMoment = moment();

        // Define the start of the week (considering Monday as the first day)
        let startOfWeek = currentMoment.startOf('isoWeek').toISOString();
        let endOfWeek = currentMoment.endOf('isoWeek').toISOString();

        let idetab = localStorage.getItem("idetab");

        await axios
            .get('https://ptut-ptutcomptagemaisoncampus.koyeb.app/etablissement/'+idetab+'/passage/periode?dateDebut=' + startOfWeek + '&dateFin=' + endOfWeek, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            .then((response) => {
                // Récupérer les noms de salle uniques
                aggregateValueToChart(response);

                AreaChartData.value = [];
                AreaChartDataSelected.value = [];

                BarChartDataSalles.value = [{
                    name: "Moyenne par salle",
                    backgroundColor: colors[Math.random() * colors.length - 1 | 0],
                    data: []
                }];

                BarChartDataHour.value = [{
                    name: "Moyenne par heure",
                    backgroundColor: colors[Math.random() * colors.length - 1 | 0],
                    data: []
                }];

                salles.value.forEach(() => {
                    BarChartDataSalles.value[0].data.push(0);
                    BarChartDataHour.value[0].data.push(0);
                })

                const datasalles = getUniqueSalleNames(response.data);

                datasalles.forEach((salle) => {
                    let AreaData;
                    if (salle == "Salle 9") {
                        AreaData = {
                            name: "Salle Multimodale",
                            data: [],
                            backgroundColor: colors[Math.random() * colors.length - 1 | 0]
                        }
                    }
                    else {
                        AreaData = {
                            name: salle,
                            data: [],
                            backgroundColor: colors[Math.random() * colors.length - 1 | 0]
                        }
                    }

                    let somme = 0;

                    const passageCountPerHour = new Array(TimeRange.length).fill(0);

                    response.data.forEach((passage) => {
                        // Calculer l'occupation moyenne par tranche horaire
                        const passageDate = new Date(passage.datepassage);
                        const passageHour = passageDate.getHours();

                        // On itère sur chaque tranche horaire pour vérifier si le passage est dans cette tranche
                        TimeRange.forEach((time, index) => {
                            const startTime = time.start.split(':');
                            const endTime = time.end.split(':');
                            if (passageHour >= startTime[0] && passageHour < endTime[0]) {
                                BarChartDataHour.value[0].data[TimeRange.indexOf(time)] += passage.nbpersonne;
                                passageCountPerHour[index]++;
                            }
                        });

                        if (passage.nomsalle === salle) {
                            AreaData.data.push({ x: new Date(passage.datepassage).getTime(), y: passage.nbpersonne });
                            somme += passage.nbpersonne;
                        }
                    });

                    BarChartDataHour.value[0].data.forEach((value, index) => {
                        const passageCount = passageCountPerHour[index];
                        if (passageCount > 0) {
                            BarChartDataHour.value[0].data[index] = Math.round((BarChartDataHour.value[0].data[index] / passageCount) * 10) / 10;
                        }
                    });

                    addValueToBarChart(salle, somme, AreaData.data.length);
                    AreaChartData.value.push(AreaData);

                })


                if (selectedSalles.value.length > 0) {
                    // Gérer les categories pour le graph en ligne en fonction des dates
                    selectDatachart();
                }
                else {
                    AreaChartDataSelected.value = AreaChartData.value;
                    // Gérer les categories pour le graph en ligne en fonction des dates
                }
            })
            .catch((error) => {
                if (error.response) {

                    if (error.response.status == 403) {
                        localStorage.clear();
                        router.push({ path: '/' })
                    }
                }
            })
    }
}

const interval = ref(null);

// Récupérer les données de l'API au montage
onMounted(() => {
    if (localStorage.getItem("token")) {
        getSallesForEtab();
        getDataFromApi();
        interval.value = setInterval(getDataFromApi, 5000);
    } else {
        router.push({ path: '/' });
    }
});

onBeforeMount(() => {
    if (interval.value) {
        console.log("clear timeout")
        clearTimeout(interval.value);
    }
})
// Tableau pour les noms des mois
const monthNames = ["Janv.", "Fév.", "Mars", "Avr.", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc."];

async function getSallesForEtab() {
    let idetab = localStorage.getItem("idetab");
    await axios
        .get('https://ptut-ptutcomptagemaisoncampus.koyeb.app/etablissement/'+idetab+'/salle', {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        })
        .then((response) => {
            const datasalles = response.data;
            datasalles.forEach((salle) => {
                salles.value.push({ name: salle.nomsalle })
                BarChartOptionsSalles.xaxis.categories.push(salle.nomsalle)
            })
        })
        .catch((error) => {
            if (error.response) {

                if (error.response.status == 403) {
                    localStorage.clear();
                    router.push({ path: '/' })
                }
            }
        })
}

// Fonction pour formater la date
function formatDateTitle(datestring) {
    let date = new Date(datestring);

    // Récupérer le nom du mois et le jour
    const month = monthNames[date.getMonth()];
    const day = date.getDate();

    // Formater l'année
    const year = date.getFullYear();

    // Retourner la date formatée
    return `${day} ${month} ${year}`;
}

function getUniqueSalleNames(data) {
    const uniqueSalleNames = new Set();

    data.forEach(passage => {
        uniqueSalleNames.add(passage.nomsalle);
    });

    return Array.from(uniqueSalleNames); // Convertir l'ensemble en tableau pour faciliter l'utilisation
}

function addValueToBarChart(salle, somme, length) {
    salles.value.find((s) => {
        if (s.name === salle) {
            BarChartDataSalles.value[0].data[salles.value.indexOf(s)] = Math.round((somme / length) * 10) / 10;
        }
    })
}

function aggregateValueToChart(response) {

    AreaChartAverageData.value = [];

    AreaChartAverageData.value = [
        {
            name: "Moyenne par heure",
            data: [],
            backgroundColor: colors[Math.random() * colors.length - 1 | 0],
        }
    ]
    const aggregatedDataPerHour = [];
    const aggregatedDataByTime = [];

    response.data.forEach((passage) => {
        // Calculer l'occupation moyenne par tranche horaire
        const passageDate = new Date(passage.datepassage);
        const passageHour = passageDate.getHours();

        // On itère sur chaque tranche horaire pour vérifier si le passage est dans cette tranche
        TimeRange.forEach((time, index) => {
            const startTime = time.start.split(':');
            const endTime = time.end.split(':');
            if (passageHour >= startTime[0] && passageHour < endTime[0]) {
                if (!aggregatedDataPerHour[index]) {
                    aggregatedDataPerHour[index] = {
                        totalPassages: 0,
                        totalPersons: 0,
                        averagePersons: 0
                    };
                }
                aggregatedDataPerHour[index].totalPersons += passage.nbpersonne;
                aggregatedDataPerHour[index].totalPassages++;
            }
        });

        // Ajouter les données à la structure agrégée par temps
        const passageTime = passageDate.getTime();
        const timeDataIndex = aggregatedDataByTime.findIndex(data => data && data.timestamp === passageTime);
        if (timeDataIndex === -1) {
            aggregatedDataByTime.push({
                timestamp: passageTime,
                totalPassages: 1,
                totalPersons: passage.nbpersonne
            });
        } else {
            aggregatedDataByTime[timeDataIndex].totalPassages++;
            aggregatedDataByTime[timeDataIndex].totalPersons += passage.nbpersonne;
        }
    });

    // Ajouter les données agrégées au graphique en ligne
    aggregatedDataByTime.forEach((timeData) => {
        const averagePersons = timeData.totalPersons / timeData.totalPassages;
        AreaChartAverageData.value[0].data.push({ x: timeData.timestamp, y: averagePersons });
    });
}

</script>

<style scoped>
/* Supprimer la marge horizontale pour centrer les feuilles */
.v-sheet {
    margin-left: 0;
    margin-right: 0;
}

p {
    color: #102C59;
}
</style>
