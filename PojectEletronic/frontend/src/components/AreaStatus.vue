<template>
  <div class="min-h-screen bg-[#f1f5f9] p-4 md:p-10 font-sarabun">
    
    <div class="max-w-6xl mx-auto mb-10 text-center">
      <div class="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-sm mb-4">
        <AlertCircle class="text-red-500 w-8 h-8" />
      </div>
      <h1 class="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
        แจ้งเตือนสถานะพื้นที่ไฟดับ
      </h1>
      <p class="text-slate-500">ติดตามสถานะการแก้ไขปัญหาแบบ Real-time</p>
    </div>

    <div class="max-w-6xl mx-auto">
      
      <div v-if="activeReports.length === 0" class="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100 flex flex-col items-center animate-fade-in">
        <div class="bg-green-50 p-6 rounded-full mb-4">
          <CheckCircle2 class="w-16 h-16 text-green-500" />
        </div>
        <h3 class="text-2xl font-bold text-slate-700 mb-2">เหตุการณ์ปกติ</h3>
        <p class="text-slate-400">ขอบคุณครับ! ขณะนี้ไม่มีรายการแจ้งเหตุขัดข้องที่กำลังดำเนินการ</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="item in activeReports" :key="item.id" 
          class="bg-white rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col group relative"
        >
          <div :class="getStatusColor(item.status).border" class="absolute left-0 top-0 bottom-0 w-1.5"></div>

          <div class="p-6 pb-2">
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center gap-1 text-slate-400 text-xs font-bold bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                <Clock class="w-3.5 h-3.5" /> {{ formatDate(item.created_at) }}
              </div>
              
              <span :class="getStatusColor(item.status).badge" class="px-3 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <span class="relative flex h-2 w-2">
                  <span :class="getStatusColor(item.status).dotPing" class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"></span>
                  <span :class="getStatusColor(item.status).dotColor" class="relative inline-flex rounded-full h-2 w-2"></span>
                </span>
                {{ getStatusText(item.status) }}
              </span>
            </div>

            <div class="mb-3">
              <h3 class="font-bold text-xl text-slate-800 leading-snug flex items-start gap-2 group-hover:text-blue-600 transition-colors">
                <MapPin class="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                {{ item.location_name || 'ไม่ระบุชื่อสถานที่' }}
              </h3>
            </div>

            <div class="pl-8 mb-4">
               <div class="inline-block bg-orange-50 text-orange-700 text-xs font-bold px-3 py-1 rounded-lg border border-orange-100">
                 ⚠️ สาเหตุ: {{ item.reason || 'ไม่ระบุ' }}
               </div>
               <p v-if="item.details" class="text-slate-400 text-xs mt-2 italic line-clamp-2">"{{ item.details }}"</p>
            </div>
          </div>

          <div class="mt-auto relative h-48 w-full bg-slate-100 border-t border-slate-100 group-hover:h-52 transition-all duration-500">
            <iframe 
              width="100%" 
              height="100%" 
              style="border:0; opacity: 0.9;" 
              loading="lazy" 
              allowfullscreen
              class="group-hover:opacity-100 transition-opacity"
              :src="`https://maps.google.com/maps?q=${item.latitude},${item.longitude}&z=15&output=embed`">
            </iframe>
            
            <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               <a :href="`https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`" 
                 target="_blank"
                 class="bg-white text-blue-600 px-6 py-2 rounded-full shadow-lg font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <Navigation class="w-4 h-4" /> นำทางไปจุดนี้
              </a>
            </div>
            
            <a :href="`https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`" 
               target="_blank"
               class="absolute bottom-3 right-3 bg-white/90 backdrop-blur text-slate-700 px-3 py-1.5 rounded-lg shadow-sm text-xs font-bold border border-white group-hover:opacity-0 transition-opacity flex items-center gap-1"
            >
              <Navigation class="w-3 h-3" /> แผนที่
            </a>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { 
  Clock, MapPin, AlertCircle, CheckCircle2, Navigation 
} from 'lucide-vue-next';

const reports = ref([]);

// ดึงข้อมูล
const fetchReports = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/api/admin/reports?t=${Date.now()}`);
    reports.value = response.data;
  } catch (error) {
    console.error("Error fetching reports", error);
  }
};

// กรองเฉพาะงานที่ค้าง
const activeReports = computed(() => {
  return reports.value.filter(item => {
    const allowedStatuses = ['แจ้งเจ้าหน้าที่แล้ว', 'เจ้าหน้าที่รับเรื่องแล้ว'];
    return item.status && allowedStatuses.includes(item.status.trim());
  });
});

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('th-TH', { 
    day: 'numeric', month: 'short', year: '2-digit',
    hour: '2-digit', minute: '2-digit'
  });
};

// ข้อความสถานะ
const getStatusText = (status) => {
  const s = status ? status.trim() : '';
  if (s === 'แจ้งเจ้าหน้าที่แล้ว') return 'รอเจ้าหน้าที่รับเรื่อง';
  if (s === 'เจ้าหน้าที่รับเรื่องแล้ว') return 'กำลังดำเนินการซ่อม';
  return s;
};

// สีสถานะ (รวม Class ต่างๆ ไว้ที่เดียวเพื่อให้โค้ดสะอาด)
const getStatusColor = (status) => {
  const s = status ? status.trim() : '';
  
  if (s === 'แจ้งเจ้าหน้าที่แล้ว') { // สีเหลือง
    return {
      border: 'bg-yellow-400',
      badge: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      dotPing: 'bg-yellow-400',
      dotColor: 'bg-yellow-500'
    };
  } else if (s === 'เจ้าหน้าที่รับเรื่องแล้ว') { // สีฟ้า
    return {
      border: 'bg-blue-500',
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
      dotPing: 'bg-blue-400',
      dotColor: 'bg-blue-500'
    };
  }
  return { border: 'bg-gray-300', badge: 'bg-gray-100', dotPing: '', dotColor: 'bg-gray-400' };
};

onMounted(() => {
  fetchReports();
  setInterval(fetchReports, 5000); 
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