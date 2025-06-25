import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { FiInfo, FiLinkedin, FiMail, FiCoffee, FiChevronLeft, FiChevronRight, FiSun, FiCoffee as FiBreakfast, FiDroplet, FiClock } from 'react-icons/fi';
import { weeklyMenu, messRules } from '../data/messData';
import { RulesSection } from '../components/home/RulesSection';
import { Header } from '../components/home/Header';
import { DaySelector } from '../components/home/DaySelector';
import { MealCard } from '../components/home/MealCard';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const mealTypes = ['breakfast', 'lunch', 'snacks', 'dinner'];

const getCurrentDay = () => {
  return days[new Date().getDay()];
};

const getMealIcon = (mealType) => {
  switch(mealType) {
    case 'breakfast':
      return <FiBreakfast />;
    case 'lunch':
      return <FiDroplet />;
    case 'snacks':
      return <FiClock />;
    case 'dinner':
      return <FiSun />;
    default:
      return <FiCoffee />;
  }
};

const Home = () => {
  const [activeDay, setActiveDay] = useState(days[new Date().getDay()]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const daySelectorRef = useRef(null);
  
  const toggleRules = () => {
    setShowRules(!showRules);
    if (!showRules) {
      setTimeout(() => document.getElementById('rules')?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };
  
  useEffect(() => {
    const now = new Date();
    const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - now;
    const timeoutId = setTimeout(() => setActiveDay(days[new Date().getDay()]), msUntilMidnight);
    return () => clearTimeout(timeoutId);
  }, []);
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollDays = (direction) => {
    daySelectorRef.current?.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' });
  };
  
  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 text-gray-800 overflow-x-hidden text-sm md:text-base"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section - Enhanced for Mobile */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 text-white pb-12 md:pb-24">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center opacity-10"></div>
        
        {/* Removed floating food icons */}
        
        <div className="container mx-auto px-4 pt-16 md:pt-24 pb-12 relative z-10">
          <motion.div 
            className="max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="mb-6">
              <div className="flex flex-col items-start">
                <span className="inline-block text-blue-100 text-xs font-medium mb-1 uppercase tracking-wider">
                  Welcome to
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-2">
                  Poornima Mess
                </h1>
                <div className="space-y-0">
                  <span className="text-xl sm:text-2xl font-medium text-blue-50">
                    Delicious Meals, </span>
                  <span className="text-yellow-300 text-xl sm:text-2xl font-medium">
                    Every Single Day
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-6 sm:mb-8 leading-relaxed">
              Experience the finest dining with our carefully curated weekly menu, served fresh every day
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button 
                className="flex-1 bg-white text-blue-700 px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-semibold shadow-lg hover:bg-blue-50 transition-all duration-300 flex items-center justify-center text-sm sm:text-base"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiCoffee className="mr-2 text-base sm:text-lg" /> 
                <span>Today's Menu</span>
              </motion.button>
              
              <motion.button 
                className="flex-1 border-2 border-white/50 bg-white/5 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 flex items-center justify-center text-sm sm:text-base"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiInfo className="mr-2 text-base sm:text-lg" />
                <span>Learn More</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-white/50 rounded-full flex justify-center p-1">
            <motion.div 
              className="w-2 h-2 bg-white rounded-full mt-1"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </div>
      </div>

      {/* Header with mobile menu */}
      <Header 
        isScrolled={isScrolled} 
        activeDay={activeDay} 
        onToggleRules={toggleRules}
        showRules={showRules}
      />

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-10">
        {/* Day Selector */}
        <div className="relative mb-6 sm:mb-8 bg-white rounded-2xl shadow-sm p-3 -mt-8 sm:-mt-10 mx-1 sm:mx-2 md:mx-0 md:mt-0 md:shadow-md" ref={daySelectorRef}>
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 px-2">Select Day</h2>
          <div className="absolute left-0 top-0 bottom-0 flex items-center z-10">
            <motion.button
              onClick={() => scrollDays('left')}
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white shadow-md flex items-center justify-center text-blue-600 hover:bg-blue-50 ml-1 sm:ml-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Scroll left"
            >
              <FiChevronLeft size={20} />
            </motion.button>
          </div>
          
          <motion.div 
            className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-3 sm:pb-4 px-10 sm:px-12 scrollbar-hide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {days.map((day, index) => {
              const isActive = activeDay === day;
              const isToday = day === getCurrentDay();
              const dayInitial = day.substring(0, 3);
              const date = new Date();
              date.setDate(date.getDate() + (index - date.getDay()));
              
              return (
                <motion.button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`flex-shrink-0 px-3 sm:px-4 py-2 sm:py-3 rounded-xl font-medium transition-all flex flex-col items-center ${
                    isActive
                      ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30 transform scale-105'
                      : isToday
                      ? 'bg-blue-50 text-blue-700 border-2 border-blue-200 font-medium'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
                  }`}
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: 0.1 * index,
                      type: 'spring',
                      stiffness: 300
                    }
                  }}
                >
                  <span className={`text-xs mb-1 ${
                    isActive ? 'text-blue-100' : 'text-gray-400'
                  }`}>
                    {dayInitial}
                  </span>
                  <span className="text-sm font-medium">
                    {date.getDate()}
                  </span>
                  {isToday && (
                    <span className="absolute -top-1 -right-1 h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
          
          <div className="absolute right-0 top-0 bottom-0 flex items-center z-10">
            <motion.button
              onClick={() => scrollDays('right')}
              className="h-10 w-10 rounded-full bg-white shadow-md flex items-center justify-center text-blue-600 hover:bg-blue-50 mr-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Scroll right"
            >
              <FiChevronRight size={20} />
            </motion.button>
          </div>
        </div>

        {/* Menu Card */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeDay}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100"
            initial={{ opacity: 0, y: 20, rotateX: -5 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -20, rotateX: 5 }}
            transition={{ duration: 0.5, type: 'spring', damping: 15 }}
          >
            <div className="p-5 md:p-6">
              <div className="flex items-center justify-between mb-6">
                <motion.h2 
                  className="text-2xl md:text-3xl font-bold text-gray-800 font-sans"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  {activeDay}'s Menu
                </motion.h2>
                <motion.div 
                  className="hidden md:block text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  Fresh & Delicious
                </motion.div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:gap-6">
                {mealTypes.map((mealType, index) => {
                  const menuItem = weeklyMenu[activeDay.toLowerCase()]?.[mealType] || 'Menu not available';
                  const isLongText = menuItem.length > 80;
                  
                  return (
                    <motion.div 
                      key={mealType}
                      className={`relative group bg-white p-5 rounded-2xl border-l-4 ${
                        mealType === 'breakfast' ? 'border-orange-400 bg-orange-50/30' :
                        mealType === 'lunch' ? 'border-green-400 bg-green-50/30' :
                        mealType === 'snacks' ? 'border-yellow-400 bg-yellow-50/30' : 'border-blue-400 bg-blue-50/30'
                      } shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden`}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      whileHover={{ 
                        y: -2,
                        boxShadow: '0 8px 15px -5px rgba(0, 0, 0, 0.1)'
                      }}
                      transition={{ 
                        delay: 0.05 * index,
                        duration: 0.3,
                        type: 'spring',
                        stiffness: 300
                      }}
                    >
                      <div className="flex items-start">
                        <div className={`p-2.5 rounded-xl ${
                          mealType === 'breakfast' ? 'bg-orange-100/80 text-orange-600' :
                          mealType === 'lunch' ? 'bg-green-100/80 text-green-600' :
                          mealType === 'snacks' ? 'bg-yellow-100/80 text-yellow-600' : 'bg-blue-100/80 text-blue-600'
                        } mr-4 flex-shrink-0`}>
                          {React.cloneElement(getMealIcon(mealType), {
                            className: `${getMealIcon(mealType).props.className} text-xl`
                          })}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1.5">
                            <h3 className="text-lg font-semibold text-gray-800 capitalize">
                              {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                            </h3>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                              mealType === 'breakfast' ? 'bg-orange-100 text-orange-700' :
                              mealType === 'lunch' ? 'bg-green-100 text-green-700' :
                              mealType === 'snacks' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {mealType === 'breakfast' ? '7:30 - 9:30 AM' :
                               mealType === 'lunch' ? '12:30 - 2:30 PM' :
                               mealType === 'snacks' ? '4:30 - 6:00 PM' : '8:00 - 10:00 PM'}
                            </span>
                          </div>
                          <p className={`text-gray-600 leading-relaxed ${
                            isLongText ? 'text-sm' : 'text-base'
                          }`}>
                            {menuItem}
                          </p>
                        </div>
                      </div>
                      
                      {isLongText && (
                        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                      )}
                      
                      {isLongText && (
                        <button 
                          className="absolute bottom-2 right-2 text-xs font-medium text-blue-600 hover:text-blue-700 bg-white/90 px-3 py-1.5 rounded-full border border-blue-100 shadow-sm flex items-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            const card = e.currentTarget.closest('div[class*="border-"]');
                            const isExpanded = card.classList.toggle('h-auto');
                            card.classList.toggle('max-h-32', !isExpanded);
                            e.target.innerHTML = isExpanded ? 'Show less' : 'Show more';
                            
                            // Smooth scroll to show more content
                            if (isExpanded) {
                              card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                            }
                          }}
                        >
                          <FiChevronDown className="mr-1 text-xs" />
                          <span>Show more</span>
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Import and use the RulesSection component */}
        <RulesSection messRules={messRules} isExpanded={showRules} onToggleExpand={toggleRules} />
      </main>

      {/* Footer with Copyright and Social Links */}
      <footer className="bg-gray-800 text-white py-4 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Copyright Text - Left Side */}
            <p className="text-sm text-gray-400 mb-3 md:mb-0">
              &copy; {new Date().getFullYear()} Poornima Mess. All rights reserved.
            </p>
            
            {/* Social Links - Right Side */}
            <div className="flex items-center space-x-6">
              <a 
                href="https://www.linkedin.com/in/kshitij-jain-422025342/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors flex items-center"
              >
                <FiLinkedin className="w-4 h-4 mr-1" />
                <span className="text-xs">LinkedIn</span>
              </a>
              <a 
                href="mailto:negokshitij@gmail.com"
                className="text-gray-400 hover:text-white transition-colors flex items-center"
                onClick={(e) => {
                  if (!window.location.href.startsWith('mailto:')) {
                    e.preventDefault();
                    window.open('https://mail.google.com/mail/?view=cm&fs=1&to=negokshitij@gmail.com&su=Regarding%20Poornima%20Mess&body=Hello%20Kshitij,', '_blank');
                  }
                }}
              >
                <FiMail className="w-4 h-4 mr-1" />
                <span className="text-xs">Email</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  );
};

export default Home;
