/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'
import VueApexCharts from "vue3-apexcharts";
import DateFnsAdapter from '@date-io/date-fns'

import { createVuetify } from 'vuetify'
import { fr } from 'date-fns/locale'



const vuetify = createVuetify({
    date: {
        adapter: DateFnsAdapter,
        locale: {
            fr: fr, // Set locale to French        
        },
    }

})

// Font

const app = createApp(App)

app.use(VueApexCharts)
app.use(vuetify)

registerPlugins(app)

app.mount('#app')
