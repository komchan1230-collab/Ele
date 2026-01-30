<template>
  <div class="min-h-screen bg-[#f8fafc] font-sarabun pb-12">
    
    <div class="relative w-full h-[400px] md:h-[550px] rounded-b-[3rem] overflow-hidden shadow-2xl bg-slate-800 z-10">
      <swiper
        :modules="modules" 
        :slides-per-view="1"
        :loop="true"
        :autoplay="{ delay: 5000, disableOnInteraction: false }"
        :pagination="{ clickable: true, dynamicBullets: true }"
        :speed="800"
        class="w-full h-full"
      >
        <swiper-slide v-for="(img, index) in images" :key="index">
          <div class="relative w-full h-full">
            <img :src="img" class="w-full h-full object-cover scale-105" />
            
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

            <div class="absolute bottom-0 left-0 p-8 md:p-16 max-w-4xl">
               <div class="inline-flex items-center gap-2 bg-[#87CEEB] text-blue-900 text-xs md:text-sm font-bold px-4 py-1.5 rounded-full mb-4 shadow-sm">
                 <Zap class="w-4 h-4 fill-current" /> ระบบแจ้งไฟฟ้าขัดข้อง 24 ชม.
               </div>
               <h1 class="text-white text-4xl md:text-6xl font-bold drop-shadow-xl leading-tight mb-3 tracking-wide">
                 แจ้งปัญหาไฟดับ
               </h1>
               <p class="text-white/90 text-xl md:text-3xl font-light drop-shadow-md pl-1 border-l-4 border-[#87CEEB]">
                 &nbsp;ชุมชนเมเจอร์ปากเกร็ด - ตลาดปากเกร็ด
               </p>
            </div>
          </div>
        </swiper-slide>
      </swiper>

      <component :is="'style'">
        .swiper-pagination-bullet { width: 10px; height: 10px; background: white; opacity: 0.5; transition: all 0.3s; }
        .swiper-pagination-bullet-active { width: 24px; border-radius: 5px; background: #87CEEB; opacity: 1; }
      </component>
    </div>

    <div class="max-w-5xl mx-auto px-6 mt-12 relative z-20">
      <div class="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 text-center">
          <h3 class="text-xl font-bold text-slate-700 mb-6">เมนูลัดสำหรับประชาชน</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button @click="$emit('changePage', 'report')" class="bg-red-50 hover:bg-red-100 text-red-600 py-4 rounded-xl font-bold flex flex-col items-center gap-2 transition">
               <TriangleAlert class="w-8 h-8" /> แจ้งเหตุไฟดับ
            </button>
            <button @click="$emit('changePage', 'status')" class="bg-blue-50 hover:bg-blue-100 text-blue-600 py-4 rounded-xl font-bold flex flex-col items-center gap-2 transition">
               <MapPin class="w-8 h-8" /> จุดที่กำลังซ่อม
            </button>
            <button @click="$emit('changePage', 'contact')" class="bg-green-50 hover:bg-green-100 text-green-600 py-4 rounded-xl font-bold flex flex-col items-center gap-2 transition">
               <PhoneCall class="w-8 h-8" /> ติดต่อเรา
            </button>
          </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { defineEmits } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Zap, TriangleAlert, MapPin, PhoneCall } from 'lucide-vue-next';

// Import รูปภาพเดิมของคุณ
import img1 from '../assets/JEG.jpg';
import img2 from '../assets/HEG.jpg';
import img3 from '../assets/PGE.jpg';

const modules = [Autoplay, Pagination];
const images = [img1, img2, img3];

defineEmits(['changePage']);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;700&display=swap');
.font-sarabun { font-family: 'Sarabun', sans-serif; }
</style>