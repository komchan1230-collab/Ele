<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import { 
  TriangleAlert, MapPin, ChevronRight, BarChart3, 
  User as UserIcon, Phone, Clock, Trash2, X, Send, CheckCircle, ExternalLink
} from 'lucide-vue-next';

const emit = defineEmits(['changePage']);
const adminReports = ref([]); 
const selectedReport = ref(null); 
const isModalOpen = ref(false);
let timer = null;

// 1. ฟังก์ชันดึงข้อมูลจาก Backend
const fetchAdminData = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/admin/reports');
    adminReports.value = response.data;
  } catch (error) {
    console.error("ดึงข้อมูลไม่สำเร็จ:", error);
  }
};

// 2. ฟังก์ชันแจ้งเจ้าหน้าที่ผ่าน LINE Messaging API (ปุ่มที่ 1)
const notifyOfficer = async (report) => {
  // จัดรูปแบบข้อความแจ้งเหตุ
  const message = 
    `📢 แจ้งเหตุไฟดับใหม่!\n` +
    `👤 ผู้แจ้ง: ${report.reporter_name}\n` +
    `📞 เบอร์โทร: ${report.phone}\n` +
    `⚠️ สาเหตุ: ${report.reason || 'ไม่ระบุ'}\n` +
    `📍 พิกัด: https://www.google.com/maps?q=${report.latitude},${report.longitude}`;

  try {
    // ส่งข้อความไปที่ API /line-send ใน server.js
    const response = await axios.post('http://localhost:3000/api/admin/line-send', { message });
    if (response.data.success) {
      alert("✅ ส่งข้อมูลเข้ากลุ่ม LINE เจ้าหน้าที่เรียบร้อยแล้ว!");
    }
  } catch (error) {
    // แจ้งเตือนหาก Token หรือ Group ID ใน server.js ยังไม่ถูกต้อง
    alert("❌ ส่ง LINE ไม่สำเร็จ กรุณาเช็ค Token หรือ Group ID ใน server.js");
  }
};

// 3. ฟังก์ชันอัปเดตสถานะงาน (ปุ่มที่ 2 และ 3)
const updateStatus = async (id, newStatus) => {
  try {
    await axios.patch(`http://localhost:3000/api/admin/reports/${id}`, { 
      status: newStatus 
    });
    fetchAdminData(); // โหลดข้อมูลใหม่เพื่อแสดงสีสถานะล่าสุด
  } catch (error) {
    alert("ไม่สามารถเปลี่ยนสถานะได้");
  }
};

const openDetails = (report) => { selectedReport.value = report; isModalOpen.value = true; };
const closeDetails = () => { isModalOpen.value = false; selectedReport.value = null; };

const deleteReport = async (id) => {
  if (confirm('คุณต้องการลบรายการนี้ใช่หรือไม่?')) {
    try {
      await axios.delete(`http://localhost:3000/api/admin/reports/${id}`);
      fetchAdminData();
    } catch (error) { alert('ลบไม่สำเร็จ'); }
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const dateObj = new Date(dateStr);
  const monthsShort = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  return `${dateObj.getDate()} ${monthsShort[dateObj.getMonth()]} ${dateObj.getFullYear() + 543}`;
};

onMounted(() => { 
  fetchAdminData(); 
  timer = setInterval(fetchAdminData, 10000); // อัปเดตข้อมูลทุก 10 วินาที
});

onUnmounted(() => clearInterval(timer));
</script>

<template>
  <div class="min-h-screen bg-[#eef2f9] p-6 font-sarabun text-[#333]">
    <div class="max-w-[1000px] mx-auto mb-8 flex justify-between items-center">
      <div class="flex items-center gap-3">
        <div class="bg-blue-600 p-2 rounded-lg shadow-lg"><UserIcon class="w-6 h-6 text-white" /></div>
        <h2 class="text-2xl font-bold text-gray-800">จัดการรายการแจ้งเหตุ</h2>
      </div>
      <button @click="$emit('changePage', 'dashboard')" class="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition">
        <BarChart3 class="w-5 h-5 inline mr-1" /> Dashboard
      </button>
    </div>

    <div class="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="item in adminReports" :key="item.id" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition">
        
        <div class="bg-gray-50 px-5 py-3 border-b border-gray-100 flex justify-between items-center text-gray-500">
          <span class="text-xs font-bold"><Clock class="w-4 h-4 inline mr-1" /> {{ formatDate(item.created_at) }}</span>
          <button @click="deleteReport(item.id)" class="text-red-400 hover:text-red-600 transition p-1"><Trash2 class="w-4 h-4" /></button>
        </div>

        <div class="p-5 flex-grow">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="font-bold text-blue-700 text-lg flex items-center gap-1"><MapPin class="w-4 h-4" /> {{ item.reporter_name }}</h3>
              <p class="text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100 mt-1 inline-block">
                สาเหตุ: {{ item.reason || 'ไม่ระบุ' }}
              </p>
            </div>
            <div class="text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs font-medium">{{ item.phone }}</div>
          </div>
          <div class="bg-blue-50/50 p-4 rounded-xl border-l-4 border-blue-300 italic text-sm text-gray-700">"{{ item.details || '-' }}"</div>
        </div>

        <div class="px-5 py-4 bg-gray-50/50 border-t border-gray-100 flex flex-col gap-3">
          <div class="flex justify-between items-center">
            <span :class="{
              'bg-yellow-100 text-yellow-700 border-yellow-200': item.status === 'pending' || item.status === 'รอดำเนินการ',
              'bg-blue-100 text-blue-700 border-blue-200': item.status === 'แจ้งเจ้าหน้าที่แล้ว',
              'bg-green-100 text-green-700 border-green-200': item.status === 'แก้ไขเสร็จสิ้นแล้ว'
            }" class="px-3 py-1 rounded-full text-[10px] font-bold border uppercase">
              {{ item.status === 'pending' ? 'รอดำเนินการ' : item.status }}
            </span>
            <button @click="openDetails(item)" class="text-blue-600 hover:text-blue-800 text-xs font-bold flex items-center gap-1 transition">รายละเอียด <ChevronRight class="w-4 h-4" /></button>
          </div>

          <div class="flex flex-col gap-2">
            <div v-if="item.status === 'pending' || item.status === 'รอดำเนินการ'" class="flex gap-2">
              <button @click="notifyOfficer(item)" class="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-bold py-2 rounded-lg flex items-center justify-center gap-1 shadow-sm transition">
                <Send class="w-3 h-3" /> 1. แจ้งเจ้าหน้าที่ (LINE)
              </button>
              <button @click="updateStatus(item.id, 'แจ้งเจ้าหน้าที่แล้ว')" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold py-2 rounded-lg shadow-sm transition">
                2. เจ้าหน้าที่รับเรื่อง
              </button>
            </div>

            <button 
              v-else-if="item.status === 'แจ้งเจ้าหน้าที่แล้ว'"
              @click="updateStatus(item.id, 'แก้ไขเสร็จสิ้นแล้ว')"
              class="w-full bg-green-600 hover:bg-green-700 text-white text-[11px] font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-lg transition"
            >
              <CheckCircle class="w-4 h-4" /> 3. เจ้าหน้าที่แก้ไขเสร็จสิ้น
            </button>

            <div v-else class="text-center py-1 text-green-600 text-[11px] font-bold flex items-center justify-center gap-1 bg-green-50 rounded-lg border border-green-100">
              <CheckCircle class="w-4 h-4" /> ดำเนินการแก้ไขเรียบร้อยแล้ว
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isModalOpen && selectedReport" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div class="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div class="p-6 border-b flex justify-between items-center bg-gray-50">
          <h2 class="text-xl font-bold flex items-center gap-2 text-gray-800"><TriangleAlert class="text-yellow-500" /> ข้อมูลโดยละเอียด</h2>
          <button @click="closeDetails" class="p-2 hover:bg-gray-200 rounded-full transition"><X class="w-6 h-6" /></button>
        </div>
        <div class="p-8 overflow-y-auto space-y-6">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div><p class="text-gray-400">ผู้แจ้ง</p><p class="font-bold text-blue-700 text-lg uppercase">{{ selectedReport.reporter_name }}</p></div>
            <div><p class="text-gray-400">เบอร์โทร</p><p class="font-bold text-lg text-gray-800">{{ selectedReport.phone }}</p></div>
          </div>
          <div class="p-4 bg-orange-50 rounded-2xl border border-orange-100">
            <p class="text-orange-400 text-[10px] font-bold uppercase tracking-wider">สาเหตุที่ได้รับแจ้ง</p>
            <p class="text-orange-700 font-bold text-lg">{{ selectedReport.reason || 'ไม่ระบุ' }}</p>
          </div>
          <div v-if="selectedReport.images" class="space-y-3">
            <p class="font-bold text-gray-800">รูปภาพหลักฐาน ({{ selectedReport.images.split(',').length }} รูป)</p>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <img 
                v-for="(img, idx) in selectedReport.images.split(',')" :key="idx" 
                :src="`http://localhost:3000/uploads/${img.trim()}`" 
                class="w-full h-32 object-cover rounded-2xl border border-gray-200 shadow-sm hover:brightness-95 transition cursor-zoom-in" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>