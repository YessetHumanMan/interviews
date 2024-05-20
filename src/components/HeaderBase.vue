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
  url: string;
  show: ComputedRef<boolean>;
}

const items = ref<IMenuBase[]>([
  {
    name: "Authorization",
    url: "/auth",
    show: computed((): boolean => !userStore.userId),
  },
  {
    name: "Add",
    url: "/",
    show: computed((): boolean => !!userStore.userId),
  },
  {
    name: "List",
    url: "/list",
    show: computed((): boolean => !!userStore.userId),
  },
  {
    name: "Statistic",
    url: "/statistic",
    show: computed((): boolean => !!userStore.userId),
  },
]);

const signOutBtn = async ():Promise<void> => {
  await signOut(getAuth())
  router.push('/auth')
}

</script>

<template>
  <header class="container flex justify-start py-7 px-3 cursor-pointer bg-slate-200 mt-4 rounded-lg">
    <div
      v-for="item in items"
      :key="item.name"
      class="font-medium transition hover:text-slate-500 mr-10"
    >
    <router-link :to="item.url">
      <div v-if="item.show">
        <span>{{ item.name }}</span>
      </div>
    </router-link>
      
    </div>
    <span v-if="userStore.userId" @click="signOutBtn" class="text-red-500">exit</span>
  </header>
</template>
