<template>
  <div class="min-h-screen bg-[#f8fafc] font-sarabun text-[#333]">
    
    <main class="max-w-[1200px] mx-auto p-6">
      
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-slate-800 mb-2 flex justify-center items-center gap-2">
          <History class="text-blue-600 w-8 h-8" /> ประวัติการแก้ไขไฟดับ
        </h1>
        <p class="text-slate-500">รายการแจ้งเหตุที่เจ้าหน้าที่ดำเนินการแก้ไขเสร็จสิ้นแล้ว</p>
      </div>

      <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-8">
        <div class="flex items-center gap-2 mb-4 text-slate-700 font-bold text-sm">
          <Filter class="w-4 h-4 text-blue-500" /> ตัวกรองค้นหา
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar class="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition" />
            </div>
            <input 
              v-model="filters.date" 
              type="date" 
              class="pl-10 block w-full rounded-xl border border-gray-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-blue-500 transition sm:text-sm py-2.5 outline-none" 
            />
          </div>

          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock class="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition" />
            </div>
            <input 
              v-model="filters.startTime" 
              type="time" 
              class="pl-10 block w-full rounded-xl border border-gray-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-blue-500 transition sm:text-sm py-2.5 outline-none" 
            />
          </div>

          <div class="relative group">
             <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock class="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition" />
            </div>
            <input 
              v-model="filters.endTime" 
              type="time" 
              class="pl-10 block w-full rounded-xl border border-gray-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-blue-500 transition sm:text-sm py-2.5 outline-none" 
            />
          </div>

          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search class="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition" />
            </div>
            <input 
              v-model="filters.keyword" 
              type="text" 
              placeholder="ระบุสถานที่ / สาเหตุ..." 
              class="pl-10 block w-full rounded-xl border border-gray-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-blue-500 transition sm:text-sm py-2.5 outline-none" 
            />
            <button v-if="filters.keyword || filters.date || filters.startTime" @click="resetFilters" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-red-500 cursor-pointer transition">
              <X class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div class="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
        <h2 class="text-xl font-bold text-slate-700 flex items-center gap-2">
          <CheckCircle2 class="text-green-500" /> งานที่เสร็จแล้ว ({{ displayedData.length }})
        </h2>
        
        <button 
          @click="$emit('changePage', 'statistics')"
          class="bg-white text-blue-600 border border-blue-200 px-4 py-2 rounded-lg shadow-sm hover:bg-blue-50 font-bold text-sm transition flex items-center gap-2"
        >
          <BarChart3 class="w-4 h-4" /> ข้อมูลสถิติ
        </button>
      </div>

      <div class="w-full bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[800px] text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                <th class="py-4 pl-6 w-[20%] font-bold">วัน/เวลา ที่แจ้ง</th>
                <th class="py-4 w-[25%] font-bold">ผู้แจ้ง / จุดบริเวณ</th>
                <th class="py-4 w-[35%] font-bold">สาเหตุ / รายละเอียด</th>
                <th class="py-4 w-[20%] font-bold text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody class="text-sm md:text-base divide-y divide-slate-100">
              <tr 
                v-for="(item, index) in displayedData" 
                :key="item.id"
                class="hover:bg-blue-50/50 transition duration-150"
              >
                <td class="py-4 pl-6 align-top">
                   <div class="font-bold text-slate-700">{{ formatDate(item.created_at) }}</div>
                   <div class="text-slate-400 text-xs flex items-center gap-1 mt-1 font-medium bg-slate-100 w-fit px-2 py-0.5 rounded">
                     <Clock class="w-3 h-3" /> {{ formatTime(item.created_at) }} น.
                   </div>
                </td>
                
                <td class="py-4 align-top">
                  <div class="font-bold text-slate-800 flex items-center gap-1">
                    <MapPin class="w-4 h-4 text-red-500" /> {{ item.reporter_name }}
                  </div>
                  <div class="text-slate-500 text-xs mt-1 pl-5">{{ item.phone || '-' }}</div>
                </td>
                
                <td class="py-4 align-top">
                  <div class="text-orange-600 font-bold text-sm mb-1">⚠️ {{ item.reason || 'ไม่ระบุ' }}</div>
                  <div class="text-slate-500 text-sm italic">"{{ item.details || '-' }}"</div>
                </td>
                
                <td class="py-4 text-center align-top">
                  <span class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200 shadow-sm">
                    <CheckCircle2 class="w-3.5 h-3.5" /> แก้ไขเสร็จสิ้น
                  </span>
                </td>
              </tr>

              <tr v-if="displayedData.length === 0">
                <td colspan="4" class="text-center py-12 text-slate-400">
                   <div class="flex flex-col items-center gap-2">
                     <History class="w-12 h-12 text-slate-200" />
                     <span>ไม่พบข้อมูลประวัติการซ่อมตามเงื่อนไขที่ค้นหา</span>
                   </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { 
  User, TriangleAlert, Megaphone, MapPin, 
  History, Filter, Calendar, Clock, Search, X, CheckCircle2, BarChart3
} from 'lucide-vue-next';
import axios from 'axios';

// Event เปลี่ยนหน้า
const emit = defineEmits(['changePage']);

// 1. เก็บข้อมูลดิบจาก API reports
const rawReports = ref([]);

// 2. ตัวแปร Filter
const filters = reactive({
  startTime: '',
  endTime: '',
  date: '',
  keyword: ''
});

// 3. ดึงข้อมูล (เปลี่ยนจาก /api/news เป็น /api/admin/reports เพื่อเอาข้อมูลจริง)
const fetchReports = async () => {
  try {
    // ใส่ timestamp กัน cache
    const response = await axios.get(`http://localhost:3000/api/admin/reports?t=${Date.now()}`);
    rawReports.value = response.data;
  } catch (error) {
    console.error("ดึงข้อมูลไม่สำเร็จ:", error);
  }
};

// 4. กรองข้อมูล (Computed)
const displayedData = computed(() => {
  return rawReports.value.filter(item => {
    
    // เงื่อนไขที่ 1: ต้องเป็นงานที่ "เสร็จแล้ว" เท่านั้น
    if (item.status !== 'แก้ไขเสร็จสิ้นแล้ว') return false;

    // เงื่อนไขที่ 2: วันที่
    if (filters.date) {
      const itemDate = new Date(item.created_at).toISOString().split('T')[0];
      if (itemDate !== filters.date) return false;
    }

    // เงื่อนไขที่ 3: Keyword (ค้นหาจาก ชื่อผู้แจ้ง, สาเหตุ, รายละเอียด)
    if (filters.keyword) {
      const search = filters.keyword.toLowerCase();
      const text = `${item.reporter_name} ${item.reason} ${item.details || ''}`.toLowerCase();
      if (!text.includes(search)) return false;
    }

    // เงื่อนไขที่ 4: เวลา (เทียบกับเวลาแจ้งเหตุ)
    if (filters.startTime) {
      const itemTime = new Date(item.created_at).toTimeString().slice(0, 5);
      if (itemTime < filters.startTime) return false;
    }
    if (filters.endTime) {
      const itemTime = new Date(item.created_at).toTimeString().slice(0, 5);
      if (itemTime > filters.endTime) return false;
    }

    return true;
  });
});

const resetFilters = () => {
  filters.startTime = '';
  filters.endTime = '';
  filters.date = '';
  filters.keyword = '';
};

// จัดรูปแบบวันที่
const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('th-TH', { 
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

// จัดรูปแบบเวลา
const formatTime = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
};

onMounted(() => {
  fetchReports();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;700&display=swap');

.font-sarabun {
  font-family: 'Sarabun', sans-serif;
}
</style>

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