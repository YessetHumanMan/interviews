
<script setup lang="ts"	>
import { ref, onMounted } from "vue";
import { IDataInterviews } from "../dataInterface";
import{ query } from "firebase/firestore";
import { getDocs } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { collection, orderBy } from "firebase/firestore";
import { useUserStore } from "../store/user";

const userStore = useUserStore();
const db = getFirestore();
const chartData = ref();
const chartOptions = ref();

const isLoading = ref(true);

onMounted(async () => {
  interviews.value = await getAllInterview();
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
});




const interviews = ref<IDataInterviews[]>([]);


const getAllInterview = async <T extends IDataInterviews>(): Promise<T[]> => {
  isLoading.value = true
     const getData = query(
    collection(db, `users/${userStore.userId}/interviews`),
    orderBy("createdAt", "desc")
  )

  const getDocsList = await getDocs(getData);
isLoading.value = false
  return getDocsList.docs.map((doc) => doc.data() as T);
  }
  

  


const setChartData = () => {
  const documentStyle = getComputedStyle(document.body);
    const data: number[] = [0, 0, 0];

    interviews.value.forEach((interview: IDataInterviews) => {
        if (interview.result === 'Offer') {
            data[0] += 1;
        } else {
            data[1] += 1;
        }
    });

    return {
        labels: ['Offer', 'Refusal'],
        datasets: [
            {
                data,
                backgroundColor: [documentStyle.getPropertyValue('--cyan-500'), documentStyle.getPropertyValue('--pink-500'), documentStyle.getPropertyValue('--gray-500')],
                hoverBackgroundColor: [documentStyle.getPropertyValue('--cyan-400'), documentStyle.getPropertyValue('--pink-400'), documentStyle.getPropertyValue('--gray-400')]
            }
            
        ]
    };
};


const setChartOptions = () => {
    // const documentStyle = getComputedStyle(document.documentElement);
    // const textColor = documentStyle.getPropertyValue('--text-color');

    return {
        plugins: {
            legend: {
                labels: {
                    cutout: '60%',
                    color: ['Offer', 'Refusal'],
                }
            }
        }
    };
};
</script>

<template>
  <div class="container">
  <div class="card flex justify-center items-center mt-10">
    <app-chart type="doughnut" :data="chartData" :options="chartOptions" class="w-3/6 md:w-30" />
  </div>
</div>

</template>
