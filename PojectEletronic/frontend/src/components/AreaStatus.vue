<template>
  <div class="min-h-screen bg-[#eef2f9] font-sarabun text-[#333]">
    
    <header class="bg-[#87CEEB] px-5 py-4 flex justify-between items-center text-black shadow-sm">
      <h1 
        class="text-lg font-bold m-0 cursor-pointer hover:opacity-70 transition-opacity" 
        @click="$emit('changePage', 'home')"
        title="กลับหน้าหลัก"
      >
        แจ้งปัญหาไฟดับ (ในชุมชนเมเจอร์ปากเกร็ด)
      </h1>
      <div class="cursor-pointer">
        <User class="w-8 h-8 text-black" />
      </div>
    </header>

    <nav class="bg-[#87CEEB] flex justify-around pb-2 shadow-md relative z-10">
      <div class="nav-item cursor-pointer group" @click="$emit('changePage', 'report')">
        <TriangleAlert class="icon-nav group-hover:scale-110 transition-transform" /> 
        <span>แจ้งปัญหา</span>
      </div>
      
      <div class="nav-item cursor-pointer group" @click="$emit('changePage', 'news')">
        <Megaphone class="icon-nav group-hover:scale-110 transition-transform" /> 
        <span>ติดตามข่าวสาร</span>
      </div>
      
      <div class="nav-item active cursor-pointer">
        <MapPin class="icon-nav" /> 
        <span>แจ้งเตือนสถานะพื้นที่</span>
      </div>
      
      <div class="nav-item cursor-pointer group" @click="$emit('changePage', 'contact')">
        <MessageCircleMore class="icon-nav group-hover:scale-110 transition-transform" /> 
        <span>ติดต่อเรา</span>
      </div>
    </nav>

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
import { ref, onMounted } from 'vue';
import { User, TriangleAlert, Megaphone, MapPin, MessageCircleMore } from 'lucide-vue-next';

// รับ Event changePage จาก App.vue
const emit = defineEmits(['changePage']);

// 1. ข้อมูลจำลอง (Mock Data)
const allStatusData = [
  {
    id: 1,
    date: '2025-12-16',
    startTime: '09:00',
    endTime: '13:00',
    location: 'เมเจอร์-ปากเกร็ด',
    province: 'นนทบุรี',
    status: 'in_progress' // in_progress, completed, pending
  },
  {
    id: 2,
    date: '2025-12-15',
    startTime: '10:00',
    endTime: '11:30',
    location: 'ตลาดปากเกร็ด',
    province: 'นนทบุรี',
    status: 'completed'
  },
  {
    id: 3,
    date: '2025-12-25',
    startTime: '13:00',
    endTime: '16:00',
    location: 'โรงเรียนปากเกร็ด',
    province: 'นนทบุรี',
    status: 'pending'
  },
  {
    id: 4,
    date: '2025-12-20',
    startTime: '08:30',
    endTime: '17:00',
    location: 'ห้าแยกปากเกร็ด',
    province: 'นนทบุรี',
    status: 'completed'
  }
];

// 2. ตัวแปรเก็บค่าจาก Filter
const filters = ref({
  startTime: '',
  endTime: '',
  date: '',
  keyword: ''
});

// 3. ตัวแปรเก็บข้อมูลที่จะแสดงผล
const displayedStatus = ref([...allStatusData]);

// 4. ฟังก์ชันค้นหา
const handleSearch = () => {
  displayedStatus.value = allStatusData.filter(item => {
    // กรองวันที่
    const matchDate = !filters.value.date || item.date === filters.value.date;

    // กรองสถานที่ (Keyword)
    const matchKeyword = !filters.value.keyword || 
      item.location.includes(filters.value.keyword);

    // กรองเวลา
    let matchTime = true;
    if (filters.value.startTime && item.startTime < filters.value.startTime) {
      matchTime = false;
    }
    if (filters.value.endTime && item.endTime > filters.value.endTime) {
      matchTime = false;
    }

    return matchDate && matchKeyword && matchTime;
  });
};

// 5. ฟังก์ชันล้างค่าค้นหา
const resetFilters = () => {
  filters.value = {
    startTime: '',
    endTime: '',
    date: '',
    keyword: ''
  };
  displayedStatus.value = [...allStatusData];
};

// 6. ฟังก์ชันแปลงวันที่เป็นภาษาไทย (เช่น 2025-12-16 -> 16 ธ.ค. 2568)
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

// เรียกค้นหาครั้งแรก
onMounted(() => {
  handleSearch();
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