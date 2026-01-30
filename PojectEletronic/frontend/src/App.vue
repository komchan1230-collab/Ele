<template>
  <div class="min-h-screen bg-[#eef2f9] font-sarabun text-[#333]">
    
    <header v-if="currentPage !== 'login'" class="bg-[#87CEEB] px-5 py-4 flex justify-between items-center text-black shadow-sm relative z-30">
      <h1 class="text-lg font-bold m-0 cursor-pointer hover:opacity-70 transition-opacity flex items-center gap-2" @click="changePageHandler('home')">
        <Zap class="w-6 h-6 fill-yellow-400 text-yellow-500" />
        แจ้งปัญหาไฟดับ (ชุมชนเมเจอร์ปากเกร็ด)
      </h1>
      
      <div 
        class="cursor-pointer hover:opacity-70 transition p-2 rounded-full"
        :class="isLoggedIn ? 'bg-green-500 text-white shadow-md' : 'bg-white/20 text-slate-800'" 
        @click="handleAdminClick" 
        title="เมนูสำหรับเจ้าหน้าที่"
      >
        <User class="w-6 h-6" />
      </div>
    </header>

    <nav v-if="currentPage !== 'login'" class="bg-[#87CEEB] flex justify-around pb-2 shadow-md relative z-20">
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
        <span>สถานะพื้นที่</span>
      </div>
      <div class="nav-item cursor-pointer group" @click="changePageHandler('contact')" :class="{ active: currentPage === 'contact' }">
        <MessageCircleMore class="icon-nav group-hover:scale-110 transition-transform" /> 
        <span>ติดต่อเรา</span>
      </div>
    </nav>

    <main class="content-area min-h-[calc(100vh-120px)] relative z-10">
      
      <HomeView v-if="currentPage === 'home'" @changePage="changePageHandler" />

      <ReportProblem v-else-if="currentPage === 'report'" @changePage="changePageHandler" />
      <FollowNews v-else-if="currentPage === 'news'" @changePage="changePageHandler" />
      <AreaStatus v-else-if="currentPage === 'status'" @changePage="changePageHandler" />
      <UserProfile v-else-if="currentPage === 'profile'" @changePage="changePageHandler" />
      <ContactUs v-else-if="currentPage === 'contact'" @changePage="changePageHandler" />
      <UserStatistics v-else-if="currentPage === 'statistics'" @changePage="changePageHandler" />
      
      <AdminLogin v-else-if="currentPage === 'login'" @loginSuccess="onLoginSuccess" @changePage="changePageHandler" />

      <AdminMenu 
        v-else-if="(currentPage === 'admin' || currentPage === 'admin-menu' || currentPage === 'adminList') && isLoggedIn" 
        @changePage="changePageHandler" 
      />
      
      <Dashboard v-else-if="currentPage === 'dashboard' && isLoggedIn" @changePage="changePageHandler" />
      
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { 
  User, TriangleAlert, Megaphone, MapPin, 
  MessageCircleMore, Zap 
} from 'lucide-vue-next';
import Swal from 'sweetalert2';

// Import Components
import HomeView from './components/HomeView.vue';
import ReportProblem from './components/ReportProblem.vue';
import FollowNews from './components/FollowNews.vue';
import AreaStatus from './components/AreaStatus.vue';
import UserProfile from './components/UserProfile.vue';
import ContactUs from './components/ContactUs.vue';
import Dashboard from './components/Dashboard.vue';
import AdminMenu from './components/AdminMenu.vue';
import UserStatistics from './components/UserStatistics.vue';
// 🔥 Import หน้า Login
import AdminLogin from './components/AdminLogin.vue';

const currentPage = ref('home');
const isLoggedIn = ref(false); // ตัวแปรเช็คสถานะล็อกอิน

// ตรวจสอบตอนเปิดเว็บว่าเคยล็อกอินค้างไว้ไหม
onMounted(() => {
  if (localStorage.getItem('adminToken')) {
    isLoggedIn.value = true;
  }
});

const changePageHandler = (pageName) => {
  currentPage.value = pageName;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 🔥 ฟังก์ชันจัดการเมื่อกดปุ่มรูปคน (Admin)
const handleAdminClick = () => {
  if (isLoggedIn.value) {
    // ถ้าล็อกอินแล้ว -> ไปหน้าเมนูแอดมินเลย (หรือจะถาม Logout ก็ได้)
    Swal.fire({
      title: 'เมนูเจ้าหน้าที่',
      text: 'คุณเข้าสู่ระบบอยู่แล้ว',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'ไปหน้าจัดการ',
      cancelButtonText: 'ออกจากระบบ',
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#ef4444'
    }).then((result) => {
      if (result.isConfirmed) {
        changePageHandler('admin-menu');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        logout();
      }
    });
  } else {
    // ถ้ายังไม่ล็อกอิน -> ไปหน้า Login
    changePageHandler('login');
  }
};

// เมื่อ Login ผ่าน
const onLoginSuccess = () => {
  isLoggedIn.value = true;
  localStorage.setItem('adminToken', 'true'); // จำสถานะไว้
  
  Swal.fire({
    icon: 'success',
    title: 'ยินดีต้อนรับ',
    text: 'เข้าสู่ระบบเจ้าหน้าที่เรียบร้อยแล้ว',
    timer: 1500,
    showConfirmButton: false
  });
  
  changePageHandler('admin-menu'); // เด้งไปหน้าแอดมิน
};

// ฟังก์ชันออกจากระบบ
const logout = () => {
  isLoggedIn.value = false;
  localStorage.removeItem('adminToken');
  changePageHandler('home');
  Swal.fire('ออกจากระบบแล้ว', '', 'success');
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;700&display=swap');

.font-sarabun { font-family: 'Sarabun', sans-serif; }

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 5px;
  transition: all 0.2s;
  color: #334155;
  font-size: 0.85rem;
}

.nav-item:hover { color: white; }

.nav-item.active {
  color: white;
  font-weight: bold;
  transform: translateY(-2px);
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.icon-nav { width: 24px; height: 24px; margin-bottom: 4px; }
</style>