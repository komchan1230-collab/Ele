<template>
  <div class="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sarabun">
    
    <div class="max-w-5xl mx-auto">
      
      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold text-slate-800 mb-2 flex justify-center items-center gap-2">
          <Headset class="w-8 h-8 text-blue-600" /> ติดต่อเรา / สอบถามข้อมูล
        </h1>
        <p class="text-slate-500">หากมีข้อสงสัยหรือต้องการความช่วยเหลือ ติดต่อเราได้ตามช่องทางด้านล่าง</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        <div class="space-y-6">
          
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
            <div class="flex items-center gap-4 mb-4">
              <div class="bg-white/20 p-3 rounded-full">
                <PhoneCall class="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 class="font-bold text-lg">ศูนย์บริการลูกค้า 24 ชม.</h3>
                <p class="text-blue-100 text-sm">แจ้งเหตุขัดข้องเร่งด่วน</p>
              </div>
            </div>
            <p class="text-3xl font-bold tracking-wider">02-123-4567</p>
          </div>

          <a href="https://line.me/R/ti/p/@687xezjv" target="_blank" class="block group">
            <div class="bg-[#06C755] rounded-2xl p-6 text-white shadow-lg shadow-green-200 cursor-pointer hover:bg-[#05b54d] transition relative overflow-hidden">
              <div class="relative z-10 flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="bg-white/20 p-3 rounded-full">
                    <MessageCircle class="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 class="font-bold text-lg">Zigzaggon Service</h3>
                    <p class="text-green-100 text-sm">@687xezjv</p>
                  </div>
                </div>
                <ArrowRight class="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
              <MessageCircle class="absolute -right-4 -bottom-4 w-32 h-32 text-white opacity-10 rotate-12" />
            </div>
          </a>

          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
             <h3 class="font-bold text-slate-700 mb-4 flex items-center gap-2">
               <MapPin class="w-5 h-5 text-red-500" /> ที่ตั้งสำนักงาน
             </h3>
             <p class="text-slate-500 text-sm leading-relaxed">
               สำนักงานการไฟฟ้าชุมชนเมเจอร์ปากเกร็ด <br>
               เลขที่ 99/9 หมู่ 3 ถนนแจ้งวัฒนะ ตำบลปากเกร็ด <br>
               อำเภอปากเกร็ด จังหวัดนนทบุรี 11120
             </p>
             <div class="mt-4 h-48 bg-slate-100 rounded-xl overflow-hidden relative shadow-inner">
               <iframe 
                 src="https://www.google.com/maps?q=13.9074513,100.5025009&z=15&output=embed" 
                 width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy">
               </iframe>
             </div>
          </div>

        </div>

        <div class="bg-white rounded-3xl p-8 shadow-md border border-slate-100">
          <h3 class="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Mail class="w-6 h-6 text-blue-500" /> ส่งข้อความถึงเรา
          </h3>

          <form @submit.prevent="submitForm" class="space-y-5">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">หัวข้อที่ต้องการติดต่อ <span class="text-red-500">*</span></label>
              <div class="relative">
                <select v-model="form.topic" required class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 appearance-none focus:ring-2 focus:ring-blue-100 outline-none transition cursor-pointer">
                  <option value="" disabled>-- กรุณาเลือกหัวข้อ --</option>
                  <option value="สอบถามข้อมูลทั่วไป">สอบถามข้อมูลทั่วไป</option>
                  <option value="ติดตามงานซ่อม/แจ้งเหตุซ้ำ">ติดตามงานซ่อม / แจ้งเหตุซ้ำ</option>
                  <option value="ร้องเรียนการบริการ">ร้องเรียนการบริการ</option>
                  <option value="ขอติดตั้งมิเตอร์ใหม่">ขอติดตั้งมิเตอร์ใหม่</option>
                  <option value="อื่นๆ">อื่นๆ</option>
                </select>
                <ChevronDown class="absolute right-4 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">ชื่อ - นามสกุล <span class="text-red-500">*</span></label>
              <input v-model="form.name" type="text" required placeholder="ระบุชื่อผู้ติดต่อ" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 transition" />
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">อีเมลติดต่อกลับ (Email)</label>
              <input v-model="form.email" type="email" placeholder="example@email.com" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 transition" />
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">เบอร์โทรศัพท์ <span class="text-red-500">*</span></label>
              <input v-model="form.phone" type="tel" required placeholder="08x-xxx-xxxx" maxlength="10" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 transition" />
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">รายละเอียด <span class="text-red-500">*</span></label>
              <textarea v-model="form.message" required rows="4" placeholder="พิมพ์ข้อความของคุณที่นี่..." class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 transition resize-none"></textarea>
            </div>

            <button 
              type="submit" 
              :disabled="isSubmitting"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!isSubmitting">ส่งข้อความ</span>
              <span v-else class="flex items-center gap-2"><Loader2 class="animate-spin" /> กำลังส่ง...</span>
            </button>
          </form>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import { 
  Headset, PhoneCall, MessageCircle, MapPin, Mail, 
  ArrowRight, ChevronDown, Loader2 
} from 'lucide-vue-next';

const isSubmitting = ref(false);

const form = reactive({
  topic: '',
  name: '',
  email: '', // 🔥 เพิ่มตัวแปร email ใน script
  phone: '',
  message: ''
});

const submitForm = async () => {
  isSubmitting.value = true;
  try {
    const res = await axios.post('https://major-backend-dc3d.onrender.com/api/contact', form);
    
    if (res.data.success) {
      Swal.fire({
        icon: 'success',
        title: 'ส่งข้อความสำเร็จ',
        text: 'เจ้าหน้าที่ได้รับข้อความแล้ว จะรีบติดต่อกลับโดยเร็วที่สุดครับ',
        confirmButtonColor: '#2563eb',
        confirmButtonText: 'ตกลง'
      });
      form.topic = '';
      form.name = '';
      form.email = ''; // 🔥 เพิ่มการล้างค่า email หลังส่งเสร็จ
      form.phone = '';
      form.message = '';
    }
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: 'error',
      title: 'ส่งไม่สำเร็จ',
      text: 'เกิดข้อผิดพลาดในการเชื่อมต่อ โปรดลองใหม่อีกครั้ง',
      confirmButtonColor: '#ef4444'
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>
 
 
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;700&display=swap');
.font-sarabun { font-family: 'Sarabun', sans-serif; }
</style>