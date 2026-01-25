<template>
  <div class="min-h-screen bg-[#dfe6ff] font-sarabun text-[#1c2330]">
    
   

    <main class="w-full max-w-[1200px] mx-auto p-4 mt-4">
      
      <div class="flex items-center gap-2 mb-6">
        <BarChart3 class="w-8 h-8 text-[#2b79ff]" />
        <h2 class="text-2xl font-bold text-gray-800">Dashboard สรุปข้อมูล</h2>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div class="lg:col-span-1 bg-[#d9d9d9] p-4 rounded-lg border border-gray-300 shadow-sm">
          <h3 class="text-xs font-extrabold text-gray-600 mb-3">กราฟแสดงผลของ “เหตุไฟดับภายในเดือน”</h3>
          <div class="bg-white p-2 rounded border border-gray-300 h-[220px]">
            <canvas ref="lineChartRef"></canvas>
          </div>
        </div>

        <div class="lg:col-span-1 flex flex-col gap-4">
          <div class="bg-[#cfcfcf] p-4 rounded-lg border border-gray-300 flex justify-between items-center shadow-sm h-[100px]">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-[#bfbfbf] rounded flex items-center justify-center border border-gray-400">
                <Users class="w-5 h-5 text-gray-800" />
              </div>
              <div>
                <div class="text-xl font-black text-gray-800">0 คน</div>
                <div class="text-xs text-gray-600">เข้าสู่ระบบวันนี้</div>
              </div>
            </div>
            <button class="w-8 h-8 bg-[#bfbfbf] rounded flex items-center justify-center border border-gray-400 hover:bg-gray-400 transition">
              <ChevronRight class="w-4 h-4 text-gray-800" />
            </button>
          </div>

          <div class="bg-[#cfcfcf] p-4 rounded-lg border border-gray-300 flex justify-between items-center shadow-sm h-[100px]">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-[#bfbfbf] rounded flex items-center justify-center border border-gray-400">
                <MapPin class="w-5 h-5 text-gray-800" />
              </div>
              <div>
                <div class="text-xl font-black text-gray-800">2 เหตุ</div>
                <div class="text-xs text-gray-600">เหตุไฟดับในวันนี้</div>
              </div>
            </div>
            <button class="w-8 h-8 bg-[#bfbfbf] rounded flex items-center justify-center border border-gray-400 hover:bg-gray-400 transition">
              <ChevronRight class="w-4 h-4 text-gray-800" />
            </button>
          </div>
        </div>

        <div class="lg:col-span-1 bg-[#d9d9d9] p-4 rounded-lg border-2 border-[#2b79ff]/60 relative shadow-sm">
          <span class="absolute top-2 right-3 text-[10px] font-bold text-gray-500">รายละเอียด</span>
          <h3 class="font-bold text-gray-700 mb-4">สถิติการแจ้งเหตุไฟดับ</h3>
          
          <div class="space-y-3">
            <div class="flex justify-between items-center text-sm border-b border-dashed border-gray-400 pb-2">
              <span class="font-bold text-gray-600">เหตุไฟดับภายในเดือนนี้</span>
              <span class="font-black text-gray-900">20 เหตุ</span>
            </div>
            <div class="flex justify-between items-center text-sm border-b border-dashed border-gray-400 pb-2">
              <span class="font-bold text-gray-600">เหตุไฟดับวันนี้</span>
              <span class="font-black text-gray-900">2 เหตุ</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="font-bold text-gray-600">รวม (%)</span>
              <span class="font-black text-gray-900">10 %</span>
            </div>
          </div>
        </div>

      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div class="bg-[#d9d9d9] p-4 rounded-lg border border-gray-300 shadow-sm">
          <h3 class="text-xs font-extrabold text-gray-600 mb-3">กราฟแสดง “ปัญหาการแก้ไขปัญหาไฟดับของช่าง”</h3>
          <div class="bg-white p-2 rounded border border-gray-300 h-[220px]">
            <canvas ref="barChartRef"></canvas>
          </div>
        </div>

        <div class="bg-[#d9d9d9] p-4 rounded-lg border border-gray-300 shadow-sm">
          <h3 class="text-xs font-extrabold text-gray-600 mb-3">กราฟแสดง “ช่วงเวลาที่เกิดเหตุสุดบ่อย”</h3>
          <div class="bg-white p-2 rounded border border-gray-300 h-[220px]">
            <canvas ref="areaChartRef"></canvas>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { 
  User, TriangleAlert, Megaphone, MapPin, MessageCircleMore,
  BarChart3, Users, ChevronRight 
} from 'lucide-vue-next';
import Chart from 'chart.js/auto';
import axios from 'axios';

const emit = defineEmits(['changePage']);

// Ref สำหรับ Canvas และ Chart Instance
const lineChartRef = ref(null);
const barChartRef = ref(null);
const areaChartRef = ref(null);
let charts = []; // เก็บตัวแปร Chart ไว้ทำลายเมื่อออกจากหน้า

// ตัวแปรเก็บข้อมูลจาก MySQL
const adminReports = ref([]);
const stats = ref({ totalMonth: 0, today: 0, percent: 0 });
let timer = null;

// ฟังก์ชันดึงข้อมูลจาก Backend แบบเรียลไทม์
const fetchAdminData = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/admin/reports');
    adminReports.value = response.data;
    
    // คำนวณสถิติเบื้องต้น (ตัวอย่าง)
    stats.value.totalMonth = adminReports.value.length;
    stats.value.today = adminReports.value.filter(r => 
      new Date(r.created_at).toDateString() === new Date().toDateString()
    ).length;
    
    // อัปเดตกราฟด้วยข้อมูลจริงที่นี่ (ถ้าต้องการให้กราฟขยับตาม)
  } catch (error) {
    console.error("ดึงข้อมูลแอดมินไม่สำเร็จ:", error);
  }
};

onMounted(() => {
  fetchAdminData();
  // ตั้งเวลาดึงข้อมูลใหม่ทุก 10 วินาที
  timer = setInterval(fetchAdminData, 10000);

  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, ticks: { stepSize: 1 } }
    }
  };

  // 1. Line Chart (สถิติเหตุไฟดับภายในเดือน)
  charts.push(new Chart(lineChartRef.value, {
    type: "line",
    data: {
      labels: ["สัปดาห์ที่ 1","สัปดาห์ที่ 2","สัปดาห์ที่ 3","สัปดาห์ที่ 4"],
      datasets: [{
        label: "เหตุการณ์",
        data: [4, 3, 5, 4], // อนาคตสามารถเขียน Logic นับจาก adminReports ได้
        borderWidth: 3,
        borderColor: '#2b79ff',
        backgroundColor: '#2b79ff',
        tension: 0.35
      }]
    },
    options: { ...baseOptions, plugins: { legend: { display:false } } }
  }));

  // 2. Bar Chart (ปัญหาการแก้ไขของช่างแยกตามประเภท)
  charts.push(new Chart(barChartRef.value, {
    type: "bar",
    data: {
      labels: ["สัปดาห์ที่ 1","สัปดาห์ที่ 2","สัปดาห์ที่ 3","สัปดาห์ที่ 4"],
      datasets: [
        { label:"รอดำเนินการ", data:[3,2,3,3], backgroundColor:'#ff6384' },
        { label:"กำลังซ่อม", data:[2,2,2,2], backgroundColor:'#36a2eb' },
        { label:"เสร็จแล้ว", data:[0,1,0,0], backgroundColor:'#cc65fe' }
      ]
    },
    options: {
      ...baseOptions,
      scales: { x: { stacked:true }, y: { stacked:true, beginAtZero:true } }
    }
  }));

  // 3. Area Chart (ช่วงเวลาที่เกิดเหตุบ่อย)
  charts.push(new Chart(areaChartRef.value, {
    type: "line",
    data: {
      labels: ["00:00","06:00","12:00","18:00"],
      datasets: [
        { label:"เช้า-บ่าย", data:[2,1,3,2], fill:true, backgroundColor:'rgba(255, 99, 132, 0.2)', borderColor:'rgb(255, 99, 132)' },
        { label:"เย็น-ค่ำ", data:[1,2,2,3], fill:true, backgroundColor:'rgba(54, 162, 235, 0.2)', borderColor:'rgb(54, 162, 235)' }
      ]
    },
    options: baseOptions
  }));
});

// ล้าง Timer และ Chart เมื่อออกจากหน้า
onUnmounted(() => {
  clearInterval(timer);
  charts.forEach(chart => chart.destroy());
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600;800&display=swap');
.font-sarabun { font-family: 'Sarabun', sans-serif; }

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
</style>