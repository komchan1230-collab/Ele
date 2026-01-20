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
      
      <div class="nav-item active cursor-pointer group">
        <Megaphone class="icon-nav" /> 
        <span>ติดตามข่าวสาร</span>
      </div>
      
      <div class="nav-item cursor-pointer group" @click="$emit('changePage', 'status')">
        <MapPin class="icon-nav group-hover:scale-110 transition-transform" /> 
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
import { ref, onMounted } from 'vue';
import { User, TriangleAlert, Megaphone, MapPin, MessageCircleMore } from 'lucide-vue-next';

// กำหนด Event เพื่อใช้เปลี่ยนหน้า
const emit = defineEmits(['changePage']);

// 1. ข้อมูลจำลอง (Mock Data)
const allNewsData = [
  {
    id: 1,
    location: 'เมเจอร์-ปากเกร็ด',
    province: 'นนทบุรี',
    detail: 'หมู่บ้านรุ่งเรืองธานี จะมีการดับไฟเพื่อแก้ไขปัญหาหม้อแปลงระเบิด',
    date: '2025-12-25',
    startTime: '12:00',
    endTime: '16:00'
  },
  {
    id: 2,
    location: 'ตลาดปากเกร็ด',
    province: 'นนทบุรี',
    detail: 'ซ่อมแซมสายไฟหลักบริเวณทางเข้าตลาด',
    date: '2025-12-26',
    startTime: '09:00',
    endTime: '11:00'
  },
  {
    id: 3,
    location: 'โรงเรียนปากเกร็ด',
    province: 'นนทบุรี',
    detail: 'แจ้งดับไฟเพื่อตัดกิ่งไม้ใกล้สายไฟฟ้าแรงสูง',
    date: '2025-12-25',
    startTime: '13:00',
    endTime: '15:00'
  },
  {
    id: 4,
    location: 'ห้าแยกปากเกร็ด',
    province: 'นนทบุรี',
    detail: 'ย้ายเสาไฟฟ้าเพื่อขยายถนน',
    date: '2025-12-28',
    startTime: '10:00',
    endTime: '18:00'
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
const displayedNews = ref([...allNewsData]);

// 4. ฟังก์ชันค้นหา
const handleSearch = () => {
  displayedNews.value = allNewsData.filter(item => {
    // กรองวันที่ (ถ้าเลือกวันที่ ต้องตรงเป๊ะ)
    const matchDate = !filters.value.date || item.date === filters.value.date;

    // กรองสถานที่ (Keyword)
    const matchKeyword = !filters.value.keyword || 
      item.location.includes(filters.value.keyword) || 
      item.detail.includes(filters.value.keyword);

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
  displayedNews.value = [...allNewsData];
};

// 6. ฟังก์ชันจัดรูปแบบวันเวลาแสดงผล
const formatDateTime = (dateStr, timeStr) => {
  if (!dateStr) return '';
  
  const dateObj = new Date(dateStr);
  const day = dateObj.getDate();
  const months = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];
  const month = months[dateObj.getMonth()];
  const year = dateObj.getFullYear() + 543; // แปลงเป็น พ.ศ.
  
  return `${day} ${month} ${year} ${timeStr}`;
};

onMounted(() => {
  handleSearch();
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