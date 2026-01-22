<template>
  <div class="page-container font-sarabun">
    <header class="header">
      <h1 
        class="text-lg font-bold cursor-pointer hover:opacity-70 transition-opacity" 
        @click="$emit('changePage', 'home')"
        title="กลับหน้าหลัก"
      >
        แจ้งปัญหาไฟดับ (ในชุมชนเมเจอร์ปากเกร็ด)
      </h1>
      <div class="cursor-pointer">
        <User class="w-8 h-8 text-black" />
      </div>
    </header>

    <nav class="nav-bar">
      <div class="nav-item active cursor-pointer">
        <TriangleAlert class="icon-nav" /> 
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

    <div class="container-wrap">
      
      <div class="left-panel">
        <div class="map-header mb-2 flex justify-between items-center">
          <h3 class="flex items-center gap-2 font-bold text-base">
            <MapPin class="w-4 h-4" /> ตำแหน่ง *
          </h3>
          <button class="btn-current-loc hover:opacity-80 transition" type="button" @click="getCurrentLocation">
            ตำแหน่งปัจจุบัน
          </button>
        </div>
        
        <div ref="mapContainer" id="map"></div>
        
        <p class="mt-2 text-xs text-gray-600">
          พิกัดที่เลือก: <span class="text-blue-600 font-bold">{{ lat.toFixed(6) }}, {{ lng.toFixed(6) }}</span>
        </p>
      </div>

      <div class="right-panel">
        <form @submit.prevent="submitForm" class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          
          <div class="form-group mb-4">
            <label class="block font-bold mb-1 text-sm">ชื่อ-นามสกุล *</label>
            <input v-model="form.name" type="text" class="form-control" required>
          </div>
          
          <div class="form-group mb-4">
            <label class="block font-bold mb-1 text-sm">อายุ *</label>
            <input v-model="form.age" type="number" class="form-control" required>
          </div>
          
          <div class="form-group mb-4">
            <label class="block font-bold mb-1 text-sm">เพศ *</label>
            <div class="flex gap-6 mt-1">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" v-model="form.gender" value="male" class="w-4 h-4"> ชาย
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" v-model="form.gender" value="female" class="w-4 h-4"> หญิง
              </label>
            </div>
          </div>
          
          <div class="form-group mb-4">
            <label class="block font-bold mb-1 text-sm">เบอร์โทรศัพท์ *</label>
            <input 
              v-model="form.phone" 
              type="tel" 
              class="form-control" 
              maxlength="10" 
              placeholder="0xxxxxxxxx" 
              @input="filterPhone"
              required
            >
          </div>
          
          <div class="form-group mb-4">
            <label class="block font-bold mb-1 text-sm">รายละเอียด *</label>
            <textarea v-model="form.details" class="form-control min-h-[80px]" rows="3"></textarea>
          </div>
          
          <div class="form-group mb-4">
            <label class="block font-bold mb-1 text-sm">
              แนบไฟล์รูปภาพ (เลือกได้หลายรูป)
              <span class="text-xs font-normal text-gray-500 ml-1">{{ previewImages.length }} รูป</span>
            </label>
            
            <input 
              type="file" 
              class="form-control border-dashed text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
              multiple 
              accept="image/*"
              @change="handleFileUpload"
            >
            
            <div class="image-preview-container mt-3 p-2 border border-dashed border-gray-300 rounded bg-gray-50 min-h-[100px] flex flex-wrap gap-3">
              
              <div v-if="previewImages.length === 0" class="w-full h-full flex items-center justify-center text-gray-400 text-xs italic min-h-[80px]">
                ยังไม่ได้เลือกรูปภาพ (กดเลือกไฟล์ด้านบน)
              </div>
              
              <div 
                v-for="(imgSrc, index) in previewImages" 
                :key="index" 
                class="relative w-24 h-24 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm group"
              >
                <img :src="imgSrc" class="w-full h-full object-cover" />
                
                <button 
                  type="button"
                  @click="removeImage(index)"
                  class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-80 hover:opacity-100 transition shadow-md"
                >
                  ✕
                </button>
              </div>

            </div>
          </div>

          <div class="flex justify-end mt-6">
             <button type="submit" class="btn-submit hover:bg-[#70d6a5] transition transform active:scale-95">ส่งข้อมูล</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { User, TriangleAlert, Megaphone, MapPin, MessageCircleMore } from 'lucide-vue-next';
import axios from 'axios';

// กำหนด Event สำหรับเปลี่ยนหน้า
const emit = defineEmits(['changePage']);

// ตัวแปรสำหรับแผนที่
const mapContainer = ref(null);
const map = ref(null);
const marker = ref(null);
const lat = ref(13.9129);
const lng = ref(100.4996);

// ตัวแปรสำหรับฟอร์ม (ย้ายมาไว้ด้านบนเพื่อความชัดเจน)
const form = ref({
  name: '',
  age: '',
  gender: 'male',
  phone: '',
  details: ''
});

const previewImages = ref([]);
const fileObjects = ref([]);

onMounted(() => {
  initMap();
});

// ฟังก์ชันส่งข้อมูลไปยัง Backend (มีเพียงอันเดียว)
const submitForm = async () => {
  try {
    const payload = {
      reporter_name: form.value.name,
      age: form.value.age,
      gender: form.value.gender,
      phone: form.value.phone,
      details: form.value.details,
      latitude: lat.value,
      longitude: lng.value
    };

    // ส่งข้อมูลไปที่ Backend พอร์ต 3000 ที่เราจะสร้าง
    const response = await axios.post('http://localhost:3000/api/reports', payload);
    
    if (response.status === 201) {
      alert('บันทึกข้อมูลแจ้งปัญหาเรียบร้อยแล้ว');
      emit('changePage', 'status'); // ย้ายไปหน้าแสดงสถานะ
    }
  } catch (error) {
    console.error('Error:', error);
    alert('ส่งข้อมูลไม่สำเร็จ กรุณาตรวจสอบว่าได้เปิด Backend หรือยัง');
  }
};

// ฟังก์ชันสร้างแผนที่
const initMap = () => {
  map.value = L.map(mapContainer.value).setView([lat.value, lng.value], 16);
  
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map.value);

  const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  L.Marker.prototype.options.icon = DefaultIcon;

  marker.value = L.marker([lat.value, lng.value], { draggable: true }).addTo(map.value);
  marker.value.bindPopup("<b>จุดที่แจ้งปัญหา</b><br>ลากหรือคลิกเพื่อเปลี่ยนจุด").openPopup();

  map.value.on('click', (e) => {
    updatePosition(e.latlng.lat, e.latlng.lng);
  });

  marker.value.on('dragend', (e) => {
    const position = marker.value.getLatLng();
    updatePosition(position.lat, position.lng);
  });
};

const updatePosition = (newLat, newLng) => {
  lat.value = newLat;
  lng.value = newLng;
  marker.value.setLatLng([newLat, newLng]);
  map.value.panTo([newLat, newLng]);
};

const getCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      updatePosition(position.coords.latitude, position.coords.longitude);
      marker.value.bindPopup("ตำแหน่งปัจจุบันของคุณ").openPopup();
    }, () => {
      alert("ไม่สามารถเข้าถึงตำแหน่งได้");
    });
  } else {
    alert("เบราว์เซอร์ไม่รองรับ");
  }
};

// ฟังก์ชันจัดการรูปภาพ
const handleFileUpload = (event) => {
  const files = event.target.files;
  if (files && files.length > 0) {
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      fileObjects.value.push(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImages.value.push(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }
  event.target.value = ''; 
};

const removeImage = (index) => {
  previewImages.value.splice(index, 1);
  fileObjects.value.splice(index, 1);
};

const filterPhone = (e) => {
  form.value.phone = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
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