import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiCheck } from 'react-icons/fi';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const DayButton = ({ 
  day, 
  date, 
  isActive, 
  isToday, 
  onClick,
  index 
}) => {
  const dayInitial = day.substring(0, 3);
  const dayNumber = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  
  return (
    <motion.button
      onClick={onClick}
      className={`relative flex-shrink-0 w-16 h-20 rounded-xl font-medium transition-all flex flex-col items-center justify-center ${
        isActive
          ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20'
          : isToday
          ? 'bg-blue-50 text-blue-700 border border-blue-200'
          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
      }`}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          delay: 0.05 * index,
          type: 'spring',
          stiffness: 400,
          damping: 15
        }
      }}
    >
      {/* Day indicator */}
      <span className={`text-xs font-medium mb-1 ${
        isActive ? 'text-blue-100' : 'text-gray-400'
      }`}>
        {dayInitial}
      </span>
      
      {/* Date number */}
      <span className={`text-lg font-semibold mb-0.5 ${
        isActive ? 'text-white' : 'text-gray-800'
      }`}>
        {dayNumber}
      </span>
      
      {/* Month */}
      <span className={`text-[10px] font-medium ${
        isActive ? 'text-blue-100' : 'text-gray-400'
      }`}>
        {month}
      </span>
      
      {/* Active indicator */}
      {isActive && (
        <motion.div 
          className="absolute -top-1 -right-1 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center shadow-sm"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          <FiCheck className="text-blue-600 text-xs" />
        </motion.div>
      )}
      
      {/* Today indicator */}
      {isToday && !isActive && (
        <motion.span 
          className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-blue-500 rounded-full border-2 border-white"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 * index, type: 'spring' }}
        />
      )}
    </motion.button>
  );
};

export const DaySelector = ({ activeDay, setActiveDay, scrollDays, daySelectorRef }) => {
  const getCurrentDay = () => {
    const date = new Date();
    return days[date.getDay()];
  };

  return (
    <div className="relative mb-6 md:mb-8" ref={daySelectorRef}>
      {/* Scroll left button */}
      <div className="absolute left-0 top-0 bottom-0 flex items-center z-10">
        <motion.button
          onClick={() => scrollDays('left')}
          className="h-10 w-8 rounded-r-lg bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center text-blue-600 hover:bg-gray-50 ml-0.5"
          whileHover={{ scale: 1.1, x: 2 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Scroll left"
        >
          <FiChevronLeft size={18} />
        </motion.button>
      </div>
      
      {/* Days container */}
      <motion.div 
        className="flex gap-2.5 overflow-x-auto pb-5 px-10 scrollbar-hide"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {days.map((day, index) => {
          const isActive = activeDay === day;
          const isToday = day === getCurrentDay();
          const date = new Date();
          date.setDate(date.getDate() + (index - date.getDay()));
          
          return (
            <DayButton
              key={day}
              day={day}
              date={date}
              isActive={isActive}
              isToday={isToday}
              onClick={() => setActiveDay(day)}
              index={index}
            />
          );
        })}
      </motion.div>
      
      {/* Scroll right button */}
      <div className="absolute right-0 top-0 bottom-0 flex items-center z-10">
        <motion.button
          onClick={() => scrollDays('right')}
          className="h-10 w-8 rounded-l-lg bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center text-blue-600 hover:bg-gray-50 mr-0.5"
          whileHover={{ scale: 1.1, x: -2 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Scroll right"
        >
          <FiChevronRight size={18} />
        </motion.button>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-blue-500 rounded-full"
          initial={{ width: '0%' }}
          animate={{ 
            width: `${(days.indexOf(activeDay) + 1) / days.length * 100}%`,
            transition: { duration: 0.4, ease: 'easeInOut' }
          }}
        />
      </div>
    </div>
  );
};
