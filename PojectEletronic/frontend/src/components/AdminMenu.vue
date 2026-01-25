<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import { 
  TriangleAlert, MapPin, ChevronRight, BarChart3, 
  User as UserIcon, Phone, Clock, Trash2, X, ExternalLink
} from 'lucide-vue-next';

const emit = defineEmits(['changePage']);
const adminReports = ref([]); 
const selectedReport = ref(null); // เก็บข้อมูลรายการที่เลือกดูรายละเอียด
const isModalOpen = ref(false);
let timer = null;

// ดึงข้อมูลจาก API
const fetchAdminData = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/admin/reports');
    adminReports.value = response.data;
  } catch (error) {
    console.error("ดึงข้อมูลไม่สำเร็จ:", error);
  }
};

// ฟังก์ชันเปิด Modal รายละเอียด
const openDetails = (report) => {
  selectedReport.value = report;
  isModalOpen.value = true;
};

const closeDetails = () => {
  isModalOpen.value = false;
  selectedReport.value = null;
};

// ฟังก์ชันลบรายการ
const deleteReport = async (id) => {
  if (confirm('คุณต้องการลบรายการแจ้งเหตุนี้ใช่หรือไม่?')) {
    try {
      await axios.delete(`http://localhost:3000/api/admin/reports/${id}`);
      alert('ลบข้อมูลสำเร็จ');
      fetchAdminData();
    } catch (error) {
      alert('ไม่สามารถลบข้อมูลได้');
    }
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const dateObj = new Date(dateStr);
  const monthsShort = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  const year = dateObj.getFullYear() + 543;
  return `${dateObj.getDate()} ${monthsShort[dateObj.getMonth()]} ${year}`;
};

onMounted(() => {
  fetchAdminData();
  timer = setInterval(fetchAdminData, 10000); 
});

onUnmounted(() => clearInterval(timer));
</script>

<template>
  <div class="min-h-screen bg-[#eef2f9] p-6 font-sarabun text-[#333]">
    
    <div class="max-w-[1000px] mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
      <div class="flex items-center gap-3">
        <div class="bg-blue-600 p-2 rounded-lg shadow-lg">
          <UserIcon class="w-6 h-6 text-white" />
        </div>
        <h2 class="text-2xl font-bold text-gray-800">จัดการรายการแจ้งเหตุ</h2>
      </div>
      <button @click="$emit('changePage', 'dashboard')" class="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition">
        <BarChart3 class="w-5 h-5" /> ดูสถิติ Dashboard
      </button>
    </div>

    <div class="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="item in adminReports" :key="item.id" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition">
        <div class="bg-gray-50 px-5 py-3 border-b border-gray-100 flex justify-between items-center text-gray-500">
          <div class="flex items-center gap-2">
            <Clock class="w-4 h-4" />
            <span class="text-xs font-bold">{{ formatDate(item.created_at) }}</span>
            <span class="text-xs">({{ new Date(item.created_at).toLocaleTimeString('th-TH') }} น.)</span>
          </div>
          <button @click="deleteReport(item.id)" class="text-red-400 hover:text-red-600 transition">
            <Trash2 class="w-4 h-4" />
          </button>
        </div>

        <div class="p-5 flex-grow">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="font-bold text-blue-700 text-lg flex items-center gap-2">
                <MapPin class="w-4 h-4" /> {{ item.reporter_name }}
              </h3>
              <p class="text-xs text-gray-400">จ.นนทบุรี</p>
            </div>
            <div class="flex items-center gap-1 text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs font-medium">
              <Phone class="w-3 h-3" /> {{ item.phone }}
            </div>
          </div>
          <div class="bg-blue-50/50 p-4 rounded-xl border-l-4 border-blue-300 italic text-sm text-gray-700 leading-relaxed">
            "{{ item.details || 'ไม่มีรายละเอียดเพิ่มเติม' }}"
          </div>
        </div>

        <div class="px-5 py-4 bg-gray-50/50 flex justify-between items-center">
          <span :class="{
            'bg-yellow-100 text-yellow-700 border-yellow-200': item.status === 'รอดำเนินการ' || item.status === 'pending',
            'bg-blue-100 text-blue-700 border-blue-200': item.status === 'กำลังดำเนินการ',
            'bg-green-100 text-green-700 border-green-200': item.status === 'เสร็จสิ้น'
          }" class="px-3 py-1 rounded-full text-xs font-bold border">
            {{ item.status === 'pending' ? 'รอดำเนินการ' : item.status }}
          </span>
          <button @click="openDetails(item)" class="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center gap-1 transition-colors">
            รายละเอียด <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <div v-if="isModalOpen && selectedReport" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div class="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl scale-in">
        
        <div class="p-6 border-b flex justify-between items-center bg-gray-50">
          <h2 class="text-xl font-bold flex items-center gap-2">
            <TriangleAlert class="text-yellow-500" /> ข้อมูลการแจ้งเหตุพิกัด
          </h2>
          <button @click="closeDetails" class="p-2 hover:bg-gray-200 rounded-full transition">
            <X class="w-6 h-6" />
          </button>
        </div>

        <div class="p-8 overflow-y-auto space-y-6">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div><p class="text-gray-400">ผู้แจ้งเหตุ</p><p class="font-bold text-lg text-blue-700">{{ selectedReport.reporter_name }}</p></div>
            <div><p class="text-gray-400">เบอร์โทรศัพท์</p><p class="font-bold text-lg text-gray-800">{{ selectedReport.phone }}</p></div>
          </div>

          <div class="p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <p class="text-gray-400 text-xs mb-1 font-bold uppercase tracking-wider">รายละเอียดปัญหา</p>
            <p class="text-gray-700 leading-relaxed">{{ selectedReport.details }}</p>
          </div>

          <div class="space-y-3">
            <p class="font-bold flex items-center gap-2 text-gray-800">
              <MapPin class="w-4 h-4 text-red-500" /> ตำแหน่งที่แจ้งปัญหา
            </p>
            <a 
              :href="`https://www.google.com/maps?q=${selectedReport.latitude},${selectedReport.longitude}`" 
              target="_blank"
              class="flex items-center justify-between w-full p-4 bg-blue-50 text-blue-700 rounded-2xl hover:bg-blue-100 transition border border-blue-200"
            >
              <span class="font-semibold" v-if="selectedReport.latitude && selectedReport.longitude">
                ดูพิกัดบน Google Maps ({{ Number(selectedReport.latitude).toFixed(6) }}, {{ Number(selectedReport.longitude).toFixed(6) }})
              </span>
              <span v-else>ไม่มีข้อมูลพิกัดในขณะนี้</span>
              <ExternalLink class="w-5 h-5" />
            </a>
          </div>

          <div v-if="selectedReport.images" class="space-y-3">
            <p class="font-bold text-gray-800">รูปภาพหลักฐาน</p>
            <div class="grid grid-cols-2 gap-3">
              <img 
                v-for="(img, idx) in selectedReport.images.split(',')" 
                :key="idx"
                :src="`http://localhost:3000/uploads/${img}`" 
                class="w-full h-44 object-cover rounded-2xl border shadow-sm hover:scale-[1.02] transition cursor-zoom-in"
                @error="(e) => e.target.src = 'https://placehold.co/400x300?text=No+Image'"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>