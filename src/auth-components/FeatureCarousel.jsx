import { motion, AnimatePresence } from 'framer-motion';

export const FeatureCarousel = ({ features, currentFeature, setCurrentFeature }) => (
  <div className="mt-8">
    <AnimatePresence mode="wait">
      <motion.div
        key={currentFeature}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
          {features[currentFeature].icon}
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          {features[currentFeature].title}
        </h2>
        <p className="text-gray-600">
          {features[currentFeature].description}
        </p>
      </motion.div>
    </AnimatePresence>
    
    <div className="flex space-x-2 mt-8">
      {features.map((_, index) => (
        <button
          key={index}
          onClick={() => setCurrentFeature(index)}
          className={`w-2 h-2 rounded-full transition-all ${
            index === currentFeature ? 'bg-blue-600 w-6' : 'bg-gray-300'
          }`}
          aria-label={`Go to feature ${index + 1}`}
        />
      ))}
    </div>
  </div>
);
