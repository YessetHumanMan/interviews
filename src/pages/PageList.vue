<script setup lang="ts">
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { IDataInterviews } from "../dataInterface";
import { onMounted } from "vue";
import { ref } from "vue";
import { useUserStore } from "../store/user";

const userStore = useUserStore();
const isLoading = ref(true);

const db = getFirestore();

const interviews = ref<IDataInterviews[]>([]);

const getAllInterview = async <T extends IDataInterviews>(): Promise<T[]> => {
  isLoading.value = true;
  const getData = query(
    collection(db, `users/${userStore.userId}/interviews`),
    orderBy("createdAt", "desc")
  );

  const getDocsList = await getDocs(getData);
isLoading.value = false
  return getDocsList.docs.map((doc) => doc.data() as T);
};

onMounted(async () => {
  const listInterview: Array<IDataInterviews> = await getAllInterview();
  interviews.value = [...listInterview];
});

const deliteCurrentInterview = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, `users/${userStore.userId}/interviews`, id));
  const listInterview: Array<IDataInterviews> = await getAllInterview();
  interviews.value = [...listInterview];
};
</script>

<template>
  <div class="container">
    
    <app-spinner
      v-if="!interviews.length"
      class="flex justify-center items-center font-medium text-lg mt-10"
    >
      <span class="empty-icon pi pi-exclamation-circle mr-2"></span>NO
      INTERVIEWS...
    </app-spinner>
    <div v-else class="border border-slate-400 rounded mt-5 shadow-lg">
      <h1 class="font-medium text-ml my-3 mx-3">LIST INTERVIEWS</h1>

      <app-table :value="interviews" class="border">
        <app-column field="candidate" header="Candidate name"></app-column>
        <app-column field="position" header="Position"></app-column>
        <app-column field="descrPosition" header="Description"></app-column>
        <app-column field="phoneCandidate" header="Phone"></app-column>
        <app-column>
          <template #body="slotProps">
            <a
              v-if="slotProps.data.telegramCandidate"
              :href="`https://t.me/${slotProps.data.telegramCandidate}`"
              target="_blank"
              class="mr-7"
            >
              <span class="pi pi-telegram contact_telegram"></span>
            </a>
            <a
              v-if="slotProps.data.telegramCandidate"
              :href="`https://wa.me/${slotProps.data.whatsappCandidate}`"
              target="_blank"
            >
              <span class="pi pi-whatsapp contact_whatsapp"></span>
            </a>
          </template>
        </app-column>
        <app-column>
          <template #body="slotProps">
            <div class="flex gap-3">
              <router-link :to="`/interviews/${slotProps.data.id}`">
                <button class="pi pi-pencil"></button>
              </router-link>

              <button
                class="pi pi-trash trash-icon"
                @click="deliteCurrentInterview(slotProps.data.id)"
              ></button>
            </div>
          </template>
        </app-column>
      </app-table>
    </div>
    </div>
</template>

<style scoped>
.contact_telegram {
  font-size: 20px;
  color: #24a1de;
}

.contact_whatsapp {
  font-size: 20px;
  color: #25d336;
}

.trash-icon {
  font-size: 15px;
  color: red;
}
.pencil-icon {
  font-size: 15px;
  color: #24a1de;
}

.empty-icon {
  font-size: 20px;
  color: red;
}
</style>
