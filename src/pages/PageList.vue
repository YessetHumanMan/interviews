<script setup lang="ts">
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  where
} from "firebase/firestore";
import { IDataInterviews } from "../dataInterface";
import { computed, onMounted } from "vue";
import { ref } from "vue";
import { useUserStore } from "../store/user";

const userStore = useUserStore();
const isLoading = ref(true);
const selectedFilterResult = ref<string>('');
const selectedName = ref<string>('')

const db = getFirestore();

const interviews = ref<IDataInterviews[]>([]);

const getAllInterview = async <T extends IDataInterviews>(isFilter?: boolean ): Promise<T[]> => {
  let getData
  isLoading.value = true;

  if(isFilter) {
    getData = query(
      collection(db, `users/${userStore.userId}/interviews`),
      orderBy("createdAt", "desc"),
      where("result", "==", selectedFilterResult.value),
      
    )
  } else {
     getData = query(
    collection(db, `users/${userStore.userId}/interviews`),
    orderBy("createdAt", "desc")
  );

  }
  
  const getDocsList = await getDocs(getData);
  return getDocsList.docs.map((doc) => doc.data() as T);
};

onMounted(async () => {
  const listInterview: Array<IDataInterviews> = await getAllInterview();
  interviews.value = [...listInterview];
});

const submitFiler = async (): Promise<void> => {
  const listInterview: Array<IDataInterviews> = await getAllInterview(true);
  interviews.value = listInterview;
}


const deleteFiler = async (): Promise<void> => {
  const listInterview: Array<IDataInterviews> = await getAllInterview();
  interviews.value = listInterview;
}

const deliteCurrentInterview = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, `users/${userStore.userId}/interviews`, id));
  isLoading.value = true;
  const listInterview: Array<IDataInterviews> = await getAllInterview();
    isLoading.value = false
  interviews.value = [...listInterview];
};


</script>

<template>
  <div class="container">
    <div v-if="!interviews.length" class="flex justify-center">
    <app-spinner v-if="isLoading"/>
    <span v-else-if="interviews.length === 0" class="text-cyan-400 text-lg mt-5"><span class="pi pi-times-circle text-red-700 mr-2 text-lg"></span> NO INTERVIEWS</span>
    </div>
    <div v-else class="bg-sky-950 border border-cyan-400 rounded mt-5 shadow-lg py-4">
      <h1 class="font-medium text-ml text-cyan-400 my-3 mx-3 border-b border-b-cyan-800 pb-1"><span class="pi pi-list-check mr-3"></span>LIST INTERVIEWS</h1>
      <div class="flex flex-wrap gap-3 mt-3">
        <div class="flex align-items-center ml-3 gap-2 my-3">
          <app-radio inputId="interviewResult1" value="Offer" name="result" v-model="selectedFilterResalt"/>
          <label for="ingredient1" class="ml-2 text-cyan-400">Offer</label>
          <app-radio inputId="interviewResult2" value="Refusal" name="result" v-model="selectedFilterResalt"/>
          <label for="ingredient2" class="ml-2 text-cyan-400">Refusal</label>
          <button type="button" class="btn-filter-apply" @click="submitFiler()" :disabled="!selectedFilterResalt">Apply</button>
        <button class="btn-filter-reset" @click="deleteFiler()" :disabled="!selectedFilterResalt">Reset</button>
        <input type="text" v-model="selectedName" class="input-filter" placeholder="Search name...">
        </div>

        
       
      <app-table :value="interviews">
        <app-column field="candidate" header="Candidate" class="border-r border-cyan-400 bg-sky-950 text-cyan-400"></app-column>
        <app-column field="position" header="Position" class="border-r border-cyan-400 bg-sky-950 text-cyan-400"></app-column>
        <app-column field="descrPosition" header="Description" class="border-r border-cyan-400 bg-sky-950 text-cyan-400"></app-column>
        <app-column field="phoneCandidate" header="Phone" class="bg-sky-950 text-cyan-400"></app-column>
        <app-column class="border-r border-cyan-400 bg-sky-950 text-cyan-400">
          <template #body="slotProps">
            <a
              v-if="slotProps.data.telegramCandidate"
              :href="`https://t.me/${slotProps.data.telegramCandidate}`"
              target="_blank"
              class="mr-7 "
            >
              <span class="pi pi-telegram contact_telegram animate-pulse"></span>
            </a>
            <a
              v-if="slotProps.data.telegramCandidate"
              :href="`https://wa.me/${slotProps.data.whatsappCandidate}`"
              target="_blank"
            >
              <span class="pi pi-whatsapp contact_whatsapp animate-pulse"></span>
            </a>
          </template>
        </app-column>
        <app-column header="Salary" class="border-x border-cyan-400 bg-sky-950 text-cyan-400">
          <template #body="slotProps">
         <span v-if="!slotProps.data.salaryFrom">salary not specified</span>
         <span v-else>{{ slotProps.data.salaryFrom }} - {{ slotProps.data.salaryTo }}</span>
          </template>
          </app-column>
          <app-column header="Result" class="border-x border-cyan-400 bg-sky-950 text-cyan-400">
            <template #body="slotProps">
            <span v-if="!slotProps.data.result">result not specified</span>
            <span v-else>
              <app-badge :value="slotProps.data.result === 'Offer' ? 'offer' : 'refusal' " :severity="slotProps.data.result === 'Offer' ? 'success' : 'danger'"/>
            </span>
            </template>
          </app-column >
        <app-column class="bg-sky-950 text-cyan-400">
          <template #body="slotProps">
            <div class="flex gap-3 ">
              <router-link :to="`/interviews/${slotProps.data.id}`">
                <button class="pi pi-pencil hover:animate-bounce"></button>
              </router-link>

              <button
                class="pi pi-trash trash-icon hover:animate-bounce"
                @click="deliteCurrentInterview(slotProps.data.id)"
              ></button>
            </div>
          </template>
        </app-column>
      </app-table>
    </div>
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
