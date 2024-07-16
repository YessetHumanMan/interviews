<script setup lang="ts">
import {ref, onMounted } from 'vue'
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import type { IDataInterviews} from '../dataInterface';
import { useUserStore } from '../store/user';
import { useRoute } from 'vue-router'

const userStore = useUserStore()
const route = useRoute()

// const position = ref<string>('')
// const phoneCandidate = ref('')
// const telegramCandidate = ref('')
// const whatsappCandidate = ref('')
// const salaryFrom = ref('')
// const salaryTo = ref('')

const db = getFirestore()

const interview = ref<IDataInterviews>()
const isLoading = ref(true)

const docref = doc(db,`users/${userStore.userId}/interviews`, route.params.id as string)

const getData = async (): Promise<void> => {
  isLoading.value = true
  const docSnap = await getDoc(docref)
  interview.value = docSnap.data() as IDataInterviews
  isLoading.value = false
}

onMounted(async () => {
 await getData()
})

const addStage = () => {
  if(interview.value) {
    if(!interview.value.stages) {
      interview.value.stages = []
    }
    interview.value.stages.push({nameStage: '', dateStage: '', comments: '' })
  }
}

const deleteStage = (index:number) => {
  if(interview.value) {
    if(interview.value.stages) {
      interview.value.stages.splice(index, 1)
    }
  }
}

const saveInterview = async ():Promise<void> => {
 isLoading.value = true
 await updateDoc(docref, { ...interview.value })
 await getData()
 isLoading.value = false
 
}

</script>

<template>
  <app-spinner v-if="isLoading" class="flex justify-center items-center"/>
  <div v-else-if="interview?.id && !isLoading"
    class="w-1/3 mx-auto border border-cyan-400 mt-10 shadow-xl rounded-md"
  >
    <div class="flex flex-col p-5 gap-1 mx-auto bg-sky-950">
      <h2 class="text-center font-medium text-cyan-400 py-3">INTERVIEWS CANDIDATE</h2>
      <input type="text" class="input" placeholder="Position" v-model="interview.position"/>
      <input
        type="text"
        class="input"
        placeholder="Description of the desired position"
        v-model="interview.descrPosition"
      />
      <input type="text" class="input" placeholder="Name" v-model="interview.candidate" />
      <input type="text" class="input" placeholder="Phone" v-model="interview.phoneCandidate" />
      <input type="text" class="input" placeholder="WhatsApp" v-model="interview.whatsappCandidate"/>
      <input type="text" class="input" placeholder="Telegram" v-model="interview.telegramCandidate"/>

      <label class="font-medium mt-2 text-cyan-400">Salary</label>
      <div class="flex items-center gap-4 my-3">
        <input type="number" class="input-num" placeholder="salary from" v-model="interview.salaryFrom"/>
        <span class="pi pi-dollar money-icon"></span>
        <input type="number" class="input-num" placeholder="salary up to" v-model="interview.salaryTo"/>
      </div>
      <button class="btn" @click="addStage">
        <span class="pi pi-plus mr-5"></span>Add stage
      </button>
      <template v-if="interview.stages">
      <div
        v-for="(stage , index) in interview.stages" :key="index"
        class="flex flex-col border border-cyan-400 my-5 py-6 px-3 rounded-lg"
      >
        <label :for="`stage-nameStage-${index}`" class="text-cyan-400"><span class="pi pi-file-edit mb-2 mr-2 text-cyan-400"></span>Name stage</label>
        <div class="flex justify-center mt-2">
          <input
            type="text"
            class="input-task"
            placeholder="Description task"
            v-model="stage.nameStage"
            :id="`stage-nameStage-${index}`"
          />
        </div>

        <label :for="`stage-comments-${index}`" class="text-cyan-400"><span class="pi pi-book mb-2 mr-2 text-cyan-400"></span>Comments</label>
        <div class="flex justify-center my-3">
          <textarea class="textarea" placeholder="your comments ..." v-model="stage.comments" :id="`stage-comments-${index}`"></textarea>
        </div>
        <button class="btn-delete" @click="deleteStage(index)">
          <span class="pi pi-times mr-5 rotate-360"></span>Delete stage
        </button>
      </div>
    </template>
      <div class="flex flex-wrap gap-3 mt-3">
        <div class="flex align-items-center">
          <app-radio inputId="interviewResult1" value="Offer" name="result" v-model="interview.result"/>
          <label for="ingredient1" class="ml-2">Offer</label>
        </div>
        <div class="flex align-items-center">
          <app-radio inputId="interviewResult2" value="Refusal" name="result" v-model="interview.result"/>
          <label for="ingredient2" class="ml-2">Refusal</label>
        </div>
       
      </div>
      <button class="btn" @click="saveInterview">
        <span class="pi pi-check mr-5"></span>Save
      </button>
    </div>
  </div>
</template>

<style scoped>
.money-icon {
  font-size: 13px;
  color: #278644;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
