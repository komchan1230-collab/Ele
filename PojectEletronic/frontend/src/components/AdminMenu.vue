<template>
  <div class="min-h-screen bg-[#eef2f9] p-6 font-sarabun text-[#333]">
    <div class="max-w-[1000px] mx-auto mb-8 flex justify-between items-center">
      <div class="flex items-center gap-3">
        <div class="bg-blue-600 p-2 rounded-lg shadow-lg"><UserIcon class="w-6 h-6 text-white" /></div>
        <h2 class="text-2xl font-bold text-gray-800">จัดการรายการแจ้งเหตุ</h2>
      </div>
      <button @click="$emit('changePage', 'dashboard')" class="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition shadow-md">
        <BarChart3 class="w-5 h-5 inline mr-1" /> Dashboard
      </button>
    </div>

    <div class="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="item in adminReports" :key="item.id" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition duration-200">
        
        <div class="bg-gray-50 px-5 py-3 border-b border-gray-100 flex justify-between items-center text-gray-500">
          <span class="text-xs font-bold bg-white border border-gray-200 px-2 py-1 rounded-md shadow-sm">
            <Clock class="w-3 h-3 inline mr-1 text-blue-500" /> {{ formatDate(item.created_at) }}
          </span>
          <button @click="deleteReport(item.id)" class="text-gray-400 hover:text-red-500 transition p-1 rounded-full hover:bg-red-50"><Trash2 class="w-4 h-4" /></button>
        </div>

        <div class="p-5 flex-grow">
          <div class="flex justify-between items-start mb-3">
            <div class="w-full">
              
              <h3 class="font-bold text-blue-800 text-lg flex items-start gap-2 leading-snug">
                <MapPin class="w-5 h-5 text-red-500 mt-1 flex-shrink-0" /> 
                {{ item.location_name || item.reporter_name }}
              </h3>
              
              <p class="text-xs text-gray-500 ml-7 mt-1 font-medium">
                <UserIcon class="w-3 h-3 inline" /> ผู้แจ้ง: {{ item.reporter_name }}
              </p>

              <div class="mt-3 ml-7">
                <span class="text-[11px] font-bold text-orange-700 bg-orange-50 px-2 py-1 rounded border border-orange-100 inline-block">
                  ⚠️ {{ item.reason || 'ไม่ระบุ' }}
                </span>
                <span class="ml-2 text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded border border-gray-200 inline-block">
                  📞 {{ item.phone }}
                </span>
              </div>
            </div>
          </div>

          <div v-if="item.details" class="ml-7 bg-blue-50/50 p-3 rounded-xl border-l-4 border-blue-300 italic text-sm text-gray-600 mt-2">
            "{{ item.details }}"
          </div>
          <div v-else class="ml-7 text-gray-300 text-xs italic mt-2">- ไม่มีรายละเอียดเพิ่มเติม -</div>
        </div>

        <div class="px-5 py-4 bg-gray-50/50 border-t border-gray-100 flex flex-col gap-3">
          <div class="flex justify-between items-center">
            <span :class="{
              'bg-yellow-100 text-yellow-700 border-yellow-200': item.status === 'รอดำเนินการ',
              'bg-orange-100 text-orange-700 border-orange-200 animate-pulse': item.status === 'แจ้งเจ้าหน้าที่แล้ว',
              'bg-blue-100 text-blue-700 border-blue-200': item.status === 'เจ้าหน้าที่รับเรื่องแล้ว',
              'bg-green-100 text-green-700 border-green-200': item.status === 'แก้ไขเสร็จสิ้นแล้ว'
            }" class="px-3 py-1 rounded-full text-[10px] font-bold border uppercase flex items-center gap-1 shadow-sm">
               <div :class="{
                 'bg-yellow-500': item.status === 'รอดำเนินการ',
                 'bg-orange-500': item.status === 'แจ้งเจ้าหน้าที่แล้ว',
                 'bg-blue-500': item.status === 'เจ้าหน้าที่รับเรื่องแล้ว',
                 'bg-green-500': item.status === 'แก้ไขเสร็จสิ้นแล้ว'
               }" class="w-2 h-2 rounded-full animate-pulse"></div>
               {{ item.status }}
            </span>
            
            <button @click="openDetails(item)" class="text-blue-600 hover:text-blue-800 text-xs font-bold flex items-center gap-1 transition group">
              รายละเอียด <ChevronRight class="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
          </div>

          <div class="flex flex-col gap-2 pt-2">
            <button 
              v-if="item.status === 'รอดำเนินการ'" 
              @click="notifyOfficer(item)" 
              class="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-md transition transform active:scale-95"
            >
              <Send class="w-4 h-4" /> แจ้งเจ้าหน้าที่ (LINE)
            </button>

            <div v-else-if="item.status === 'แจ้งเจ้าหน้าที่แล้ว'" class="text-center py-2 text-orange-500 text-xs font-bold bg-white rounded-lg border border-orange-200 flex items-center justify-center gap-2 shadow-sm">
               <Smartphone class="w-4 h-4 animate-bounce" /> รอเจ้าหน้าที่กดรับงานใน LINE...
            </div>

            <div v-else-if="item.status === 'เจ้าหน้าที่รับเรื่องแล้ว'" class="text-center py-2 text-blue-600 text-xs font-bold bg-white rounded-lg border border-blue-200 flex items-center justify-center gap-2 shadow-sm">
               <Smartphone class="w-4 h-4" /> เจ้าหน้าที่กำลังซ่อม (รอปิดงานผ่าน LINE)
            </div>

            <div v-else class="text-center py-2 text-green-600 text-xs font-bold flex items-center justify-center gap-1 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle class="w-4 h-4" /> ดำเนินการแก้ไขเรียบร้อยแล้ว
            </div>
          </div>
        </div>

      </div>
    </div>

    <div v-if="isModalOpen && selectedReport" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity">
      <div class="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl transform transition-all">
        <div class="p-6 border-b flex justify-between items-center bg-gray-50">
          <h2 class="text-xl font-bold flex items-center gap-2 text-gray-800"><TriangleAlert class="text-yellow-500" /> รายละเอียดการแจ้งเหตุ</h2>
          <button @click="closeDetails" class="p-2 hover:bg-gray-200 rounded-full transition text-gray-500"><X class="w-6 h-6" /></button>
        </div>
        <div class="p-8 overflow-y-auto space-y-6">
          
          <div class="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-start gap-3">
             <MapPin class="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
             <div>
               <p class="text-xs text-gray-500 font-bold uppercase tracking-wider">สถานที่เกิดเหตุ</p>
               <p class="text-blue-900 font-bold text-lg leading-snug">{{ selectedReport.location_name || 'ไม่ระบุชื่อสถานที่ (ดูตามพิกัด)' }}</p>
               <a :href="`https://www.google.com/maps/search/?api=1&query=${selectedReport.latitude},${selectedReport.longitude}`" target="_blank" class="text-blue-500 text-sm hover:underline mt-1 inline-flex items-center gap-1">
                 เปิดแผนที่ Google Maps <ChevronRight class="w-3 h-3" />
               </a>
             </div>
          </div>

          <div class="grid grid-cols-2 gap-6 text-sm">
            <div><p class="text-gray-400 mb-1">ผู้แจ้ง</p><p class="font-bold text-gray-800 text-lg">{{ selectedReport.reporter_name }}</p></div>
            <div><p class="text-gray-400 mb-1">เบอร์โทรติดต่อ</p><p class="font-bold text-gray-800 text-lg">{{ selectedReport.phone }}</p></div>
          </div>
          
          <div class="p-5 bg-orange-50 rounded-2xl border border-orange-100">
            <p class="text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">สาเหตุที่ได้รับแจ้ง</p>
            <p class="text-orange-800 font-bold text-xl">{{ selectedReport.reason || 'ไม่ระบุ' }}</p>
          </div>

          <div v-if="selectedReport.images" class="space-y-3">
             <p class="font-bold text-gray-800 flex items-center gap-2"><ImageIcon class="w-5 h-5 text-gray-400" /> รูปภาพหลักฐาน</p>
             <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
               <img v-for="(img, idx) in selectedReport.images.split(',')" :key="idx" :src="`https://major-backend-dc3d.onrender.com/uploads/${img.trim()}`" class="w-full h-32 object-cover rounded-xl border border-gray-200 cursor-pointer hover:opacity-90 transition" @click="window.open(`https://major-backend-dc3d.onrender.com/uploads/${img.trim()}`, '_blank')" />
             </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import { 
  TriangleAlert, MapPin, ChevronRight, BarChart3, 
  User as UserIcon, Clock, Trash2, X, Send, CheckCircle, Smartphone,
  Image as ImageIcon 
} from 'lucide-vue-next';

const emit = defineEmits(['changePage']);
const adminReports = ref([]); 
const selectedReport = ref(null); 
const isModalOpen = ref(false);
let timer = null;

// 1. ดึงข้อมูล
const fetchAdminData = async () => {
  try {
    const response = await axios.get('https://major-backend-dc3d.onrender.com/api/admin/reports');
    adminReports.value = response.data;
  } catch (error) {
    console.error("ดึงข้อมูลไม่สำเร็จ:", error);
  }
};

// 2. แจ้ง LINE (ส่ง Location Name ไปด้วย)
const notifyOfficer = async (report) => {
  // ใช้ location_name ถ้ามี ถ้าไม่มีใช้ reporter_name แทน
  const locName = report.location_name || 'ไม่ระบุชื่อ (ดูพิกัด)';

  const message = 
    `📢 แจ้งเหตุไฟดับใหม่!\n` +
    `📍 จุดเกิดเหตุ: ${locName}\n` +  // <<--- โชว์ชื่อสถานที่ก่อนเลย
    `👤 ผู้แจ้ง: ${report.reporter_name}\n` +
    `📞 โทร: ${report.phone}\n` +
    `⚠️ สาเหตุ: ${report.reason || 'ไม่ระบุ'}`;

  try {
    const response = await axios.post('https://major-backend-dc3d.onrender.com/api/admin/line-send', { 
      message: message,
      reportId: report.id,
      lat: report.latitude,
      lng: report.longitude
    });

    if (response.data.success) {
      alert("✅ ส่งข้อมูลให้เจ้าหน้าที่เรียบร้อยแล้ว!");
      await updateStatus(report.id, 'แจ้งเจ้าหน้าที่แล้ว');
    }
  } catch (error) {
    alert("❌ ส่งไม่สำเร็จ กรุณาตรวจสอบ Server");
  }
};

const updateStatus = async (id, newStatus) => {
  try {
    await axios.patch(`https://major-backend-dc3d.onrender.com/api/admin/reports/${id}`, { status: newStatus });
    fetchAdminData();
  } catch (error) { console.error("Update error", error); }
};

const openDetails = (report) => { selectedReport.value = report; isModalOpen.value = true; };
const closeDetails = () => { isModalOpen.value = false; selectedReport.value = null; };

const deleteReport = async (id) => {
  if (confirm('ยืนยันที่จะลบรายการนี้? (ไม่สามารถกู้คืนได้)')) {
    try {
      await axios.delete(`https://major-backend-dc3d.onrender.com/api/admin/reports/${id}`);
      fetchAdminData();
    } catch (error) { alert('ลบไม่สำเร็จ'); }
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const dateObj = new Date(dateStr);
  const monthsShort = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  return `${dateObj.getDate()} ${monthsShort[dateObj.getMonth()]} ${dateObj.getFullYear() + 543} (${dateObj.getHours()}:${String(dateObj.getMinutes()).padStart(2, '0')} น.)`;
};

onMounted(() => { 
  fetchAdminData(); 
  timer = setInterval(fetchAdminData, 3000); 
});

onUnmounted(() => clearInterval(timer));
</script>