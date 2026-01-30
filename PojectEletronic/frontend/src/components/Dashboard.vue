<template>
  <div class="min-h-screen bg-[#f1f5f9] p-6 font-sarabun text-[#333]">
    
    <div class="max-w-7xl mx-auto mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-slate-800 flex items-center gap-2">
          <LayoutDashboard class="w-8 h-8 text-blue-600" /> Executive Dashboard
        </h1>
        <p class="text-slate-500">ภาพรวมสถานการณ์และการปฏิบัติงานของทีมช่าง</p>
      </div>
      <button 
        @click="$emit('changePage', 'admin-menu')"
        class="bg-white text-slate-600 border border-slate-300 px-4 py-2 rounded-lg font-bold shadow-sm hover:bg-slate-50 transition flex items-center gap-2"
      >
        <ArrowLeft class="w-4 h-4" /> กลับหน้ารายการ
      </button>
    </div>

    <div class="max-w-7xl mx-auto space-y-8">
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div class="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-yellow-400 relative overflow-hidden group hover:shadow-md transition">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">งานรอตรวจสอบ (Pending)</p>
              <h3 class="text-4xl font-bold text-slate-800">{{ stats.pending }}</h3>
            </div>
            <div class="p-3 bg-yellow-50 text-yellow-500 rounded-xl group-hover:bg-yellow-100 transition"><AlertCircle class="w-6 h-6" /></div>
          </div>
          <p class="text-xs text-slate-400 mt-4">ต้องรีบกดรับเรื่อง!</p>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-500 relative overflow-hidden group hover:shadow-md transition">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">กำลังซ่อม (Active)</p>
              <h3 class="text-4xl font-bold text-slate-800">{{ stats.active }}</h3>
            </div>
            <div class="p-3 bg-blue-50 text-blue-500 rounded-xl group-hover:bg-blue-100 transition"><HardHat class="w-6 h-6" /></div>
          </div>
          <div class="absolute bottom-0 left-0 h-1 bg-blue-100 w-full overflow-hidden">
             <div class="h-full bg-blue-500 animate-progress w-2/3"></div>
          </div>
          <p class="text-xs text-slate-400 mt-4">ทีมช่างกำลังปฏิบัติงาน</p>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-green-500 relative overflow-hidden group hover:shadow-md transition">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">แก้ไขเสร็จ (Finished)</p>
              <h3 class="text-4xl font-bold text-slate-800">{{ stats.finished }}</h3>
            </div>
            <div class="p-3 bg-green-50 text-green-500 rounded-xl group-hover:bg-green-100 transition"><CheckCircle2 class="w-6 h-6" /></div>
          </div>
          <p class="text-xs text-green-600 font-bold mt-4 flex items-center gap-1">
             <TrendingUp class="w-3 h-3" /> ประสิทธิภาพยอดเยี่ยม
          </p>
        </div>

        <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
          <div class="relative z-10">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">เวลาปิดงานเฉลี่ย</p>
            <h3 class="text-3xl font-bold">{{ stats.avgTime }} <span class="text-base font-normal text-slate-400">นาที/เคส</span></h3>
            <p class="text-xs text-slate-400 mt-4 opacity-80">คำนวณจากงานที่เสร็จสิ้น</p>
          </div>
          <Timer class="absolute right-[-10px] bottom-[-10px] w-24 h-24 text-white opacity-5" />
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[400px]">
        
        <div class="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <h3 class="font-bold text-slate-700 mb-6 flex items-center gap-2">
            <Activity class="w-5 h-5 text-blue-500" /> ปริมาณการแจ้งเหตุ (7 วันล่าสุด)
          </h3>
          <div class="flex-grow relative">
             <Line v-if="loaded" :data="lineChartData" :options="lineOptions" />
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <h3 class="font-bold text-slate-700 mb-6 flex items-center gap-2">
            <PieChart class="w-5 h-5 text-orange-500" /> สัดส่วนสาเหตุปัญหา
          </h3>
          <div class="flex-grow relative flex justify-center items-center">
             <Doughnut v-if="loaded" :data="doughnutChartData" :options="doughnutOptions" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="p-6 border-b border-slate-50 flex justify-between items-center">
          <h3 class="font-bold text-slate-700 flex items-center gap-2">
            <MapPin class="w-5 h-5 text-red-500" /> 5 อันดับ พื้นที่ที่แจ้งเหตุบ่อยที่สุด
          </h3>
          <span class="text-xs bg-red-50 text-red-500 px-2 py-1 rounded font-bold">Hotspots</span>
        </div>
        
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <th class="p-4 font-bold">อันดับ</th>
              <th class="p-4 font-bold w-full">ชื่อสถานที่ / ถนน</th>
              <th class="p-4 font-bold text-right">จำนวนครั้ง</th>
              <th class="p-4 font-bold text-center">ความถี่</th>
            </tr>
          </thead>
          <tbody class="text-sm">
            <tr v-for="(area, idx) in topAreas" :key="idx" class="border-b border-slate-50 hover:bg-slate-50/50 transition">
              <td class="p-4">
                <span 
                  class="w-6 h-6 flex items-center justify-center rounded-full font-bold text-xs"
                  :class="idx === 0 ? 'bg-yellow-100 text-yellow-700' : (idx === 1 ? 'bg-slate-200 text-slate-600' : (idx === 2 ? 'bg-orange-100 text-orange-700' : 'text-slate-400'))"
                >
                  {{ idx + 1 }}
                </span>
              </td>
              <td class="p-4 font-bold text-slate-700">{{ area.name }}</td>
              <td class="p-4 text-right font-mono font-bold text-slate-600">{{ area.count }}</td>
              <td class="p-4">
                <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div class="h-full bg-red-500 rounded-full" :style="`width: ${(area.count / maxAreaCount) * 100}%`"></div>
                </div>
              </td>
            </tr>
            <tr v-if="topAreas.length === 0">
              <td colspan="4" class="p-8 text-center text-slate-400">ยังไม่มีข้อมูลเพียงพอสำหรับการจัดอันดับ</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { 
  LayoutDashboard, ArrowLeft, AlertCircle, HardHat, CheckCircle2, 
  TrendingUp, Timer, Activity, PieChart, MapPin 
} from 'lucide-vue-next';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Doughnut } from 'vue-chartjs';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const stats = ref({ pending: 0, active: 0, finished: 0, avgTime: 0 });
const topAreas = ref([]);
const maxAreaCount = ref(1);
const loaded = ref(false);

// Chart Data Config
const lineChartData = ref({ labels: [], datasets: [] });
const doughnutChartData = ref({ labels: [], datasets: [] });

const lineOptions = { responsive: true, maintainAspectRatio: false, tension: 0.4 };
const doughnutOptions = { responsive: true, maintainAspectRatio: false };

const fetchData = async () => {
  try {
    const res = await axios.get(`https://major-backend-dc3d.onrender.com/api/admin/reports?t=${Date.now()}`);
    const data = res.data;
    calculateStats(data);
    prepareCharts(data);
    findTopAreas(data);
    loaded.value = true;
  } catch (err) { console.error(err); }
};

const calculateStats = (data) => {
  stats.value.pending = data.filter(d => d.status === 'รอดำเนินการ').length;
  stats.value.active = data.filter(d => ['แจ้งเจ้าหน้าที่แล้ว', 'เจ้าหน้าที่รับเรื่องแล้ว'].includes(d.status)).length;
  
  const finishedTasks = data.filter(d => d.status === 'แก้ไขเสร็จสิ้นแล้ว');
  stats.value.finished = finishedTasks.length;

  // คำนวณเวลาเฉลี่ย
  let totalMin = 0;
  let count = 0;
  finishedTasks.forEach(task => {
    if (task.created_at && task.updated_at) {
      const diff = new Date(task.updated_at) - new Date(task.created_at);
      if (diff > 0 && diff < 86400000) { // กรอง error
         totalMin += diff;
         count++;
      }
    }
  });
  stats.value.avgTime = count > 0 ? Math.round((totalMin / 1000 / 60) / count) : 0;
};

const prepareCharts = (data) => {
  // 1. Line Chart (7 วันย้อนหลัง)
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const dailyCounts = last7Days.map(date => 
    data.filter(d => d.created_at && d.created_at.startsWith(date)).length
  );

  lineChartData.value = {
    labels: last7Days.map(d => {
       const date = new Date(d);
       return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
    }),
    datasets: [{
      label: 'จำนวนแจ้งเหตุ',
      backgroundColor: '#3b82f6',
      borderColor: '#3b82f6',
      data: dailyCounts,
      fill: true
    }]
  };

  // 2. Doughnut Chart (สาเหตุ)
  const reasons = {};
  data.forEach(d => {
    const r = d.reason || 'ไม่ระบุ';
    reasons[r] = (reasons[r] || 0) + 1;
  });

  doughnutChartData.value = {
    labels: Object.keys(reasons),
    datasets: [{
      backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#6366f1', '#8b5cf6', '#ec4899'],
      data: Object.values(reasons)
    }]
  };
};

const findTopAreas = (data) => {
  const areas = {};
  data.forEach(d => {
    // เอาชื่อถนน หรือตำบล มาจัดกลุ่ม (ตัดคำว่า 'ต.' 'อ.' ออกเพื่อให้กลุ่มใหญ่ขึ้น)
    let loc = d.location_name || 'ไม่ระบุพิกัด';
    // Logic ง่ายๆ: ตัดให้เหลือแค่ช่วงแรกๆ เพื่อจับกลุ่ม (เช่น ซอย.. ถนน..)
    // หรือจะใช้ชื่อเต็มเลยก็ได้ถ้าข้อมูลแม่นยำ
    areas[loc] = (areas[loc] || 0) + 1;
  });

  // Sort & Top 5
  const sorted = Object.entries(areas)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  topAreas.value = sorted;
  if (sorted.length > 0) maxAreaCount.value = sorted[0].count;
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
@keyframes progress { from { width: 0; } to { width: 66%; } }
.animate-progress { animation: progress 1.5s ease-out forwards; }
</style>