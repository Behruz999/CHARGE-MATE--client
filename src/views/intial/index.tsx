import './intial.css'
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const Intial = () => {
    const navigate = useNavigate()

    const leaveTo = (path: string) => {
        navigate(`/${path}`)
    }

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-800 text-black dark:text-white transition-colors duration-500 in-out-quad">
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <h1 className="text-3xl font-semibold mb-8">
                        What's your plan for today?
                    </h1>
                    <div className="flex flex-col space-y-4">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => leaveTo('family')}
                            className="px-6 py-3 bg-blue-500 text-white font-medium rounded-md shadow hover:bg-blue-600 transition"
                        >
                            Visit Family
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => leaveTo('charges')}
                            className="px-6 py-3 bg-green-500 text-white font-medium rounded-md shadow hover:bg-green-600 transition"
                        >
                            Observe Charges
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </>
    )
}
