<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { 
  Clock, MapPin, AlertCircle, CheckCircle2, Navigation 
} from 'lucide-vue-next';

const reports = ref([]);
const loading = ref(true);

// ดึงข้อมูลจาก Server
const fetchReports = async () => {
  try {
    // เพิ่ม ?t=... เพื่อป้องกันเครื่องจำค่าเก่า (Cache)
    const response = await axios.get(`http://localhost:3000/api/admin/reports?t=${Date.now()}`);
    reports.value = response.data;
  } catch (error) {
    console.error("โหลดข้อมูลไม่สำเร็จ", error);
  } finally {
    loading.value = false;
  }
};

// 🟢 หัวใจสำคัญ: ตัวกรองงานที่จะแสดงผล
const activeReports = computed(() => {
  return reports.value.filter(item => {
    // ต้องมีสถานะเป็น 2 อย่างนี้เท่านั้น ถึงจะโชว์!
    // ถ้าเป็น 'แก้ไขเสร็จสิ้นแล้ว' หรืออื่นๆ จะถูกดีดออกทันที
    const allowedStatuses = ['แจ้งเจ้าหน้าที่แล้ว', 'เจ้าหน้าที่รับเรื่องแล้ว'];
    return item.status && allowedStatuses.includes(item.status.trim());
  });
});

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('th-TH', { 
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

// ตั้งค่าสีและข้อความของสถานะ
const getStatusStyle = (status) => {
  const s = status ? status.trim() : '';
  if (s === 'แจ้งเจ้าหน้าที่แล้ว') {
    return { 
      text: '⏳ รอเจ้าหน้าที่รับเรื่อง', 
      class: 'bg-yellow-100 text-yellow-800 border-yellow-300' 
    };
  } else if (s === 'เจ้าหน้าที่รับเรื่องแล้ว') {
    return { 
      text: '🛠️ กำลังดำเนินการซ่อม', 
      class: 'bg-blue-600 text-white shadow-lg shadow-blue-200 animate-pulse' 
    };
  }
  // กรณีหลุดรอด (ไม่ควรเกิดขึ้น)
  return { text: status, class: 'bg-gray-100 text-gray-600' };
};

onMounted(() => {
  fetchReports();
  setInterval(fetchReports, 3000); // อัปเดตทุก 3 วินาที (เร็วขึ้น)
});
</script>

<template>
  <div class="min-h-screen bg-slate-50 p-4 md:p-8 font-sarabun">
    
    <div class="max-w-6xl mx-auto mb-8 text-center">
      <h1 class="text-3xl font-bold text-slate-800 mb-2 flex justify-center items-center gap-2">
        <AlertCircle class="text-red-500 w-8 h-8" /> แจ้งเตือนสถานะพื้นที่ไฟดับ
      </h1>
      <p class="text-slate-500">ติดตามสถานะการแก้ไขปัญหาแบบ Real-time</p>
    </div>

    <div class="max-w-6xl mx-auto">
      
      <div v-if="activeReports.length === 0" class="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100">
        <div class="flex flex-col items-center gap-3">
          <CheckCircle2 class="w-16 h-16 text-green-400" />
          <h3 class="text-xl font-bold text-slate-700">เหตุการณ์ปกติ</h3>
          <p class="text-slate-400">ไม่มีรายการแจ้งเหตุขัดข้องที่กำลังดำเนินการ</p>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="item in activeReports" :key="item.id" 
          class="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col group"
        >
          <div class="p-4 border-b border-slate-50 text-center bg-slate-50/30">
             <span :class="getStatusStyle(item.status).class" class="inline-block w-full py-3 rounded-xl text-lg font-bold border tracking-wide shadow-sm">
                {{ getStatusStyle(item.status).text }}
             </span>
          </div>

          <div class="px-6 py-5 flex-grow">
            <div class="flex items-center gap-2 text-slate-400 text-xs font-medium mb-3 bg-slate-100 w-fit px-3 py-1 rounded-full">
                <Clock class="w-3.5 h-3.5" /> {{ formatDate(item.created_at) }}
            </div>

            <h3 class="font-bold text-xl text-slate-800 mb-2 flex items-start gap-2 leading-snug">
              ⚠️ {{ item.reason || 'ไม่ระบุสาเหตุ' }}
            </h3>
            <p class="text-slate-500 text-sm">
              เจ้าหน้าที่กำลังเร่งตรวจสอบและแก้ไขในจุดนี้
            </p>
          </div>

          <div class="relative h-56 w-full bg-slate-200 border-t border-slate-100">
            <iframe 
              width="100%" 
              height="100%" 
              style="border:0" 
              loading="lazy" 
              allowfullscreen
              :src="`https://maps.google.com/maps?q=${item.latitude},${item.longitude}&z=15&output=embed`">
            </iframe>
            
            <a :href="`https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`" 
               target="_blank"
               class="absolute bottom-3 right-3 bg-white text-blue-600 px-4 py-2 rounded-lg shadow-lg text-xs font-bold flex items-center gap-1 hover:bg-blue-50 transition border border-blue-100"
            >
              <Navigation class="w-4 h-4" /> นำทาง
            </a>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

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