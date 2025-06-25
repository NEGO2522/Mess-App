import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiClock, FiInfo } from 'react-icons/fi';

const getMealIcon = (mealType) => {
  const icons = {
    breakfast: '🥐',
    lunch: '🍲',
    snacks: '🥪',
    dinner: '🍛'
  };
  return icons[mealType] || '🍽️';
};

const getMealTime = (mealType) => ({
  breakfast: { time: '7:30 - 9:30 AM', icon: '🌅' },
  lunch: { time: '12:30 - 2:30 PM', icon: '🕑' },
  snacks: { time: '4:30 - 6:00 PM', icon: '☕' },
  dinner: { time: '8:00 - 10:00 PM', icon: '🌙' }
}[mealType]);

const getMealClasses = (mealType) => ({
  breakfast: { 
    bg: 'from-orange-50 to-orange-50/70', 
    border: 'border-orange-200', 
    text: 'text-orange-700', 
    bgLight: 'bg-orange-100/90',
    icon: 'text-orange-600',
    gradient: 'from-orange-400 to-orange-500'
  },
  lunch: { 
    bg: 'from-green-50 to-green-50/70', 
    border: 'border-green-200', 
    text: 'text-green-700', 
    bgLight: 'bg-green-100/90',
    icon: 'text-green-600',
    gradient: 'from-green-400 to-green-500'
  },
  snacks: { 
    bg: 'from-amber-50 to-amber-50/70', 
    border: 'border-amber-200', 
    text: 'text-amber-700', 
    bgLight: 'bg-amber-100/90',
    icon: 'text-amber-600',
    gradient: 'from-amber-400 to-amber-500'
  },
  dinner: { 
    bg: 'from-blue-50 to-blue-50/70', 
    border: 'border-blue-200', 
    text: 'text-blue-700', 
    bgLight: 'bg-blue-100/90',
    icon: 'text-blue-600',
    gradient: 'from-blue-400 to-blue-500'
  }
}[mealType]);

export const MealCard = ({ mealType, menuItem, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef(null);
  const { bg, border, text, bgLight, icon, gradient } = getMealClasses(mealType);
  const { time: mealTime, icon: timeIcon } = getMealTime(mealType);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      const { scrollHeight, clientHeight } = contentRef.current;
      setIsOverflowing(scrollHeight > clientHeight);
    }
  }, [menuItem]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div 
      className={`relative group bg-gradient-to-br ${bg} border ${border} rounded-2xl shadow-sm overflow-hidden transition-all duration-300`}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
      transition={{ 
        delay: 0.05 * index, 
        duration: 0.4, 
        type: 'spring', 
        stiffness: 300 
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with icon and title */}
      <div className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`p-2.5 rounded-xl ${bgLight} ${icon} mr-3 flex-shrink-0 shadow-sm`}>
              <span className="text-2xl">{getMealIcon(mealType)}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 capitalize">
              {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
            </h3>
          </div>
          <div className={`inline-flex items-center text-xs font-medium px-3 py-1.5 rounded-full ${bgLight} ${text} backdrop-blur-sm`}>
            <FiClock className="mr-1.5" />
            <span>{mealTime}</span>
          </div>
        </div>
      </div>

      {/* Content with gradient fade */}
      <div className="relative p-4 pt-3">
        <div 
          ref={contentRef}
          className={`relative overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-full' : 'max-h-20'}`}
        >
          <p className={`text-gray-700 leading-relaxed text-sm`}>
            {menuItem}
          </p>
        </div>
        
        {/* Show more/less button */}
        {(isOverflowing || isExpanded) && (
          <div className="mt-2 text-center">
            <button 
              onClick={toggleExpand}
              className={`inline-flex items-center text-xs font-medium px-3 py-1.5 rounded-full ${isExpanded ? 'bg-gray-100 text-gray-700' : `bg-gradient-to-r ${gradient} text-white`} hover:shadow-sm transition-all duration-200`}
            >
              {isExpanded ? (
                <>
                  <span>Show Less</span>
                  <FiChevronDown className="ml-1 transform rotate-180" />
                </>
              ) : (
                <>
                  <span>Read More</span>
                  <FiChevronDown className="ml-1" />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Hover effect indicator */}
      <motion.div 
        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`}
        initial={{ width: '0%' }}
        animate={{ width: isHovered ? '100%' : '0%' }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      />
    </motion.div>
  );
};
