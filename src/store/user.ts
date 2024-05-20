import {defineStore} from 'pinia'
import { ref } from 'vue'

export interface User {
  authenticated: boolean
}

export const useUserStore = defineStore('user', () => {
  const userId = ref<string>('')

  return { userId }
})