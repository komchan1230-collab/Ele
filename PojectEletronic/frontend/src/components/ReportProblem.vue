<template>
  <div class="page-container font-sarabun p-4 md:p-8">
    <div class="container-wrap max-w-6xl mx-auto flex flex-wrap gap-8">
      
      <div class="left-panel flex-1 min-w-[300px]">
        <div class="map-header mb-2 flex justify-between items-center">
          <h3 class="flex items-center gap-2 font-bold text-lg text-gray-800">
            <MapPin class="w-5 h-5 text-red-500" /> ปักหมุดตำแหน่งที่ไฟดับ *
          </h3>
          <button 
            class="bg-blue-500 text-white px-4 py-1 rounded-full text-sm hover:bg-blue-600 transition shadow-sm" 
            type="button" 
            @click="getCurrentLocation"
          >
            ตำแหน่งปัจจุบัน
          </button>
        </div>
        
        <div ref="mapContainer" id="map" class="h-[400px] rounded-2xl border-4 border-white shadow-xl z-0"></div>
        
        <p class="mt-2 text-sm text-gray-600">
          พิกัดที่เลือก: <span class="text-blue-600 font-bold">{{ lat.toFixed(6) }}, {{ lng.toFixed(6) }}</span>
        </p>
      </div>

      <div class="right-panel flex-1 min-w-[300px]">
        <form @submit.prevent="submitForm" class="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block font-bold mb-1 text-sm text-gray-700">ชื่อ-นามสกุล *</label>
              <input v-model="form.name" type="text" class="form-control border p-2.5 w-full rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" placeholder="ระบุชื่อผู้แจ้ง" required>
            </div>
            
            <div>
              <label class="block font-bold mb-1 text-sm text-gray-700">อายุ *</label>
              <select v-model="form.age" class="form-control border p-2.5 w-full rounded-xl bg-white focus:ring-2 focus:ring-blue-400 outline-none" required>
                <option value="" disabled selected>เลือกอายุ</option>
                <option v-for="n in 100" :key="n" :value="n">{{ n }} ปี</option>
              </select>
            </div>
          </div>
          
          <div class="mb-4">
            <label class="block font-bold mb-1 text-sm text-gray-700">เบอร์โทรศัพท์ *</label>
            <div class="flex gap-2">
              <input 
                v-model="form.phone" 
                type="tel" 
                class="form-control border p-2.5 flex-1 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" 
                maxlength="10" 
                placeholder="0xxxxxxxxx" 
                @input="filterPhone" 
                :disabled="isOtpVerified"
                required
              >
              <button 
                v-if="!isOtpVerified"
                type="button" 
                @click="requestOtp" 
                class="bg-blue-600 text-white px-4 rounded-xl text-sm font-bold hover:bg-blue-700 transition disabled:bg-gray-300 shadow-md"
                :disabled="form.phone.length < 10"
              >
                {{ otpSent ? 'ขออีกครั้ง' : 'ขอ OTP' }}
              </button>
              <span v-else class="text-green-600 flex items-center font-bold text-sm px-2">ยืนยันแล้ว ✓</span>
            </div>
          </div>

          <div class="mb-4">
            <label class="block font-bold mb-1 text-sm text-gray-700">สาเหตุของปัญหา *</label>
            <select v-model="form.reason" class="form-control border p-2.5 w-full rounded-xl bg-white focus:ring-2 focus:ring-blue-400 outline-none" required>
              <option value="" disabled selected>กรุณาเลือกสาเหตุ</option>
              <option value="สายไฟ/อุปกรณ์ชำรุด">สายไฟ/อุปกรณ์บนเสาไฟชำรุด</option>
              <option value="ภัยธรรมชาติ/ฝนตก">ภัยธรรมชาติ (ฝนตก/พายุ)</option>
              <option value="สัตว์ทำไฟฟ้าลัดวงจร">สัตว์ทำไฟฟ้าลัดวงจร</option>
              <option value="อุบัติเหตุ/รถชนเสาไฟ">อุบัติเหตุ (รถชนเสาไฟ)</option>
              <option value="หม้อแปลงระเบิด">หม้อแปลงไฟฟ้าระเบิด</option>
              <option value="ไม่ทราบสาเหตุ">ไม่ทราบสาเหตุ/อื่นๆ</option>
            </select>
          </div>
          
          <div class="mb-4">
            <label class="block font-bold mb-1 text-sm text-gray-700">รายละเอียดเพิ่มเติม</label>
            <textarea v-model="form.details" class="form-control border p-2.5 w-full rounded-xl min-h-[80px] focus:ring-2 focus:ring-blue-400 outline-none" placeholder="ระบุข้อมูลเพิ่มเติม (ถ้ามี)..."></textarea>
          </div>
          
          <div class="mb-6">
            <label class="block font-bold mb-1 text-sm text-gray-700">
              แนบรูปภาพพิกัด (ถ้ามี)
              <span v-if="fileObjects.length > 0" class="text-blue-600 ml-2 animate-pulse">
                (เลือกแล้ว {{ fileObjects.length }} รูป)
              </span>
            </label>
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              @change="handleFileUpload" 
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            >
            <div class="flex flex-wrap gap-2 mt-3">
              <div v-for="(img, index) in previewImages" :key="index" class="relative w-20 h-20">
                <img :src="img" class="w-full h-full object-cover rounded-xl border shadow-sm" />
                <button @click="removeImage(index)" type="button" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md">✕</button>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            class="w-full bg-green-500 text-white font-bold py-4 rounded-2xl hover:bg-green-600 transition shadow-lg active:scale-95 text-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
            :disabled="!isOtpVerified"
          >
            {{ isOtpVerified ? 'ส่งข้อมูลแจ้งเหตุ' : 'กรุณายืนยันเบอร์โทรศัพท์ก่อน' }}
          </button>
        </form>
      </div>
    </div>

    <div v-if="showOtpModal" class="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
      <div class="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
        <div class="mb-4 flex justify-center">
          <div class="bg-blue-100 p-4 rounded-full">
            <Phone class="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <h3 class="text-xl font-bold mb-2">ยืนยันเบอร์โทรศัพท์</h3>
        <p class="text-sm text-gray-500 mb-6">กรุณากรอกรหัส 6 หลักที่ส่งไปยังเบอร์<br><span class="font-bold text-gray-800">{{ form.phone }}</span></p>
        <input v-model="inputOtp" type="text" maxlength="6" class="w-full border-2 border-gray-100 p-4 rounded-2xl text-center text-2xl font-bold tracking-[0.4em] mb-6 focus:border-blue-500 outline-none transition bg-gray-50" placeholder="000000">
        <div class="flex flex-col gap-3">
          <button @click="verifyOtp" class="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition shadow-lg">ยืนยันรหัส OTP</button>
          <button @click="showOtpModal = false" class="text-gray-400 text-sm hover:underline">ยกเลิก</button>
        </div>
        <p class="mt-4 text-xs text-blue-400 font-bold">(รหัสทดสอบ: 123456)</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Phone } from 'lucide-vue-next';
import axios from 'axios';

const emit = defineEmits(['changePage']);

// แผนที่
const mapContainer = ref(null);
const map = ref(null);
const marker = ref(null);
const lat = ref(13.9129);
const lng = ref(100.4996);

// ฟอร์ม
const form = ref({
  name: '',
  age: '',
  phone: '',
  reason: '',
  details: ''
});

// ระบบ OTP จำลอง
const showOtpModal = ref(false);
const inputOtp = ref('');
const otpSent = ref(false);
const isOtpVerified = ref(false);
const mockServerOtp = "123456";

onMounted(() => {
  initMap();
});

const requestOtp = () => {
  if (form.value.phone.length === 10) {
    otpSent.value = true;
    showOtpModal.value = true;
  }
};

const verifyOtp = () => {
  if (inputOtp.value === mockServerOtp) {
    isOtpVerified.value = true;
    showOtpModal.value = false;
    alert("ยืนยันเบอร์โทรศัพท์สำเร็จ!");
  } else {
    alert("รหัสไม่ถูกต้อง (ลองกรอก 123456)");
    inputOtp.value = '';
  }
};

const filterPhone = (event) => {
  const input = event.target.value.replace(/\D/g, ''); 
  form.value.phone = input.slice(0, 10);
};

// แผนที่
const initMap = () => {
  map.value = L.map(mapContainer.value).setView([lat.value, lng.value], 16);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.value);
  const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  });
  L.Marker.prototype.options.icon = DefaultIcon;
  marker.value = L.marker([lat.value, lng.value], { draggable: true }).addTo(map.value);
  map.value.on('click', (e) => updatePosition(e.latlng.lat, e.latlng.lng));
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

const getCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      updatePosition(pos.coords.latitude, pos.coords.longitude);
      map.value.setView([pos.coords.latitude, pos.coords.longitude], 17);
    });
  }
};

// ส่งข้อมูล
const submitForm = async () => {
  try {
    const formData = new FormData();
    formData.append('reporter_name', form.value.name);
    formData.append('age', form.value.age);
    formData.append('phone', form.value.phone);
    formData.append('reason', form.value.reason);
    formData.append('details', form.value.details);
    formData.append('latitude', lat.value);
    formData.append('longitude', lng.value);
    fileObjects.value.forEach((file) => formData.append('images', file));

    const response = await axios.post('http://localhost:3000/api/reports', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    if (response.status === 201) {
      alert('ส่งข้อมูลแจ้งเหตุสำเร็จ!');
      emit('changePage', 'status');
    }
  } catch (error) {
    alert('ส่งข้อมูลไม่สำเร็จ กรุณาเช็ค Backend');
  }
};

// จัดการรูปภาพ
const previewImages = ref([]);
const fileObjects = ref([]);
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