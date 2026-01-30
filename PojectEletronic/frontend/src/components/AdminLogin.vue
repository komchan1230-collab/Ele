<template>
  <div class="min-h-screen flex items-center justify-center bg-[#eef2f9] font-sarabun p-4">
    
    <div class="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-100 relative overflow-hidden">
      
      <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-blue-600"></div>
      <div class="absolute -right-10 -top-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-50"></div>

      <div class="text-center mb-8 relative z-10">
        <div class="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
          <LockKeyhole class="w-8 h-8 text-blue-600" />
        </div>
        <h2 class="text-2xl font-bold text-slate-800">เข้าสู่ระบบเจ้าหน้าที่</h2>
        <p class="text-slate-400 text-sm mt-1">เฉพาะผู้ดูแลระบบเท่านั้น</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6 relative z-10">
        
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-2">ชื่อผู้ใช้</label>
          <div class="relative">
            <User class="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input 
              v-model="username" 
              type="text" 
              placeholder="Username" 
              class="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 transition text-slate-700"
              required
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-bold text-slate-700 mb-2">รหัสผ่าน</label>
          <div class="relative">
            <KeyRound class="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input 
              v-model="password" 
              type="password" 
              placeholder="Password" 
              class="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 transition text-slate-700"
              required
            />
          </div>
        </div>

        <div v-if="errorMsg" class="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
          <AlertCircle class="w-4 h-4" /> {{ errorMsg }}
        </div>

        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 flex justify-center items-center gap-2"
        >
          <span v-if="!isLoading">เข้าสู่ระบบ</span>
          <span v-else class="flex items-center gap-2"><Loader2 class="animate-spin w-5 h-5" /> กำลังตรวจสอบ...</span>
        </button>

        <div class="text-center mt-4">
          <button type="button" @click="$emit('changePage', 'home')" class="text-slate-400 hover:text-slate-600 text-sm transition">
            กลับหน้าหลัก
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { User, LockKeyhole, KeyRound, Loader2, AlertCircle } from 'lucide-vue-next';

const emit = defineEmits(['loginSuccess', 'changePage']);

const username = ref('');
const password = ref('');
const errorMsg = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  isLoading.value = true;
  errorMsg.value = '';

  try {
    const res = await axios.post('http://localhost:3000/api/login', {
      username: username.value,
      password: password.value
    });

    if (res.data.success) {
      // Login สำเร็จ -> ส่ง event บอก App.vue
      emit('loginSuccess');
    }
  } catch (err) {
    errorMsg.value = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;700&display=swap');
.font-sarabun { font-family: 'Sarabun', sans-serif; }
</style>