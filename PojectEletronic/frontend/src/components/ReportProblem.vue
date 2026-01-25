<template>
  <div class="page-container font-sarabun p-4 md:p-8">
    <div class="container-wrap max-w-6xl mx-auto flex flex-wrap gap-8">
      
      <div class="left-panel flex-1 min-w-[300px]">
        <div class="map-header mb-2 flex justify-between items-center">
          <h3 class="flex items-center gap-2 font-bold text-lg">
            <MapPin class="w-5 h-5 text-red-500" /> ปักหมุดตำแหน่งที่ไฟดับ *
          </h3>
          <button 
            class="bg-blue-500 text-white px-4 py-1 rounded-full text-sm hover:bg-blue-600 transition" 
            type="button" 
            @click="getCurrentLocation"
          >
            ตำแหน่งปัจจุบัน
          </button>
        </div>
        
        <div ref="mapContainer" id="map" class="h-[400px] rounded-xl border-4 border-white shadow-lg z-0"></div>
        
        <p class="mt-2 text-sm text-gray-600">
          พิกัดที่เลือก: <span class="text-blue-600 font-bold">{{ lat.toFixed(6) }}, {{ lng.toFixed(6) }}</span>
        </p>
      </div>

      <div class="right-panel flex-1 min-w-[300px]">
        <form @submit.prevent="submitForm" class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block font-bold mb-1 text-sm">ชื่อ-นามสกุล *</label>
              <input v-model="form.name" type="text" class="form-control border p-2 w-full rounded-lg" placeholder="ระบุชื่อผู้แจ้ง" required>
            </div>
            <div>
              <label class="block font-bold mb-1 text-sm">อายุ *</label>
              <input v-model="form.age" type="number" class="form-control border p-2 w-full rounded-lg" required>
            </div>
          </div>
          
          <div class="mb-4">
            <label class="block font-bold mb-1 text-sm">เบอร์โทรศัพท์ *</label>
            <input 
              v-model="form.phone" 
              type="tel" 
              class="form-control border p-2 w-full rounded-lg" 
              maxlength="10" 
              placeholder="0xxxxxxxxx" 
              @input="filterPhone"
              required
            >
          </div>
          
          <div class="mb-4">
            <label class="block font-bold mb-1 text-sm">รายละเอียดปัญหา *</label>
            <textarea v-model="form.details" class="form-control border p-2 w-full rounded-lg min-h-[100px]" placeholder="เช่น เสาไฟหน้าบ้านดับ หรือดับทั้งซอย..." required></textarea>
          </div>
          
          <div class="mb-6">
            <label class="block font-bold mb-1 text-sm">แนบรูปภาพพิกัดที่เสีย (ถ้ามี)</label>
            <input 
              type="file" 
              multiple 
              accept="image/*"
              @change="handleFileUpload"
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            >
            
            <div class="flex flex-wrap gap-2 mt-3">
              <div v-for="(img, index) in previewImages" :key="index" class="relative w-20 h-20">
                <img :src="img" class="w-full h-full object-cover rounded-lg border" />
                <button @click="removeImage(index)" type="button" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">✕</button>
              </div>
            </div>
          </div>

          <button type="submit" class="w-full bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-600 transition shadow-md active:scale-95">
            ส่งข้อมูลแจ้งเหตุ
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-vue-next';
import axios from 'axios';

const emit = defineEmits(['changePage']);

// 1. ตัวแปรสำหรับแผนที่และพิกัด
const mapContainer = ref(null);
const map = ref(null);
const marker = ref(null);
const lat = ref(13.9129); // พิกัดเริ่มต้น (เมเจอร์ปากเกร็ด)
const lng = ref(100.4996);

// 2. ตัวแปรสำหรับฟอร์มและไฟล์
const form = ref({
  name: '',
  age: '',
  gender: 'male',
  phone: '',
  details: ''
});
const previewImages = ref([]); // สำหรับแสดงรูปตัวอย่าง
const fileObjects = ref([]);  // สำหรับเก็บไฟล์จริงส่งไป Backend

onMounted(() => {
  initMap();
});

// 3. ฟังก์ชันจัดการแผนที่
const initMap = () => {
  map.value = L.map(mapContainer.value).setView([lat.value, lng.value], 16);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map.value);

  const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  });
  L.Marker.prototype.options.icon = DefaultIcon;

  marker.value = L.marker([lat.value, lng.value], { draggable: true }).addTo(map.value);
  
  // คลิกเพื่อย้ายหมุด
  map.value.on('click', (e) => updatePosition(e.latlng.lat, e.latlng.lng));
  // ลากเพื่อย้ายหมุด
  marker.value.on('dragend', () => {
    const pos = marker.value.getLatLng();
    updatePosition(pos.lat, pos.lng);
  });
};

const updatePosition = (nLat, nLng) => {
  lat.value = nLat;
  lng.value = nLng;
  marker.value.setLatLng([nLat, nLng]);
};

// 4. ฟังก์ชันส่งข้อมูล (สำคัญ: ใช้ FormData)
const submitForm = async () => {
  try {
    const formData = new FormData();
    // ชื่อตัวแปรฝั่งซ้ายต้องตรงกับที่ Backend รอรับ
    formData.append('reporter_name', form.value.name);
    formData.append('age', form.value.age);
    formData.append('gender', form.value.gender);
    formData.append('phone', form.value.phone);
    formData.append('details', form.value.details);
    formData.append('latitude', lat.value);
    formData.append('longitude', lng.value);
    
    // แนบไฟล์รูปภาพ
    fileObjects.value.forEach((file) => {
      formData.append('images', file);
    });

    const response = await axios.post('http://localhost:3000/api/reports', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    if (response.status === 201) {
      alert('แจ้งเหตุสำเร็จ! ข้อมูลและพิกัดถูกส่งเรียบร้อยแล้ว');
      emit('changePage', 'status');
    }
  } catch (error) {
    console.error(error);
    alert('ส่งข้อมูลไม่สำเร็จ กรุณาเช็คว่า Backend รันอยู่ที่พอร์ต 3000');
  }
};

// ฟังก์ชันจัดการรูปภาพ
const handleFileUpload = (event) => {
  const files = event.target.files;
  if (files) {
    Array.from(files).forEach(file => {
      fileObjects.value.push(file);
      const reader = new FileReader();
      reader.onload = (e) => previewImages.value.push(e.target.result);
      reader.readAsDataURL(file);
    });
  }
};

const removeImage = (i) => {
  previewImages.value.splice(i, 1);
  fileObjects.value.splice(i, 1);
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600&display=swap');

.font-sarabun { font-family: 'Sarabun', sans-serif; }
.page-container { background-color: #eef2f9; min-height: 100vh; color: #333; }

/* Header & Nav Styles */
.header { background-color: #87CEEB; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; }
.nav-bar { background-color: #87CEEB; display: flex; justify-content: space-around; padding-bottom: 10px; }
.nav-item { text-decoration: none; color: #000; text-align: center; font-size: 13px; font-weight: bold; padding: 8px 10px; display: flex; flex-direction: column; align-items: center; transition: opacity 0.2s; }
.nav-item:hover { opacity: 0.7; }
.icon-nav { width: 28px; height: 28px; margin-bottom: 4px; }
.nav-item.active { position: relative; }
.nav-item.active::after { content: ''; display: block; width: 80%; height: 3px; background: white; margin-top: 4px; border-radius: 2px; }

/* Layout Styles */
.container-wrap { max-width: 1200px; margin: 20px auto; padding: 0 20px; display: flex; flex-wrap: wrap; gap: 30px; }
.left-panel, .right-panel { flex: 1; min-width: 300px; }
.btn-current-loc { background-color: #8ceabb; border: none; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; }
#map { width: 100%; height: 400px; border-radius: 10px; border: 4px solid #fff; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 0; }
.form-control { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 8px; font-family: 'Sarabun', sans-serif; outline: none; transition: border-color 0.2s; }
.form-control:focus { border-color: #87CEEB; }
.btn-submit { background-color: #8ceabb; color: #333; border: none; padding: 10px 30px; border-radius: 25px; font-size: 16px; font-weight: bold; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
</style>