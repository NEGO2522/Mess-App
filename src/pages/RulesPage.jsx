import { motion } from 'framer-motion';
import { FiArrowLeft, FiAlertCircle, FiCheckCircle, FiClock, FiDollarSign } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { messRules } from '../data/messData';

export const RulesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-white/20 mr-4"
            aria-label="Go back"
          >
            <FiArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Mess Rules & Timings</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <motion.div 
          className="grid grid-cols-1 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Meal Timings Card */}
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            whileHover={{ y: -2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          >
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <FiClock className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Meal Timings</h2>
            </div>
            <ul className="space-y-3">
              {messRules.slice(0, 4).map((rule, index) => (
                <motion.li 
                  key={`timing-${index}`}
                  className="flex items-start group"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <FiCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">{rule}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Rules & Regulations Card */}
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            whileHover={{ y: -2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          >
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <FiAlertCircle className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Rules & Regulations</h2>
            </div>
            <ul className="space-y-3">
              {messRules.slice(4).map((rule, index) => (
                <motion.li 
                  key={`rule-${index}`}
                  className="flex items-start group"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * (index + 4) }}
                >
                  <FiCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">{rule}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Guest Meal Card */}
          <motion.div 
            className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white overflow-hidden relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full"></div>
            <div className="absolute -right-10 top-1/2 w-24 h-24 bg-white/5 rounded-full"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2 flex items-center">
                    <FiDollarSign className="mr-2 text-yellow-300" />
                    Guest Meal
                  </h3>
                  <p className="text-blue-100">
                    Enjoy delicious meals with your guests at an affordable price.
                  </p>
                </div>
                <div className="mt-4 md:mt-0 bg-white/10 backdrop-blur-sm px-6 py-4 rounded-lg border border-white/20 flex-shrink-0">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-300">₹100</div>
                    <div className="text-blue-100 text-sm">per meal</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center px-3 py-1 bg-white/10 rounded-full text-sm">
                    <FiClock className="mr-1" /> Available during all meal times
                  </span>
                  <span className="inline-flex items-center px-3 py-1 bg-white/10 rounded-full text-sm">
                    <FiCheckCircle className="mr-1" /> Same quality as regular meals
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default RulesPage;
