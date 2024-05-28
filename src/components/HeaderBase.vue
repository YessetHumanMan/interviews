<script setup lang="ts">
import { useUserStore } from "../store/user";
import { AppRouterNames } from "../router";
import type { ComputedRef } from 'vue';
import { ref, computed } from 'vue';
import { signOut, getAuth } from "firebase/auth";
import { useRouter } from 'vue-router'

const userStore = useUserStore();
const router = useRouter()

interface IMenuBase {
  name: AppRouterNames;
  icon: string
  url: string;
  show: ComputedRef<boolean>;
}

const items = ref<IMenuBase[]>([
  {
    name: "Authorization",
    icon: 'pi pi-user',
    url: "/auth",
    show: computed((): boolean => !userStore.userId),
  },
  {
    name: "Home",
    icon: 'pi pi-plus',
    url: "/",
    show: computed((): boolean => !!userStore.userId),
  },
  {
    name: "List",
    url: "/list",
    icon: 'pi pi-list',
    show: computed((): boolean => !!userStore.userId),
  },
  {
    name: "Statistic",
    url: "/statistic",
    icon: 'pi pi-chart-pie',
    show: computed((): boolean => !!userStore.userId),
  }
]);

const signOutBtn = async ():Promise<void> => {
  await signOut(getAuth())
  router.push('/auth')
}

</script>

<template>
  <header class="container flex justify-between py-7 px-3 bg-slate-200 mt-4 rounded-lg border-2 border-slate-400">
    <a href="/"><img src="/public/interview-icon.jpg" width="40" height="40" class="rounded-full" alt=""></a>
    <div
      v-for="item in items"
      :key="item.name"
      class="font-medium uppercase text-sm text-slate-800 transition hover:text-slate-500 mr-10"
    >
    <router-link :to="item.url">
      <div v-if="item.show">
      <span :class="item.icon" class="m-3"></span>
        <span>{{ item.name }}</span>
      </div>
    </router-link>
      
    </div>
    <div>
      <span v-if="userStore.userId" @click="signOutBtn" class="text-red-500 pi pi-sign-out cursor-pointer m-3 transition hover:text-red-300 hover:translate-x-2"><span class="pl-3 font-medium"></span></span>
    </div>
  </header>
</template>
