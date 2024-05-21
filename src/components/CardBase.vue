<script setup lang="ts">
import { ref, computed } from "vue";
import { getFirestore, setDoc, doc } from 'firebase/firestore'
import { getAuth } from "firebase/auth";
import { useRouter } from "vue-router";
import type { IDataInterviews } from '../dataInterface'
import { v4 as uuidv4 } from 'uuid';

const router = useRouter()
const db = getFirestore();

const position = ref<string>("");
const descrPosition = ref<string>("");
const nameСandidate = ref<string>("");
const phoneСandidate = ref<string>("");
const whatsappCandidate = ref<string>("");
const telegramCandidate = ref<string>("");

const addCreateInterview = async ():Promise<void> => {
  const payload:IDataInterviews = {
    id: 'uuidv4()',
    position: position.value,
    descrPosition: descrPosition.value,
    nameСandidate: nameСandidate.value,
    phoneCandidate: phoneСandidate.value,
    whatsappCandidate: whatsappCandidate.value,
    telegramCandidate: telegramCandidate.value,
    createdAt: new Date()
  }
 const userId = getAuth().currentUser?.uid
 if(userId) {
  await setDoc(doc(db, `users/${userId}/interviews`, payload.id), payload).then(() => {
    router.push('/list')
  })
 }
  
};

const disbledInterviews = computed<boolean>(() => {
  return !(position.value && nameСandidate.value && phoneСandidate.value)
});
</script>

<template>
  <div class="w-1/2 mx-auto py-6 border border-slate-400 mt-10 shadow-xl rounded-md">
    <h2 class="text-center font-medium">New interview</h2>
    <div class="flex flex-col p-5 gap-1">
      <input class="input" type="text" v-model="position" placeholder="Position" />
      <input
      class="input"
        type="text"
        v-model="descrPosition"
        placeholder="Description of the desired position"
      />
      <input class="input" type="text" v-model="nameСandidate" placeholder="Name" />
      <input class="input" type="text" v-model="phoneСandidate" placeholder="Phone" />
      <input class="input" type="text" v-model="whatsappCandidate" placeholder="WhatsApp" />
      <input class="input" type="text" v-model="telegramCandidate" placeholder="Telegram" />
      <button @click="addCreateInterview" class="btn" :disabled="disbledInterviews">Сreate interview</button>
    </div>
  </div>
</template>
