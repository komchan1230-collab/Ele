<template>
  <div class="min-h-screen bg-[#f8fafc] font-sarabun p-4 md:p-8">
    
    <div class="max-w-[1000px] mx-auto">
      
      <div class="flex items-center gap-4 mb-8">
        <button 
          @click="$emit('changePage', 'news')" 
          class="bg-white p-2.5 rounded-full shadow-sm border border-slate-200 hover:bg-slate-50 transition text-slate-600"
        >
          <ArrowLeft class="w-6 h-6" />
        </button>
        <div>
          <h1 class="text-2xl font-bold text-slate-800">สถิติภาพรวมไฟดับ</h1>
          <p class="text-slate-500 text-sm">ข้อมูลสรุปย้อนหลังเพื่อความโปร่งใส</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200 relative overflow-hidden">
          <div class="relative z-10">
            <p class="text-blue-100 font-medium mb-1">เคสที่แก้ไขเสร็จแล้ว</p>
            <h2 class="text-4xl font-bold">{{ totalFinished }} <span class="text-lg font-normal">เคส</span></h2>
          </div>
          <CheckCircle2 class="absolute right-[-20px] bottom-[-20px] w-32 h-32 text-white opacity-10" />
        </div>

        <div class="bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-6 text-white shadow-lg shadow-orange-200 relative overflow-hidden">
          <div class="relative z-10">
             <p class="text-orange-100 font-medium mb-1">เวลาซ่อมเฉลี่ย/เคส</p>
             <h2 class="text-4xl font-bold">{{ averageTime }} <span class="text-lg font-normal">นาที</span></h2>
          </div>
          <Timer class="absolute right-[-20px] bottom-[-20px] w-32 h-32 text-white opacity-10" />
        </div>

        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden flex flex-col justify-center">
           <p class="text-slate-400 font-medium text-sm mb-2">สาเหตุอันดับ 1</p>
           <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
             🔥 {{ topReason || '-' }}
           </h2>
           <div class="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
             <div class="bg-red-500 h-full" :style="`width: ${topReasonPercent}%`"></div>
           </div>
           <p class="text-xs text-slate-400 mt-1">คิดเป็น {{ topReasonPercent }}% ของทั้งหมด</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 class="font-bold text-slate-700 mb-6 flex items-center gap-2">
            <PieChart class="w-5 h-5 text-purple-500" /> สาเหตุที่ไฟดับบ่อยที่สุด
          </h3>
          <div class="h-[300px] flex justify-center">
            <Doughnut v-if="loaded" :data="reasonChartData" :options="chartOptions" />
          </div>
        </div>

        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 class="font-bold text-slate-700 mb-6 flex items-center gap-2">
            <BarChart3 class="w-5 h-5 text-blue-500" /> สถิติจำนวนครั้งรายเดือน
          </h3>
          <div class="h-[300px]">
            <Bar v-if="loaded" :data="monthChartData" :options="barOptions" />
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { ArrowLeft, CheckCircle2, Timer, PieChart, BarChart3 } from 'lucide-vue-next';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Doughnut, Bar } from 'vue-chartjs';

// ลงทะเบียน Component ของ Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const emit = defineEmits(['changePage']);
const rawData = ref([]);
const loaded = ref(false);

// ข้อมูลสรุป
const totalFinished = ref(0);
const averageTime = ref(0);
const topReason = ref('');
const topReasonPercent = ref(0);

// ข้อมูลกราฟ
const reasonChartData = ref({ labels: [], datasets: [] });
const monthChartData = ref({ labels: [], datasets: [] });

// Option กราฟ
const chartOptions = { responsive: true, maintainAspectRatio: false };
const barOptions = { 
  responsive: true, 
  maintainAspectRatio: false,
  scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
};

// ดึงข้อมูล
const fetchData = async () => {
  try {
    const res = await axios.get(`https://major-backend-dc3d.onrender.com/api/admin/reports?t=${Date.now()}`);
    // กรองเฉพาะงานที่เสร็จแล้ว
    const finished = res.data.filter(item => item.status === 'แก้ไขเสร็จสิ้นแล้ว');
    rawData.value = finished;
    
    processData(finished);
    loaded.value = true;
  } catch (err) { console.error(err); }
};

// ⚙️ ฟังก์ชันคำนวณข้อมูล (หัวใจหลัก)
const processData = (data) => {
  totalFinished.value = data.length;

  if (data.length === 0) return;

  // 1. คำนวณเวลาเฉลี่ย
  let totalMinutes = 0;
  let timeCount = 0;
  data.forEach(item => {
    if (item.created_at && item.updated_at) {
      const diff = new Date(item.updated_at) - new Date(item.created_at);
      if (diff > 0 && diff < 86400000) { // กรองค่า error (ต้องไม่เกิน 1 วัน)
        totalMinutes += diff;
        timeCount++;
      }
    }
  });
  averageTime.value = timeCount > 0 ? Math.round((totalMinutes / 1000 / 60) / timeCount) : 0;

  // 2. เตรียมข้อมูลกราฟสาเหตุ (Reason)
  const reasonCount = {};
  data.forEach(item => {
    const r = item.reason || 'ไม่ระบุ';
    reasonCount[r] = (reasonCount[r] || 0) + 1;
  });

  // หาสาเหตุอันดับ 1
  const sortedReason = Object.entries(reasonCount).sort((a,b) => b[1] - a[1]);
  if (sortedReason.length > 0) {
    topReason.value = sortedReason[0][0];
    topReasonPercent.value = Math.round((sortedReason[0][1] / totalFinished.value) * 100);
  }

  reasonChartData.value = {
    labels: Object.keys(reasonCount),
    datasets: [{
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
      data: Object.values(reasonCount)
    }]
  };

  // 3. เตรียมข้อมูลกราฟรายเดือน (Month)
  const monthCount = {};
  const thaiMonths = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  
  // เรียงเดือนตามจริง
  const currentYear = new Date().getFullYear();
  // สร้างโครงเดือนเปล่าๆ ไว้ก่อน
  for(let i=0; i<12; i++) monthCount[i] = 0;

  data.forEach(item => {
    const d = new Date(item.created_at);
    // นับเฉพาะปีปัจจุบัน (หรือจะเอาทุกปีก็ได้)
    if (d.getFullYear() === currentYear || d.getFullYear() === currentYear + 543) { 
        monthCount[d.getMonth()]++;
    }
  });

  monthChartData.value = {
    labels: thaiMonths,
    datasets: [{
      label: 'จำนวนครั้งไฟดับปีนี้',
      backgroundColor: '#3b82f6',
      borderRadius: 6,
      data: Object.values(monthCount)
    }]
  };
};

onMounted(() => {
  fetchData();
});
</script>