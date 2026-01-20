<template>
  <div class="min-h-screen bg-[#dfe6ff] font-sarabun text-[#1c2330]">
    
    <header class="bg-[#87CEEB] px-5 py-4 flex justify-between items-center text-black shadow-sm">
      <h1 
        class="text-lg font-bold m-0 cursor-pointer hover:opacity-70 transition-opacity" 
        @click="$emit('changePage', 'home')"
        title="กลับหน้าหลัก"
      >
        แจ้งปัญหาไฟดับ (ในชุมชนเมเจอร์ปากเกร็ด)
      </h1>
      <div class="cursor-pointer hover:opacity-70 transition" @click="$emit('changePage', 'profile')">
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
      <div class="nav-item cursor-pointer group" @click="$emit('changePage', 'status')">
        <MapPin class="icon-nav group-hover:scale-110 transition-transform" /> 
        <span>แจ้งเตือนสถานะพื้นที่</span>
      </div>
      <div class="nav-item cursor-pointer group" @click="$emit('changePage', 'contact')">
        <MessageCircleMore class="icon-nav group-hover:scale-110 transition-transform" /> 
        <span>ติดต่อเรา</span>
      </div>
    </nav>

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
import { ref, onMounted } from 'vue';
import { 
  User, TriangleAlert, Megaphone, MapPin, MessageCircleMore,
  BarChart3, Users, ChevronRight 
} from 'lucide-vue-next';
import Chart from 'chart.js/auto'; // อย่าลืม npm install chart.js

const emit = defineEmits(['changePage']);

// Ref สำหรับ Canvas
const lineChartRef = ref(null);
const barChartRef = ref(null);
const areaChartRef = ref(null);

onMounted(() => {
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, ticks: { stepSize: 1 } }
    }
  };

  // 1. Line Chart
  new Chart(lineChartRef.value, {
    type: "line",
    data: {
      labels: ["สัปดาห์ที่ 1","สัปดาห์ที่ 2","สัปดาห์ที่ 3","สัปดาห์ที่ 4"],
      datasets: [{
        label: "เหตุการณ์",
        data: [4,3,5,4],
        borderWidth: 3,
        pointRadius: 3,
        tension: 0.35,
        borderColor: '#2b79ff',
        backgroundColor: '#2b79ff'
      }]
    },
    options: {
      ...baseOptions,
      plugins: { legend: { display:false } }
    }
  });

  // 2. Bar Chart (Stacked)
  new Chart(barChartRef.value, {
    type: "bar",
    data: {
      labels: ["สัปดาห์ที่ 1","สัปดาห์ที่ 2","สัปดาห์ที่ 3","สัปดาห์ที่ 4"],
      datasets: [
        { label:"ประเภท 1", data:[3,2,3,3], backgroundColor:'#ff6384' },
        { label:"ประเภท 2", data:[2,2,2,2], backgroundColor:'#36a2eb' },
        { label:"ประเภท 3", data:[0,1,0,0], backgroundColor:'#cc65fe' }
      ]
    },
    options: {
      ...baseOptions,
      scales: {
        x: { stacked:true, grid:{ display:false } },
        y: { stacked:true, beginAtZero:true, ticks:{ stepSize:1 } }
      },
      plugins: { legend: { position:"top" } }
    }
  });

  // 3. Area Chart
  new Chart(areaChartRef.value, {
    type: "line",
    data: {
      labels: ["สัปดาห์ที่ 1","สัปดาห์ที่ 2","สัปดาห์ที่ 3","สัปดาห์ที่ 4"],
      datasets: [
        { label:"ช่วง 1", data:[2,1,3,2], fill:true, tension:0.35, backgroundColor:'rgba(255, 99, 132, 0.2)', borderColor:'rgb(255, 99, 132)' },
        { label:"ช่วง 2", data:[1,2,2,3], fill:true, tension:0.35, backgroundColor:'rgba(54, 162, 235, 0.2)', borderColor:'rgb(54, 162, 235)' }
      ]
    },
    options: {
      ...baseOptions,
      plugins: { legend: { position:"top" } }
    }
  });
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