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
      <div class="cursor-pointer">
        <User class="w-8 h-8 text-black" />
      </div>
    </header>

    <nav class="bg-[#87CEEB] flex justify-around pb-2 shadow-md relative z-10">
      <div class="nav-item cursor-pointer group" @click="$emit('changePage', 'report')">
        <TriangleAlert class="icon-nav group-hover:scale-110 transition-transform" /> 
        <span>แจ้งปัญหา</span>
      </div>
      
      <div class="nav-item active cursor-pointer group" @click="$emit('changePage', 'news')">
        <Megaphone class="icon-nav" /> 
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

    <main class="w-full max-w-[1200px] mx-auto p-4 md:p-6 bg-[#E8EAF6]">
      
      <section class="text-center py-6">
        <h2 class="text-2xl font-semibold mb-6">จำนวนผู้ใช้ไฟฟ้าสูงสุด 3 อันดับแรก</h2>
        <hr class="border-t border-gray-400 opacity-50 mb-6 mx-auto w-3/4">
        
        <div class="flex flex-wrap justify-center gap-8 md:gap-16 items-center">
          
          <div class="flex items-center gap-4 min-w-[200px]">
            <div class="w-[60px] h-[60px] bg-black text-white flex justify-center items-center rounded-md border-2 border-[#C4A484]">
              <Home class="w-7 h-7" />
            </div>
            <div class="text-left">
              <div class="text-base text-gray-700">ลูกค้าบ้านอยู่อาศัย</div>
              <div class="text-2xl font-bold">73,755</div>
            </div>
          </div>

          <div class="flex items-center gap-4 min-w-[200px]">
            <div class="w-[60px] h-[60px] bg-black text-white flex justify-center items-center rounded-md border-2 border-[#C4A484]">
              <Store class="w-7 h-7" />
            </div>
            <div class="text-left">
              <div class="text-base text-gray-700">กิจการขนาดเล็ก</div>
              <div class="text-2xl font-bold">55,317</div>
            </div>
          </div>

          <div class="flex items-center gap-4 min-w-[200px]">
            <div class="w-[60px] h-[60px] bg-black text-white flex justify-center items-center rounded-md border-2 border-[#C4A484]">
              <Building2 class="w-7 h-7" />
            </div>
            <div class="text-left">
              <div class="text-base text-gray-700">กิจการขนาดกลาง</div>
              <div class="text-2xl font-bold">25,441</div>
            </div>
          </div>

        </div>
        
        <hr class="border-t border-gray-400 opacity-50 mt-6 mx-auto w-3/4">
      </section>

      <section class="flex flex-col md:flex-row gap-8 py-4 px-4">
        
        <div class="md:w-1/4 flex flex-col items-center text-center pt-8">
          <div class="text-2xl font-medium text-gray-700 leading-snug">
            จำนวนผู้ใช้ไฟฟ้าสะสม<br>ทั้งหมด
          </div>
          <div class="text-6xl font-bold text-[#5EB8FF] mt-4 drop-shadow-sm">
            141,605
          </div>
        </div>

        <div class="md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          
          <div class="stat-card">
            <div class="card-header"><span class="dot bg-[#2E7D96]"></span>ลูกค้าบ้านอยู่อาศัย</div>
            <div class="card-number">73,755</div>
          </div>
          <div class="stat-card">
            <div class="card-header"><span class="dot bg-[#388EBC]"></span>กิจการขนาดเล็ก</div>
            <div class="card-number">355,317</div>
          </div>
          <div class="stat-card">
            <div class="card-header"><span class="dot bg-[#7ABEDF]"></span>กิจการขนาดกลาง</div>
            <div class="card-number">25,441</div>
          </div>
          <div class="stat-card">
            <div class="card-header"><span class="dot bg-[#7ED6BC]"></span>กิจการขนาดใหญ่</div>
            <div class="card-number">2,675</div>
          </div>
          <div class="stat-card">
            <div class="card-header"><span class="dot bg-[#A6E6D3]"></span>กิจการเฉพาะอย่าง</div>
            <div class="card-number">3,396</div>
          </div>
          <div class="stat-card">
            <div class="card-header"><span class="dot bg-[#D3F1E9]"></span>องค์กรไม่แสวงหากำไร</div>
            <div class="card-number">342</div>
          </div>
          <div class="stat-card">
            <div class="card-header"><span class="dot bg-[#A0A0A0]"></span>สูบน้ำเพื่อการเกษตร</div>
            <div class="card-number">0</div>
          </div>
          <div class="stat-card">
            <div class="card-header"><span class="dot bg-[#FFFFFF] border border-gray-300"></span>ไฟฟ้าชั่วคราว</div>
            <div class="card-number">30,540</div>
          </div>
          <div class="stat-card">
            <div class="card-header"><span class="dot bg-[#4A6C66]"></span>สถานีอัดประจุไฟฟ้า</div>
            <div class="card-number">1,002</div>
          </div>

        </div>
      </section>

    </main>
  </div>
</template>

<script setup>
import { 
  User, TriangleAlert, Megaphone, MapPin, MessageCircleMore,
  Home, Store, Building2 // Import ไอคอนเพิ่ม
} from 'lucide-vue-next';

const emit = defineEmits(['changePage']);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600&display=swap');

.font-sarabun { font-family: 'Sarabun', sans-serif; }

/* Navbar Styles (Theme เดิม) */
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
.nav-item.active { position: relative; }
.nav-item.active::after { content: ''; display: block; width: 80%; height: 3px; background: white; margin-top: 4px; border-radius: 2px; }

/* Custom Styles for Statistics */
.stat-card {
  background-color: #DDDDDD;
  border-radius: 12px;
  padding: 15px 20px;
  height: 110px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: transform 0.2s;
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 400;
}

.dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}

.card-number {
  text-align: right;
  font-size: 26px;
  font-weight: 600;
}
</style>