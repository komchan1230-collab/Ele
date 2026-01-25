<template>
  <div class="min-h-screen bg-[#eef2f9] font-sarabun text-[#333]">
   

    <main class="max-w-[1200px] mx-auto p-6">
      
      <form @submit.prevent="handleSearch" class="flex flex-wrap justify-center items-end gap-4 md:gap-8 mb-10">
        <div class="flex flex-col items-center">
          <label class="mb-2 font-medium">เวลาที่เริ่มดับ</label>
          <input 
            v-model="filters.startTime" 
            type="time" 
            class="filter-input" 
          />
        </div>
        
        <div class="flex flex-col items-center">
          <label class="mb-2 font-medium">เวลาที่สิ้นสุด</label>
          <input 
            v-model="filters.endTime" 
            type="time" 
            class="filter-input" 
          />
        </div>
        
        <div class="flex flex-col items-center">
          <label class="mb-2 font-medium">วันที่ไฟดับ</label>
          <input 
            v-model="filters.date" 
            type="date" 
            class="filter-input w-40" 
          />
        </div>
        
        <div class="flex flex-col items-center">
          <label class="mb-2 font-medium">จุดบริเวณ</label>
          <input 
            v-model="filters.keyword" 
            type="text" 
            placeholder="ระบุสถานที่..." 
            class="filter-input w-40" 
          />
        </div>
        
        <button 
          type="submit" 
          class="bg-white border border-gray-300 px-6 py-2 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 font-medium h-[42px] transition"
        >
          ค้นหา
        </button>
        
        <button 
          type="button" 
          @click="resetFilters"
          class="text-sm text-gray-500 underline mb-3 hover:text-black"
        >
          ล้างค่า
        </button>
      </form>

      <div class="flex justify-between items-center border-b border-gray-400 pb-2 mb-4">
        <h2 class="text-xl font-medium">เนื้อหาทั้งหมด ({{ displayedNews.length }} รายการ)</h2>
        
        <button 
          @click="$emit('changePage', 'statistics')"
          class="bg-[#87CEEB] px-4 py-1 rounded-full shadow-sm hover:opacity-80 font-medium text-sm border border-black/10 transition transform active:scale-95"
        >
          ข้อมูลสถิติ
        </button>
      </div>

      <div class="w-full overflow-x-auto">
        <table class="w-full min-w-[800px] text-left border-collapse">
          <thead>
            <tr class="text-lg border-b border-gray-200">
              <th class="py-4 pl-4 w-[20%] font-medium">จุด/บริเวณ</th>
              <th class="py-4 w-[40%] font-medium">รายละเอียด</th>
              <th class="py-4 w-[20%] font-medium text-center">เริ่มดับไฟ</th>
              <th class="py-4 w-[20%] font-medium text-center">สิ้นสุด</th>
            </tr>
          </thead>
          <tbody class="text-sm md:text-base">
            <tr 
              v-for="(item, index) in displayedNews" 
              :key="item.id"
              :class="index % 2 === 0 ? 'bg-[#e0e0e0]' : 'bg-white'"
            >
              <td class="py-4 pl-4 align-top">
                <div class="font-bold">{{ item.location }}</div>
                <div class="text-gray-600">{{ item.province }}</div>
              </td>
              <td class="py-4 align-top">
                {{ item.detail }}
              </td>
              <td class="py-4 text-center align-top">
                {{ formatDateTime(item.date, item.startTime) }}
              </td>
              <td class="py-4 text-center align-top">
                {{ formatDateTime(item.date, item.endTime) }}
              </td>
            </tr>

            <tr v-if="displayedNews.length === 0">
              <td colspan="4" class="text-center py-8 text-gray-500">
                ไม่พบข้อมูลตามเงื่อนไขที่ค้นหา
              </td>
            </tr>

            <tr v-if="displayedNews.length > 0 && displayedNews.length < 5" class="bg-white h-16">
              <td></td><td></td><td></td><td></td>
            </tr>
          </tbody>
        </table>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { User, TriangleAlert, Megaphone, MapPin, MessageCircleMore } from 'lucide-vue-next';
import axios from 'axios';

// กำหนด Event เพื่อใช้เปลี่ยนหน้า
const emit = defineEmits(['changePage']);

// 1. ตัวแปรเก็บข้อมูลจากฐานข้อมูล
const rawNews = ref([]);

// 2. ตัวแปรเก็บค่าจาก Filter (ใช้ reactive เพื่อให้จัดการง่ายขึ้น)
const filters = reactive({
  startTime: '',
  endTime: '',
  date: '',
  keyword: ''
});

// 3. ฟังก์ชันดึงข้อมูลจาก Backend (Real-time)
const fetchNews = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/news');
    // แปลงข้อมูลจาก DB ให้เข้ากับรูปแบบที่ Template ต้องการ
    rawNews.value = response.data.map(item => ({
      id: item.id,
      location: item.location,
      province: 'นนทบุรี',
      detail: item.description,
      date: item.start_time.split('T')[0], // แยกวันที่ออกมาเพื่อใช้กรอง
      startTime: new Date(item.start_time).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      endTime: new Date(item.end_time).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      fullStartTime: item.start_time, // เก็บไว้ใช้ฟังก์ชันฟอร์แมต
      fullEndTime: item.end_time
    }));
  } catch (error) {
    console.error("ดึงข้อมูลข่าวสารไม่สำเร็จ:", error);
  }
};

// 4. ฟังก์ชันค้นหาและกรองข้อมูล (Computed จะทำงานอัตโนมัติเมื่อ filters หรือ rawNews เปลี่ยน)
const displayedNews = computed(() => {
  return rawNews.value.filter(item => {
    // กรองวันที่
    const matchDate = !filters.date || item.date === filters.date;

    // กรองสถานที่หรือรายละเอียด (Keyword)
    const matchKeyword = !filters.keyword || 
      item.location.includes(filters.keyword) || 
      item.detail.includes(filters.keyword);

    // กรองเวลา
    let matchTime = true;
    if (filters.startTime && item.startTime < filters.startTime) matchTime = false;
    if (filters.endTime && item.endTime > filters.endTime) matchTime = false;

    return matchDate && matchKeyword && matchTime;
  });
});

// 5. ฟังก์ชันจัดการฟอร์มและล้างค่า
const handleSearch = () => {
  console.log('Searching with:', filters);
};

const resetFilters = () => {
  filters.startTime = '';
  filters.endTime = '';
  filters.date = '';
  filters.keyword = '';
};

// 6. ฟังก์ชันจัดรูปแบบวันเวลาแสดงผล (ภาษาไทย พ.ศ.)
const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return '';
  
  const dateObj = new Date(dateTimeStr);
  const day = dateObj.getDate();
  const months = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];
  const month = months[dateObj.getMonth()];
  const year = dateObj.getFullYear() + 543;
  const time = dateObj.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
  
  return `${day} ${month} ${year} ${time}`;
};

onMounted(() => {
  fetchNews();
  // ตั้งเวลาดึงข้อมูลใหม่ทุก 30 วินาทีเพื่อให้เป็น Real-time
  setInterval(fetchNews, 30000);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;700&display=swap');

.font-sarabun {
  font-family: 'Sarabun', sans-serif;
}

/* Navbar Styles */
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

/* Filter Input Styles */
.filter-input {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 8px 12px;
  background: white;
  outline: none;
  text-align: center;
  width: 120px;
  height: 42px;
}
</style>