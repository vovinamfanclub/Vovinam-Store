
import React, { useState, useEffect } from 'react';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Hero: React.FC<HeroProps> = ({ searchQuery, setSearchQuery }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const sixHoursInMs = 6 * 60 * 60 * 1000;
      // Calculate how many ms have passed in the current 6-hour cycle
      const timePassedInCycle = now.getTime() % sixHoursInMs;
      const msLeft = sixHoursInMs - timePassedInCycle;

      const hours = Math.floor((msLeft / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((msLeft / 1000 / 60) % 60);
      const seconds = Math.floor((msLeft / 1000) % 60);

      return { hours, minutes, seconds };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <section className="relative h-[85vh] md:h-[90vh] w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Background Lifestyle Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Sports Lifestyle"
          className="w-full h-full object-cover object-center scale-105 animate-slow-zoom opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        {/* Added md:-translate-y-16 to shift content up on desktop only */}
        <div className="max-w-4xl md:-translate-y-16 transition-transform duration-700">
          <span className="inline-block text-white text-[10px] md:text-xs font-black tracking-[0.4em] uppercase mb-8 border border-white/40 px-6 py-2 rounded-full backdrop-blur-md">
            The Official Vovinam Fanclub Store
          </span>
          
          <h1 className="text-6xl md:text-[10rem] font-black text-white mb-2 tracking-tighter leading-[0.8] uppercase italic drop-shadow-2xl">
            FLASH SALE
          </h1>
          <h2 className="text-2xl md:text-6xl font-medium text-white mb-10 tracking-widest uppercase opacity-90" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.5)', color: 'transparent' }}>
            TRANG PHỤC THỂ THAO
          </h2>

          {/* Countdown Timer */}
          <div className="flex flex-col items-center gap-4 mb-12">
            <span className="text-white text-[10px] md:text-xs font-black tracking-[0.3em] uppercase opacity-80">KẾT THÚC SAU</span>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <div className="bg-black/60 backdrop-blur-md border border-white/10 w-14 h-14 md:w-20 md:h-20 flex items-center justify-center rounded-lg shadow-2xl">
                  <span className="text-2xl md:text-4xl font-black text-white tabular-nums">{formatNumber(timeLeft.hours)}</span>
                </div>
              </div>
              <span className="text-white text-2xl md:text-4xl font-black animate-pulse">:</span>
              <div className="flex flex-col items-center">
                <div className="bg-black/60 backdrop-blur-md border border-white/10 w-14 h-14 md:w-20 md:h-20 flex items-center justify-center rounded-lg shadow-2xl">
                  <span className="text-2xl md:text-4xl font-black text-white tabular-nums">{formatNumber(timeLeft.minutes)}</span>
                </div>
              </div>
              <span className="text-white text-2xl md:text-4xl font-black animate-pulse">:</span>
              <div className="flex flex-col items-center">
                <div className="bg-black/60 backdrop-blur-md border border-white/10 w-14 h-14 md:w-20 md:h-20 flex items-center justify-center rounded-lg shadow-2xl animate-tick">
                  <span className="text-2xl md:text-4xl font-black text-white tabular-nums">{formatNumber(timeLeft.seconds)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a 
              href="https://s.shopee.vn/6pv4ROQzcV"
              target="_blank"
              rel="noopener noreferrer"
              className="px-16 py-5 bg-[#0052FF] text-white font-black text-sm md:text-base rounded-full hover:bg-[#0041cc] transition-all transform active:scale-95 shadow-xl uppercase tracking-[0.2em] animate-pulse-blue"
            >
              MUA NGAY
            </a>
          </div>
        </div>
      </div>

      {/* Visual Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-40">
        <div className="w-[1px] h-12 bg-white rounded-full"></div>
      </div>
    </section>
  );
};

export default Hero;
