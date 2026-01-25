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
          class="bg-white border border-gray-300 px-6 py-2 rounded-lg shadow-sm hover:bg-gray-50 font-medium h-[42px] transition"
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

      <div class="border-b border-gray-400 pb-2 mb-4">
        <h2 class="text-xl font-medium">เนื้อหาทั้งหมด ({{ displayedStatus.length }} รายการ)</h2>
      </div>

      <div class="w-full overflow-x-auto">
        <table class="w-full min-w-[800px] text-left border-collapse">
          <thead>
            <tr class="text-lg border-b border-gray-200">
              <th class="py-4 pl-4 w-[30%] font-medium">วัน/เวลา</th>
              <th class="py-4 w-[40%] font-medium">จุด/บริเวณ</th>
              <th class="py-4 w-[30%] font-medium text-center">สถานะ</th>
            </tr>
          </thead>
          <tbody class="text-sm md:text-base">
            <tr 
              v-for="(item, index) in displayedStatus" 
              :key="item.id"
              :class="index % 2 === 0 ? 'bg-[#e0e0e0]' : 'bg-white'"
            >
              <td class="py-4 pl-4 align-top">
                <div class="mb-1 font-bold">{{ formatDate(item.date) }}</div>
                <div class="text-gray-600">{{ item.startTime }} น. - {{ item.endTime }} น.</div>
              </td>
              <td class="py-4 align-top">
                <div class="font-bold mb-1">{{ item.location }}</div>
                <div class="text-gray-600">{{ item.province }}</div>
              </td>
              <td class="py-4 text-center align-top">
                <span 
                  v-if="item.status === 'in_progress'"
                  class="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-bold text-sm border border-yellow-200 shadow-sm"
                >
                  กำลังดำเนินการ
                </span>
                <span 
                  v-else-if="item.status === 'completed'"
                  class="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-sm border border-green-200 shadow-sm"
                >
                  แก้ไขเสร็จสิ้น
                </span>
                <span 
                  v-else
                  class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-bold text-sm border border-gray-200 shadow-sm"
                >
                  รอดำเนินการ
                </span>
              </td>
            </tr>

            <tr v-if="displayedStatus.length === 0">
              <td colspan="3" class="text-center py-8 text-gray-500">
                ไม่พบข้อมูลสถานะตามเงื่อนไขที่ค้นหา
              </td>
            </tr>

            <tr v-if="displayedStatus.length > 0 && displayedStatus.length < 5" class="bg-white h-16">
              <td></td><td></td><td></td>
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

// 1. กำหนด Event สำหรับเปลี่ยนหน้า
const emit = defineEmits(['changePage']);

// 2. ตัวแปรเก็บข้อมูล (รวมข้อมูลจำลองและข้อมูลจาก Database)
const rawReports = ref([]);

// 3. ตัวแปรสำหรับกรองข้อมูล (Filter) - ใช้ reactive เพียงตัวเดียว
const filters = reactive({
  startTime: '',
  endTime: '',
  date: '',
  keyword: ''
});

// 4. ฟังก์ชันดึงข้อมูลจาก Backend (Real-time)
const fetchReports = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/reports');
    // แปลงข้อมูลจาก DB ให้เข้ากับรูปแบบที่ Template ต้องการแสดงผล
    rawReports.value = response.data.map(item => ({
      id: item.id,
      date: item.created_at, // ใช้ค่าวันที่จากฐานข้อมูล
      startTime: new Date(item.created_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      endTime: 'กำลังดำเนินการ', // สามารถปรับเปลี่ยนได้ตาม Logic 
      location: item.location || 'ไม่ระบุสถานที่',
      province: 'นนทบุรี',
      status: item.status // 'in_progress', 'completed', 'pending' หรือ 'รอดำเนินการ'
    }));
  } catch (error) {
    console.error("ดึงข้อมูลไม่สำเร็จ:", error);
  }
};

// 5. Computed สำหรับกรองข้อมูล (รักษาฟังก์ชันค้นหาเดิมไว้)
const displayedStatus = computed(() => {
  return rawReports.value.filter(item => {
    // กรองสถานที่ (Keyword)
    const matchKeyword = !filters.keyword || item.location.includes(filters.keyword);
    
    // กรองวันที่
    const matchDate = !filters.date || item.date.startsWith(filters.date);
    
    // กรองเวลา
    let matchTime = true;
    if (filters.startTime && item.startTime < filters.startTime) matchTime = false;
    if (filters.endTime && item.endTime > filters.endTime) matchTime = false;

    return matchKeyword && matchDate && matchTime;
  });
});

// 6. ฟังก์ชันจัดการฟอร์มและล้างค่า
const handleSearch = () => {
  // ทำงานอัตโนมัติผ่าน computed (displayedStatus)
  console.log('Searching with:', filters);
};

const resetFilters = () => {
  filters.startTime = '';
  filters.endTime = '';
  filters.date = '';
  filters.keyword = '';
};

// 7. ฟังก์ชันแปลงวันที่เป็นภาษาไทย (เช่น 2025-12-16 -> 16 ธ.ค. 2568)
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const dateObj = new Date(dateStr);
  const day = dateObj.getDate();
  const monthsShort = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
  ];
  const month = monthsShort[dateObj.getMonth()];
  const year = dateObj.getFullYear() + 543;
  
  return `${day} ${month} ${year}`;
};

// 8. เริ่มต้นทำงาน
onMounted(() => {
  fetchReports();
  // ตั้งเวลาดึงข้อมูลใหม่ทุก 30 วินาทีเพื่อให้เป็น Real-time
  setInterval(fetchReports, 30000);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;700&display=swap');

.font-sarabun {
  font-family: 'Sarabun', sans-serif;
}

/* Navbar Items */
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

/* Filter Inputs */
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