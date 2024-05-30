<script setup lang="ts">
import { ref, computed } from "vue";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { useRouter } from "vue-router";
import type { IDataInterviews } from "../dataInterface";
import { useUserStore } from "../store/user";
import { v4 as uuidv4 } from "uuid";

const router = useRouter();
const db = getFirestore();
const userStore = useUserStore();

const position = ref<string>("");
const descrPosition = ref<string>("");
const candidate = ref<string>("");
const phoneСandidate = ref<string>("");
const whatsappCandidate = ref<string>("");
const telegramCandidate = ref<string>("");
const isLoading = ref(false);

const addCreateInterview = async (): Promise<void> => {
  
  const payload: IDataInterviews = {
    id: uuidv4(),
    position: position.value,
    descrPosition: descrPosition.value,
    candidate: candidate.value,
    phoneCandidate: phoneСandidate.value,
    whatsappCandidate: whatsappCandidate.value,
    telegramCandidate: telegramCandidate.value,
    createdAt: new Date(),
  };
  
  if (userStore.userId) {
    isLoading.value = true;
    await setDoc(
      doc(db, `users/${userStore.userId}/interviews`, payload.id),
      payload
    ).then(() => {
      router.push("/list");
      isLoading.value = false;
    });
  } 
};

const disabledInterviews = computed<boolean>(() => {
  return !(position.value && candidate.value && phoneСandidate.value);
});
</script>

<template>
  <app-spinner v-if="isLoading" />
  <div
    v-else="interview?.id && !isLoading"
    class="w-1/2 mx-auto py-6 bg-sky-950 border border-cyan-400 mt-10 shadow-xl rounded-md"
  >
    <h2 class="text-center font-medium text-sm text-cyan-400">NEW INTERVIEWS</h2>
    <div class="flex flex-col p-5 gap-1">
      <input
        class="input"
        type="text"
        v-model="position"
        placeholder="Position"
      />
      <input
        class="input"
        type="text"
        v-model="descrPosition"
        placeholder="Description of the desired position"
      />
      <input 
      class="input" 
      type="text"
       v-model="candidate" 
       placeholder="Name" />
      <input
        class="input"
        type="text"
        v-model="phoneСandidate"
        placeholder="Phone"
      />
      <input
        class="input"
        type="text"
        v-model="whatsappCandidate"
        placeholder="WhatsApp"
      />
      <input
        class="input"
        type="text"
        v-model="telegramCandidate"
        placeholder="Telegram"
      />
      <button
        @click="addCreateInterview"
        class="btn"
        :disabled="disabledInterviews"
      >
        Сreate interview
      </button>
    </div>
  </div>
</template>
