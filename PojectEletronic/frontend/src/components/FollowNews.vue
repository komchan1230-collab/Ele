<template>
  <div class="min-h-screen bg-[#f8fafc] font-sarabun text-[#333] p-4 md:p-8">
    
    <main class="max-w-[1200px] mx-auto">
      
      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold text-slate-800 mb-2 flex justify-center items-center gap-3">
          <div class="bg-blue-100 p-2 rounded-full">
            <History class="text-blue-600 w-6 h-6" />
          </div>
          ประวัติการแก้ไขไฟดับ
        </h1>
        <p class="text-slate-500">สถิติและระยะเวลาที่ใช้ในการซ่อมแซมแต่ละจุด</p>
      </div>

      <div class="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 mb-8 relative">
        
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center gap-2 text-slate-700 font-bold text-sm">
            <Filter class="w-4 h-4 text-blue-500" /> ตัวกรองค้นหา
          </div>
          
          <button 
            v-if="filters.date || filters.reason || filters.keyword" 
            @click="resetFilters" 
            class="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-1 transition bg-red-50 px-3 py-1.5 rounded-full border border-red-100 hover:bg-red-100"
          >
            <RotateCcw class="w-3 h-3" /> ล้างค่าทั้งหมด
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar class="h-5 w-5 text-gray-400" />
            </div>
            <input 
              v-model="filters.date" 
              type="date" 
              class="pl-10 block w-full rounded-xl border border-gray-200 bg-slate-50 py-3 outline-none text-slate-600 focus:ring-2 focus:ring-blue-100 transition cursor-pointer" 
            />
          </div>

          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <TriangleAlert class="h-5 w-5 text-gray-400" />
            </div>
            <select 
              v-model="filters.reason" 
              class="pl-10 pr-8 block w-full rounded-xl border border-gray-200 bg-slate-50 py-3 outline-none text-slate-600 appearance-none cursor-pointer focus:ring-2 focus:ring-blue-100 transition"
            >
              <option value="">ทั้งหมด (ทุกสาเหตุ)</option>
              <option value="สายไฟ/อุปกรณ์ชำรุด">สายไฟ/อุปกรณ์ชำรุด</option>
              <option value="ภัยธรรมชาติ/ฝนตก">ภัยธรรมชาติ/ฝนตก</option>
              <option value="สัตว์ทำไฟฟ้าลัดวงจร">สัตว์ทำไฟฟ้าลัดวงจร</option>
              <option value="อุบัติเหตุ/รถชนเสาไฟ">อุบัติเหตุ/รถชนเสาไฟ</option>
              <option value="หม้อแปลงระเบิด">หม้อแปลงระเบิด</option>
              <option value="ไม่ทราบสาเหตุ">ไม่ทราบสาเหตุ</option>
            </select>
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>

          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search class="h-5 w-5 text-gray-400" />
            </div>
            <input 
              v-model="filters.keyword" 
              type="text" 
              placeholder="ระบุสถานที่..." 
              class="pl-10 block w-full rounded-xl border border-gray-200 bg-slate-50 py-3 outline-none text-slate-600 focus:ring-2 focus:ring-blue-100 transition" 
            />
          </div>

        </div>
      </div>

      <div class="flex justify-between items-end border-b border-gray-200 pb-4 mb-6 px-2">
        <h2 class="text-xl font-bold text-slate-700 flex items-center gap-2">
          <CheckCircle2 class="text-green-500 w-6 h-6" /> งานที่เสร็จแล้ว ({{ displayedData.length }})
        </h2>
        
        <button 
          @click="$emit('changePage', 'statistics')" 
          class="bg-white text-blue-600 border border-blue-200 px-5 py-2 rounded-xl shadow-sm hover:bg-blue-50 font-bold text-sm transition flex items-center gap-2 hover:-translate-y-0.5"
        >
          <BarChart3 class="w-4 h-4" /> ดูสถิติภาพรวม
        </button>
      </div>

      <div class="space-y-4">
        <div 
          v-for="(item, index) in displayedData" 
          :key="item.id" 
          class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200 flex flex-col md:flex-row items-center gap-6 group"
        >
          
          <div class="md:w-[20%] min-w-[150px] text-center md:text-left border-r border-slate-100 pr-6">
            <div class="font-bold text-slate-800 text-lg">{{ formatDateFull(item.updated_at || item.created_at) }}</div> 
            <div class="text-slate-400 text-xs font-medium mt-1">วันที่ปิดงานแก้ไข</div>
          </div>

          <div class="md:w-[35%] flex-grow w-full">
            <div class="flex items-start gap-3">
               <div class="bg-red-50 p-2.5 rounded-full mt-1"><MapPin class="w-6 h-6 text-red-500" /></div>
               <div>
                 <h3 class="font-bold text-xl text-slate-800 group-hover:text-blue-600 transition-colors leading-tight">
                    {{ item.location_name || item.reporter_name || 'ไม่ระบุชื่อสถานที่' }}
                 </h3>
                 <div class="flex items-center gap-2 mt-2">
                   <span class="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100">
                     ⚠️ {{ item.reason }}
                   </span>
                   <span v-if="!item.location_name" class="text-xs text-gray-400">(ผู้แจ้ง: {{ item.reporter_name }})</span>
                 </div>
               </div>
            </div>
          </div>

          <div class="md:w-[25%] w-full bg-slate-50 rounded-xl p-3 border border-slate-100">
             <div class="flex justify-between items-center mb-1">
               <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ระยะเวลาดำเนินการ</span>
               <Timer class="w-4 h-4 text-blue-400" />
             </div>
             
             <div class="font-bold text-blue-900 text-lg">
                {{ calculateDuration(item.created_at, item.updated_at) }}
             </div>
             
             <div class="flex justify-between text-[11px] text-slate-500 mt-1 font-medium">
               <span>เริ่ม: {{ formatTime(item.created_at) }}</span>
               <span v-if="item.updated_at">เสร็จ: {{ formatTime(item.updated_at) }}</span>
               <span v-else>เสร็จ: -</span>
             </div>
          </div>

          <div class="md:w-[20%] w-full flex justify-end">
             <span class="px-4 py-2 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200 shadow-sm flex items-center gap-2">
               <CheckCircle2 class="w-4 h-4" /> แก้ไขเสร็จสิ้น
             </span>
          </div>
        </div>

        <div v-if="displayedData.length === 0" class="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
           <div class="flex flex-col items-center gap-3">
             <div class="bg-slate-50 p-4 rounded-full"><Search class="w-8 h-8 text-slate-300" /></div>
             <span class="text-slate-500 font-medium">ไม่พบข้อมูลตามเงื่อนไขที่ค้นหา</span>
             <button @click="resetFilters" class="text-blue-500 text-sm hover:underline font-bold">ล้างตัวกรอง</button>
           </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { 
  User, History, Filter, Calendar, Search, 
  CheckCircle2, BarChart3, MapPin, Timer, TriangleAlert, RotateCcw 
} from 'lucide-vue-next';
import axios from 'axios';

const emit = defineEmits(['changePage']);
const rawReports = ref([]);

// ตัวกรองข้อมูล
const filters = reactive({ date: '', reason: '', keyword: '' });

// ดึงข้อมูล
const fetchReports = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/api/admin/reports?t=${Date.now()}`);
    rawReports.value = response.data;
  } catch (error) { console.error(error); }
};

// กรองข้อมูล (Computed Property)
const displayedData = computed(() => {
  return rawReports.value.filter(item => {
    // 1. เอาเฉพาะงานที่เสร็จแล้ว
    if (item.status !== 'แก้ไขเสร็จสิ้นแล้ว') return false;
    
    // 2. กรองวันที่
    if (filters.date) {
      if (new Date(item.created_at).toISOString().split('T')[0] !== filters.date) return false;
    }
    
    // 3. กรองสาเหตุ
    if (filters.reason) {
      if (item.reason !== filters.reason) return false;
    }

    // 4. กรองคำค้นหา
    if (filters.keyword) {
      const search = filters.keyword.toLowerCase();
      const text = `${item.location_name || ''} ${item.reporter_name}`.toLowerCase();
      if (!text.includes(search)) return false;
    }
    return true;
  });
});

const resetFilters = () => { filters.date = ''; filters.reason = ''; filters.keyword = ''; };

// คำนวณระยะเวลาซ่อม
const calculateDuration = (startStr, endStr) => {
  if (!startStr || !endStr) return 'ไม่ระบุเวลา'; 
  const start = new Date(startStr);
  const end = new Date(endStr);
  const diffMs = end - start;
  
  if (diffMs < 0) return 'ข้อมูลคลาดเคลื่อน';
  if (diffMs < 60000) return 'น้อยกว่า 1 นาที'; 

  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHrs > 0) return `${diffHrs} ชม. ${diffMins} นาที`;
  else return `${diffMins} นาที`;
};

// แปลงวันที่เป็นไทย
const formatDateFull = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
};

// แปลงเวลา (เติม น.)
const formatTime = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';
};

onMounted(() => {
  fetchReports();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;700&display=swap');
.font-sarabun { font-family: 'Sarabun', sans-serif; }
</style>