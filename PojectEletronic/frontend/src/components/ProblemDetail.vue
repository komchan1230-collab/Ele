<template>
  <div class="min-h-screen bg-[#eef2f9] font-sarabun text-[#333]">
    
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

    <main class="max-w-[1000px] mx-auto p-6">
      
      <div class="text-center mb-6 relative">
        <h2 class="text-xl font-medium">รายละเอียด</h2>
        <hr class="border-gray-400 mt-2 mx-auto w-3/4">
      </div>

      <div class="bg-[#EAEAEA] rounded-md overflow-hidden shadow-sm">
        
        <div class="bg-[#D4D4D4] p-4 flex flex-wrap gap-x-12 gap-y-2 text-sm font-bold border-b border-gray-300">
          <div>16 ธ.ค. 2568 - 16 ธ.ค. 2568</div>
          <div>เมเจอร์-ปากเกร็ด</div>
          <div class="w-full sm:w-auto">09:00 น. - 13:00 น.</div>
          <div class="w-full sm:w-auto">นนทบุรี</div>
        </div>

        <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div class="md:col-span-1">
            <label class="block font-bold text-sm mb-2">ตำแหน่ง</label>
            <div class="w-full aspect-square bg-gray-200 rounded border border-gray-300 overflow-hidden relative">
              <img 
                src="https://via.placeholder.com/400x400.png?text=Map+Preview" 
                class="w-full h-full object-cover opacity-60" 
              />
              <div class="absolute inset-0 flex items-center justify-center">
                <MapPin class="w-8 h-8 text-red-500 drop-shadow-md" />
              </div>
            </div>
          </div>

          <div class="md:col-span-2 text-sm space-y-4">
            
            <div>
              <span class="font-bold">ชื่อ-นามสกุล *</span>
              <div class="pl-2 mt-1">สิริโชค คำมา</div>
            </div>

            <div>
              <span class="font-bold">อายุ *</span>
              <div class="pl-2 mt-1">20 ปี</div>
            </div>

            <div>
              <span class="font-bold">เบอร์โทร *</span>
              <div class="pl-2 mt-1">091-020-7256</div>
            </div>

            <div>
              <span class="font-bold">รายละเอียด *</span>
              <div class="pl-2 mt-1">ไฟดับช่วงเวลา 09:00น. ช่วยรีบแก้ไขปัญหาให้หน่อยครับ ตอนแยกแฟนไม่ได้</div>
            </div>

            <div>
              <span class="font-bold">แนบไฟล์ *</span>
              <div class="flex items-center gap-3 mt-2 pl-2">
                <i class="fas fa-file-image text-gray-500"></i>
                <span class="text-gray-700">F00.JPG</span>
                <button class="bg-white border border-gray-400 rounded-full px-4 py-0.5 text-xs hover:bg-gray-100 transition">
                  เปิด
                </button>
              </div>
            </div>

          </div>
        </div>

        <div class="p-6 flex justify-center bg-[#EAEAEA]">
          <button class="bg-[#D1D1D1] text-black/80 px-8 py-2 rounded-full font-bold shadow-sm hover:bg-[#C0C0C0] transition border border-gray-400">
            ติดต่อเจ้าหน้าที่
          </button>
        </div>

      </div>

    </main>
  </div>
</template>

<script setup>
import { User, TriangleAlert, Megaphone, MapPin, MessageCircleMore } from 'lucide-vue-next';
const emit = defineEmits(['changePage']);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;700&display=swap');
.font-sarabun { font-family: 'Sarabun', sans-serif; }

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