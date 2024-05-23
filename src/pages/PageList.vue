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

const db = getFirestore();

const interviews = ref<IDataInterviews[]>([]);

const getAllInterview = async <T extends IDataInterviews>(): Promise<T[]> => {
  const getData = query(
    collection(db, `users/${userStore.userId}/interviews`),
    orderBy("createdAt", "desc")
  );

  const getDocsList = await getDocs(getData);
  return getDocsList.docs.map((doc) => doc.data() as T);
};

onMounted(async () => {
  const listInterview: Array<IDataInterviews> = await getAllInterview();
  interviews.value = [...listInterview];
});
</script>

<template>
  <div class="container">
    <h1 class="font-bold">List interviews</h1>

    <app-table :value="interviews"showGridlines tableStyle="min-width: 50rem">
      
        <app-column field="position" header="Position"></app-column>
        <app-column field="descrPosition" header="Description"></app-column>
        <app-column field="candidate" header="Candidate"></app-column>
        <app-column field="phoneCandidate" header="Phone"></app-column>
      
    </app-table>
  </div>
</template>

<style scoped>
.bglist {
  background-color: slategray;
}
</style>
