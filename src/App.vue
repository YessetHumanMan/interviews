<script setup lang="ts">
 import HeaderBase from './components/HeaderBase.vue';
 import { onMounted } from 'vue';
 import { getAuth, onAuthStateChanged} from 'firebase/auth'
 import { useUserStore } from './store/user';

 const userStore = useUserStore()

 onMounted(() => {
  onAuthStateChanged(getAuth(), (user) => {
    if(user) {
      userStore.userId = user.uid
    } else {
      userStore.userId = ''
    }
  })
 })
</script>

<template>
  <header-base />
  <RouterView/>
</template>

