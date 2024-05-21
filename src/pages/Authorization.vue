<script setup lang="ts">
import { computed, ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'vue-router';

const password = ref<string>('')
const email = ref<string>('')
const router = useRouter()

const isLogin = ref<boolean>(true)

const togglAuth = () => {
  isLogin.value = !isLogin.value
}

const subtitleText = computed<string>(() => {
  return isLogin.value ? 'Аккаунта еще нет?' : 'Уже есть аккаунт?'
})

const linkAccauntText = computed<string>(() => {
  return isLogin.value ? 'Создать аккаунт?' : 'Вход'
})

const addButton = computed<string>(() => {
  return isLogin.value ? 'Вход' : 'Регистрация'
}) 

const submitForm = (): void => {
  if(isLogin.value){
    signIn()
  } else
  signUp()
}

const signUp = async (): Promise<void> => {
  await createUserWithEmailAndPassword(getAuth(), email.value, password.value)
  try {
    router.push('/')
  } catch(error:unknown) {
    if(error instanceof Error) {
      console.log(error.message)
    } 
    }
}

const signIn = async (): Promise<void> => {
  await signInWithEmailAndPassword(getAuth(), email.value, password.value)
  try {
    router.push('/')
  } catch(error:unknown) {
    if(error instanceof Error) {
      console.log(error.message)
    } 
    }
} 
</script>

<template>
  
    <div class="container w-9/12 py-20 h-screen">
     
      <div class="p-10 h-4/5">
        
         <div class="w-1/2 border border-neutral-500 text-center rounded-md mb-5 mx-auto p-5 shadow-xl bg-slate-50">
          <h3 class="text-xl font-medium mb-5">Приветствую !</h3>
          <span class="text-600 font-normal">{{ subtitleText }}</span>
          <a class="font-normal no-underline ml-2 text-violet-400 cursor-pointer hover:text-violet-700 transition" @click="togglAuth">{{ linkAccauntText }}</a>
          <form 
        @submit="submitForm"
        class="grid grid-row-2 gap-3 w-1/2 mb-12 mx-auto mt-5">
        <input
          v-model="email"
            type="text"
            class="border hover:border-violet-600 focus:outline-none focus:ring focus:ring-violet-600 border-neutral-500 rounded-md py-2 px-3 text-gray-700 placeholder text-sm"
            placeholder="Email*"
          />
          <input
          v-model="password"
            type="password"
            class="border hover:border-violet-600 focus:outline-none focus:ring focus:ring-violet-600 border-neutral-500 rounded-md py-2 px-3 text-slate-900 placeholder text-sm"
            placeholder="Password*"
          />
          <button
          
            type="submit"
            class="btn"
          >
          <span class="pi pi-user"></span>
            {{ addButton }}
          </button>
        </form>
         </div>
        
      </div>
    </div>

</template>