<template>
  <div class="min-h-screen bg-[#e9e6f6] font-sarabun text-[#333]">
    
   

    <div class="content flex justify-center p-4 md:p-8">
      <div class="panel bg-white rounded-lg shadow-sm w-full max-w-[1050px] p-6">
        
        <h5 class="section-title flex items-center gap-2 text-[#f1a23a] font-bold text-xl mb-6">
          <MessageSquareText class="w-6 h-6" /> สอบถามข้อมูล
        </h5>

        <div class="panel-body flex flex-col md:flex-row gap-8 min-h-[360px]">
          
          <form class="form-area w-full md:max-w-[520px]" @submit.prevent="submitForm">
            <div class="mb-4">
              <label class="block font-bold mb-1">ชื่อ-นามสกุล <span class="text-red-500">*</span></label>
              <input v-model.trim="form.fullname" type="text" class="form-control" required />
            </div>

            <div class="mb-4">
              <label class="block font-bold mb-1">อายุ <span class="text-red-500">*</span></label>
              <input v-model.number="form.age" type="number" min="1" class="form-control" required />
            </div>

            <div class="mb-4">
              <label class="block font-bold mb-1">เพศ <span class="text-red-500">*</span></label>
              <div class="flex gap-6 items-center mt-2">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="ชาย" v-model="form.gender" class="w-4 h-4" required />
                  <span>ชาย</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="หญิง" v-model="form.gender" class="w-4 h-4" required />
                  <span>หญิง</span>
                </label>
              </div>
            </div>

            <div class="mb-4">
              <label class="block font-bold mb-1">เบอร์โทรศัพท์ <span class="text-red-500">*</span></label>
              <input v-model.trim="form.phone" type="tel" class="form-control" required />
            </div>

            <div class="mb-4">
              <label class="block font-bold mb-1">รายละเอียด <span class="text-red-500">*</span></label>
              <textarea v-model.trim="form.detail" class="form-control h-32" required></textarea>
            </div>
          </form>

          <div class="side-actions flex-1 flex justify-end items-end pb-2">
            <button 
              class="send-btn bg-[#7fe4dd] text-[#0d2b45] font-bold py-2 px-8 rounded-full shadow-md hover:opacity-90 transition transform active:translate-y-1"
              type="button" 
              @click="submitForm"
            >
            
            </button>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { 
  User, TriangleAlert, Megaphone, MapPin, MessageCircleMore, 
  MessageSquareText // เพิ่มไอคอนสำหรับหัวข้อ
} from 'lucide-vue-next';

const emit = defineEmits(['changePage']);

// เพิ่มฟังก์ชันนี้ใน <script setup> ของ ContactUs.vue
const goToAdmin = () => {
  emit('changePage', 'dashboard');
};

// State ของฟอร์ม
const form = ref({
  fullname: "",
  age: null,
  gender: "",
  phone: "",
  detail: ""
});

const submitForm = () => {
  // ตรวจสอบความถูกต้องเบื้องต้น (Validation)
  if (!form.value.fullname || !form.value.phone || !form.value.detail) {
    alert("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
    return;
  }

  console.log("Submitting:", form.value);
  alert("ส่งข้อมูลเรียบร้อย!");
  
  // รีเซ็ตฟอร์ม
  form.value = { fullname: "", age: null, gender: "", phone: "", detail: "" };
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600;800&display=swap');
.font-sarabun { font-family: 'Sarabun', sans-serif; }

/* Navbar Styles (Standard) */
.nav-item {
  text-decoration: none;
  color: #000;
  text-align: center;
  font-size: 13px;
  font-weight: bold;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: opacity 0.2s;
}
.nav-item:hover { opacity: 0.7; }
.icon-nav { width: 28px; height: 28px; margin-bottom: 4px; }
.nav-item.active { position: relative; }
.nav-item.active::after { content: ''; display: block; width: 80%; height: 3px; background: white; margin-top: 4px; border-radius: 2px; }

/* Form Styles */
.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
  transition: border-color 0.2s;
}
.form-control:focus {
  border-color: #7fc9ff;
}
</style>