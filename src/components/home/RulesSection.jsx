import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  FiAlertCircle, 
  FiCheckCircle, 
  FiClock, 
  FiDollarSign, 
  FiChevronDown, 
  FiChevronUp,
  FiCalendar,
  FiUsers,
  FiCoffee,
  FiAlertTriangle
} from 'react-icons/fi';

const RuleCard = ({ icon: Icon, title, items, iconBg, iconColor, delay = 0 }) => (
  <motion.div 
    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 h-full flex flex-col"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay: 0.1 + delay }}
    whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
  >
    <div className="flex items-center mb-6">
      <div className={`p-3 ${iconBg} rounded-xl mr-4`}>
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </div>
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    </div>
    <ul className="space-y-4 flex-1">
      {items.map((item, index) => (
        <motion.li 
          key={`${title.toLowerCase().replace(/\s+/g, '-')}-${index}`}
          className="flex items-start group"
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 * index + delay }}
        >
          <FiCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform" />
          <span className="text-gray-600 group-hover:text-gray-800 transition-colors">{item}</span>
        </motion.li>
      ))}
    </ul>
  </motion.div>
);

export const RulesSection = ({ messRules, isExpanded, onToggleExpand }) => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  // Split rules into categories
  const timingRules = messRules.slice(0, 4); // First 4 items are meal timings
  const generalRules = [
    'Meal timings are strictly followed. Late comers will not be entertained.',
    'Wastage of food is strictly prohibited.',
    'Maintain discipline and cleanliness in the mess premises.',
    'Inform in advance for any leave or absence.'
  ];
  
  return (
    <section id="rules" className="w-full py-16 md:py-24 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Mobile Toggle Button - Only shown on desktop */}
        {!isMobile && (
          <div className="lg:hidden mb-8">
            <motion.button
              onClick={onToggleExpand}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-4 px-6 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-between"
              whileHover={{ scale: 1.02, boxShadow: '0 5px 15px -3px rgba(37, 99, 235, 0.3)' }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center">
                <FiAlertCircle className="mr-3 text-xl" />
                <span className="text-lg">
                  {isExpanded ? 'Hide Rules & Timings' : 'Show Rules & Timings'}
                </span>
              </div>
              {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
            </motion.button>
          </div>
        )}
        
        {/* Content - Always visible on desktop, toggled on mobile */}
        <AnimatePresence>
          {(!isMobile || isExpanded) && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                  Mess Guidelines
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Our Mess Rules & Timings
                </h2>
                <div className="w-20 h-1.5 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full"></div>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                <RuleCard 
                  icon={FiClock}
                  title="Meal Timings"
                  items={timingRules}
                  iconBg="bg-blue-100"
                  iconColor="text-blue-600"
                  delay={0.1}
                />
                
                <RuleCard 
                  icon={FiAlertTriangle}
                  title="General Rules"
                  items={generalRules}
                  iconBg="bg-amber-100"
                  iconColor="text-amber-600"
                  delay={0.2}
                />
                
                <motion.div 
                  className="bg-gradient-to-br from-purple-600 to-indigo-600 p-6 rounded-2xl shadow-lg text-white overflow-hidden relative col-span-2"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(124, 58, 237, 0.3)' }}
                >
                  <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full"></div>
                  <div className="absolute -right-10 top-1/2 w-24 h-24 bg-white/5 rounded-full"></div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center mb-4 md:mb-0">
                      <div className="p-3 bg-white/20 rounded-xl mr-4">
                        <FiUsers className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">Guest Meals</h3>
                        <p className="text-purple-100">Available for day scholars and outside hostelers</p>
                      </div>
                    </div>
                    <div className="text-center bg-white/10 backdrop-blur-sm px-6 py-4 rounded-lg border border-white/20">
                      <div className="text-3xl font-bold">₹100</div>
                      <div className="text-purple-100 text-sm">per meal</div>
                    </div>
                  </div>
                </motion.div>
              </div>
              

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
