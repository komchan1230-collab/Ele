<template>
  <div class="min-h-screen bg-[#eef2f9] font-sarabun text-[#333]">
    
    <header class="bg-[#87CEEB] px-5 py-4 flex justify-between items-center text-black shadow-sm relative z-20">
      <h1 class="text-lg font-bold m-0 cursor-pointer hover:opacity-70 transition-opacity" @click="changePageHandler('home')">
        แจ้งปัญหาไฟดับ (ในชุมชนเมเจอร์ปากเกร็ด)
      </h1>
      <div class="cursor-pointer hover:opacity-70 transition p-1" @click="changePageHandler('admin-menu')" title="เมนูสำหรับเจ้าหน้าที่">
        <User class="w-8 h-8 text-black" />
      </div>
    </header>

    <nav class="bg-[#87CEEB] flex justify-around pb-2 shadow-md relative z-10">
      <div class="nav-item cursor-pointer group" @click="changePageHandler('report')" :class="{ active: currentPage === 'report' }">
        <TriangleAlert class="icon-nav group-hover:scale-110 transition-transform" /> 
        <span>แจ้งปัญหา</span>
      </div>
      <div class="nav-item cursor-pointer group" @click="changePageHandler('news')" :class="{ active: currentPage === 'news' }">
        <Megaphone class="icon-nav group-hover:scale-110 transition-transform" /> 
        <span>ติดตามข่าวสาร</span>
      </div>
      <div class="nav-item cursor-pointer group" @click="changePageHandler('status')" :class="{ active: currentPage === 'status' }">
        <MapPin class="icon-nav group-hover:scale-110 transition-transform" /> 
        <span>แจ้งเตือนสถานะพื้นที่</span>
      </div>
      <div class="nav-item cursor-pointer group" @click="changePageHandler('contact')" :class="{ active: currentPage === 'contact' }">
        <MessageCircleMore class="icon-nav group-hover:scale-110 transition-transform" /> 
        <span>ติดต่อเรา</span>
      </div>
    </nav>

    <main class="content-area min-h-[calc(100vh-120px)]">
      <div v-if="currentPage === 'home'">
        <div class="pt-8 px-4 pb-12 flex justify-center">
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
                    <h2 class="text-3xl md:text-5xl lg:text-6xl font-bold mb-2 leading-tight text-white">แจ้งปัญหาไฟดับ</h2>
                    <p class="text-lg md:text-2xl font-light opacity-90 text-white">ชุมชนเมเจอร์ปากเกร็ด-ตลาดปากเกร็ด</p>
                  </div>
                </div>
              </swiper-slide>
            </swiper>
          </div>
        </div>
      </div>

      <ReportProblem v-else-if="currentPage === 'report'" @changePage="changePageHandler" />
      <FollowNews v-else-if="currentPage === 'news'" @changePage="changePageHandler" />
      <AreaStatus v-else-if="currentPage === 'status'" @changePage="changePageHandler" />
      <UserProfile v-else-if="currentPage === 'profile'" @changePage="changePageHandler" />
      <ContactUs v-else-if="currentPage === 'contact'" @changePage="changePageHandler" />
      <AdminMenu v-else-if="currentPage === 'admin-menu'" @changePage="changePageHandler" />
      <Dashboard v-else-if="currentPage === 'dashboard'" @changePage="changePageHandler" />
    </main>
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

import ReportProblem from './components/ReportProblem.vue';
import FollowNews from './components/FollowNews.vue';
import AreaStatus from './components/AreaStatus.vue';
import UserProfile from './components/UserProfile.vue';
import ContactUs from './components/ContactUs.vue';
import Dashboard from './components/Dashboard.vue';
import AdminMenu from './components/AdminMenu.vue';

const currentPage = ref('home');
const modules = [Autoplay, Pagination];
const images = [img1, img2, img3];

const changePageHandler = (pageName) => {
  currentPage.value = pageName;
  window.scrollTo({ top: 0, behavior: 'smooth' });
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
.nav-item.active { border-bottom: 3px solid white; }
.icon-nav { width: 28px; height: 28px; margin-bottom: 4px; }

.swiper-pagination-bullet { background: white !important; opacity: 0.5; width: 10px; height: 10px; }
.swiper-pagination-bullet-active { background: #87CEEB !important; opacity: 1; width: 25px; border-radius: 999px; }
</style>