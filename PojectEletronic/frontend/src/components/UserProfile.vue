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
      <div class="cursor-pointer bg-black/10 rounded-full p-1">
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
      
      <div class="flex justify-end mb-4">
        <button 
          @click="$emit('changePage', 'dashboard')"
          class="flex items-center gap-2 bg-[#2b79ff] text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-600 transition text-sm font-bold active:scale-95"
        >
          <BarChart3 class="w-4 h-4" />
          สำหรับเจ้าหน้าที่
        </button>
      </div>

      <div class="flex flex-wrap justify-center items-end gap-4 md:gap-8 mb-10">
        <div class="flex flex-col items-center">
          <label class="mb-2 font-medium">เวลาที่เริ่มดับ</label>
          <input type="time" value="00:00" class="filter-input" />
        </div>
        <div class="flex flex-col items-center">
          <label class="mb-2 font-medium">เวลาที่สิ้นสุด</label>
          <input type="time" value="23:30" class="filter-input" />
        </div>
        <div class="flex flex-col items-center">
          <label class="mb-2 font-medium">วันที่ไฟดับ</label>
          <input type="date" class="filter-input w-40" />
        </div>
        <div class="flex flex-col items-center">
          <label class="mb-2 font-medium">จุดบริเวณ</label>
          <input type="text" class="filter-input w-40" />
        </div>
        <button class="bg-white border border-gray-300 px-6 py-2 rounded-lg shadow-sm hover:bg-gray-50 font-medium h-[42px]">
          ค้นหา
        </button>
      </div>

      <div class="border-b border-gray-400 pb-2 mb-6">
        <h2 class="text-xl font-medium">เนื้อหาทั้งหมด</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div class="bg-[#E0E0E0] p-5 rounded-md shadow-sm border border-gray-300">
          <div class="flex justify-between mb-2">
            <div class="text-sm font-bold">16 ธ.ค. 2568 - 16 ธ.ค. 2568</div>
            <div class="text-sm font-bold">เมเจอร์-ปากเกร็ด</div>
          </div>
          <div class="flex justify-between mb-4 text-gray-600 text-sm">
            <div>09:00 น. - 13:00 น.</div>
            <div>นนทบุรี</div>
          </div>
          <div class="flex justify-center">
            <button 
              @click="$emit('changePage', 'problem-detail')"
              class="bg-white text-black px-6 py-1 rounded-full text-sm font-bold shadow-md hover:bg-gray-50 transition border border-gray-300"
            >
              รายละเอียด
            </button>
          </div>
        </div>

        <div class="bg-white p-5 rounded-md shadow-sm border border-gray-200">
          <div class="flex justify-between mb-2">
            <div class="text-sm font-bold">17 ธ.ค. 2568 - 17 ธ.ค. 2568</div>
            <div class="text-sm font-bold">เมเจอร์-ปากเกร็ด</div>
          </div>
          <div class="flex justify-between mb-4 text-gray-600 text-sm">
            <div>12:00 น. - 16:00 น.</div>
            <div>นนทบุรี</div>
          </div>
          <div class="flex justify-center">
            <button 
              @click="$emit('changePage', 'problem-detail')"
              class="bg-[#E0E0E0] text-black px-6 py-1 rounded-full text-sm font-bold shadow-md hover:bg-gray-300 transition"
            >
              รายละเอียด
            </button>
          </div>
        </div>

        <div class="bg-[#E0E0E0] p-5 rounded-md shadow-sm border border-gray-300">
          <div class="flex justify-between mb-2">
            <div class="text-sm font-bold">18 ธ.ค. 2568 - 18 ธ.ค. 2568</div>
            <div class="text-sm font-bold">เมเจอร์-ปากเกร็ด</div>
          </div>
          <div class="flex justify-between mb-4 text-gray-600 text-sm">
            <div>08:00 น. - 12:00 น.</div>
            <div>นนทบุรี</div>
          </div>
          <div class="flex justify-center">
            <button 
              @click="$emit('changePage', 'problem-detail')"
              class="bg-white text-black px-6 py-1 rounded-full text-sm font-bold shadow-md hover:bg-gray-50 transition border border-gray-300"
            >
              รายละเอียด
            </button>
          </div>
        </div>

        <div class="bg-white p-5 rounded-md shadow-sm border border-gray-200">
          <div class="flex justify-between mb-2">
            <div class="text-sm font-bold">19 ธ.ค. 2568 - 19 ธ.ค. 2568</div>
            <div class="text-sm font-bold">เมเจอร์-ปากเกร็ด</div>
          </div>
          <div class="flex justify-between mb-4 text-gray-600 text-sm">
            <div>06:00 น. - 10:00 น.</div>
            <div>นนทบุรี</div>
          </div>
          <div class="flex justify-center">
            <button 
              @click="$emit('changePage', 'problem-detail')"
              class="bg-[#E0E0E0] text-black px-6 py-1 rounded-full text-sm font-bold shadow-md hover:bg-gray-300 transition"
            >
              รายละเอียด
            </button>
          </div>
        </div>

      </div>

    </main>
  </div>
</template>

<script setup>
import { 
  User, TriangleAlert, Megaphone, MapPin, MessageCircleMore,
  BarChart3 // Import ไอคอนกราฟ
} from 'lucide-vue-next';

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
.filter-input { border: 1px solid #ccc; border-radius: 8px; padding: 8px 12px; background: white; outline: none; text-align: center; width: 120px; height: 42px; }
</style>