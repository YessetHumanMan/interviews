import { initializeApp } from "firebase/app";

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/main.css'
import App from './App.vue'
import { router } from './router'

const firebaseConfig = {
  apiKey: "AIzaSyDr8bdTrH2DbOrP7h9QWmHL20Ne-BgRjQQ",
  authDomain: "interviews-vue-c2be9.firebaseapp.com",
  projectId: "interviews-vue-c2be9",
  storageBucket: "interviews-vue-c2be9.appspot.com",
  messagingSenderId: "1082489594489",
  appId: "1:1082489594489:web:77d120af077854135eaaa8"
};

initializeApp(firebaseConfig);


const app = createApp(App)
const pinia = createPinia()
app.use(router)
app.use(pinia)
app.mount('#app')
