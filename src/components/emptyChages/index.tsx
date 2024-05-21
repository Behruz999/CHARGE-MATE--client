import React from 'react';
import { motion } from 'framer-motion';

const EmptyCharges: React.FC<{
    message: string;
    onAddChargesClick: () => void;
}> = ({ message, onAddChargesClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center h-full"
        >
            <img src="/empty.png" alt="Empty Charges" className="w-32 mb-4" />
            <p className="text-gray-600 bg-white dark:bg-gray-800  dark:text-white transition-colors duration-500 in-out-quad mb-4 max-sm:text-center">{message}</p>
            <button onClick={onAddChargesClick} className="bg-blue-500 font-bold text-white py-2 px-4 rounded hover:bg-blue-600">
                Add Charges
            </button>
        </motion.div>
    );
};

export default EmptyCharges;
