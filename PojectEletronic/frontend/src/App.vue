<template>
  <div class="min-h-screen bg-[#eef2f9] font-sarabun text-[#333]">
    
    <div v-if="currentPage === 'home'" class="flex flex-col min-h-screen">
      <header class="bg-[#87CEEB] px-5 py-4 flex justify-between items-center text-black shadow-sm relative z-10">
        <h1 class="text-lg font-bold m-0 cursor-pointer hover:opacity-70 transition-opacity" @click="changePageHandler('home')">
          แจ้งปัญหาไฟดับ (ในชุมชนเมเจอร์ปากเกร็ด)
        </h1>
        <div class="cursor-pointer hover:opacity-70 transition" @click="changePageHandler('profile')">
          <User class="w-8 h-8 text-black" />
        </div>
      </header>

      <nav class="bg-[#87CEEB] flex justify-around pb-2 shadow-md relative z-10">
        <div class="nav-item cursor-pointer group" @click="changePageHandler('report')">
          <TriangleAlert class="icon-nav group-hover:scale-110 transition-transform" /> 
          <span>แจ้งปัญหา</span>
        </div>
        <div class="nav-item cursor-pointer group" @click="changePageHandler('news')">
          <Megaphone class="icon-nav group-hover:scale-110 transition-transform" /> 
          <span>ติดตามข่าวสาร</span>
        </div>
        <div class="nav-item cursor-pointer group" @click="changePageHandler('status')">
          <MapPin class="icon-nav group-hover:scale-110 transition-transform" /> 
          <span>แจ้งเตือนสถานะพื้นที่</span>
        </div>
        <div class="nav-item cursor-pointer group" @click="changePageHandler('contact')">
          <MessageCircleMore class="icon-nav group-hover:scale-110 transition-transform" /> 
          <span>ติดต่อเรา</span>
        </div>
      </nav>

      <main class="flex-grow flex justify-center items-start pt-8 px-4 pb-12">
        <div class="w-full max-w-[1200px] bg-white p-2 shadow-md rounded-sm border border-white">
          <swiper
            :modules="modules" 
            :slides-per-view="1"
            :loop="true"
            :autoplay="{ delay: 5000, disableOnInteraction: false }"
            :pagination="{ clickable: true }"
            class="w-full rounded-sm overflow-hidden"
          >
            <swiper-slide v-for="(img, index) in images" :key="index">
              <div class="relative w-full aspect-[21/9]">
                <img :src="img" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent"></div>
                <div class="absolute top-1/2 left-10 -translate-y-1/2 text-white drop-shadow-md pr-4">
                  <h2 class="text-3xl md:text-5xl lg:text-6xl font-bold mb-2 leading-tight">
                    แจ้งปัญหาไฟดับ
                  </h2>
                  <p class="text-lg md:text-2xl font-light opacity-90">
                    ชุมชนเมเจอร์ปากเกร็ด-ตลาดปากเกร็ด
                  </p>
                </div>
              </div>
            </swiper-slide>
          </swiper>
        </div>
      </main>
    </div>

    <div v-else-if="currentPage === 'report'">
      <ReportProblem @changePage="changePageHandler" />
    </div>

    <div v-else-if="currentPage === 'news'">
      <FollowNews @changePage="changePageHandler" />
    </div>

    <div v-else-if="currentPage === 'status'">
      <AreaStatus @changePage="changePageHandler" />
    </div>

    <div v-else-if="currentPage === 'statistics'">
      <UserStatistics @changePage="changePageHandler" />
    </div>

    <div v-else-if="currentPage === 'profile'">
      <UserProfile @changePage="changePageHandler" />
    </div>

    <div v-else-if="currentPage === 'problem-detail'">
      <ProblemDetail @changePage="changePageHandler" />
    </div>

    <div v-else-if="currentPage === 'contact'">
      <ContactUs @changePage="changePageHandler" />
    </div>

    <div v-else-if="currentPage === 'dashboard'">
      <Dashboard @changePage="changePageHandler" />
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { User, TriangleAlert, Megaphone, MapPin, MessageCircleMore } from 'lucide-vue-next';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import img1 from './assets/JEG.jpg';
import img2 from './assets/HEG.jpg';
import img3 from './assets/PGE.jpg';

// Import Components
import ReportProblem from './components/ReportProblem.vue';
import FollowNews from './components/FollowNews.vue';
import AreaStatus from './components/AreaStatus.vue';
import UserStatistics from './components/UserStatistics.vue';
import UserProfile from './components/UserProfile.vue';
import ProblemDetail from './components/ProblemDetail.vue';
import ContactUs from './components/ContactUs.vue';
import Dashboard from './components/Dashboard.vue'; // เพิ่มบรรทัดนี้

const currentPage = ref('home');
const modules = [Autoplay, Pagination];
const images = [img1, img2, img3];

const changePageHandler = (pageName) => {
  currentPage.value = pageName;
  window.scrollTo(0, 0);
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600&display=swap');
.font-sarabun { font-family: 'Sarabun', sans-serif; }

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

.swiper-pagination-bullet { background: white !important; opacity: 0.5; width: 10px; height: 10px; margin: 0 6px !important; }
.swiper-pagination-bullet-active { background: #87CEEB !important; opacity: 1; width: 25px; border-radius: 999px; transition: width 0.3s ease; }
</style>