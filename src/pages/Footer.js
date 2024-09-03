import { motion } from "framer-motion";

const Footer = () => {
    return (
        <div>
            <section id="contact" className="bg-gray-800 text-white p-10">
                <div className="text-center flex justify-center gap-16">
                    <div>
                        <motion.h2
                            className="text-xl font-bold mb-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            Created By
                        </motion.h2>
                        <div className="flex items-center justify-center">
                            <img className="w-24" src={require("../assets/Footer Image.png")} />
                            <div className="ml-6">
                                <div className="flex flex-col text-left">
                                    <p className="text-4xl font-semibold">Patel</p>
                                    <p className="text-4xl font-extrabold">Tirth</p>
                                </div>
                                <div className="flex space-x-3 mt-3">
                                    <svg className="w-6 h-6" data-name="Layer 1" id="Layer_1" viewBox="0 0 32 32" fill="white"><path d="M16,30A14,14,0,1,1,30,16,14,14,0,0,1,16,30ZM16,4A12,12,0,1,0,28,16,12,12,0,0,0,16,4Z"/><path d="M16,30a1,1,0,0,1-1-1V3a1,1,0,0,1,2,0V29A1,1,0,0,1,16,30Z"/><path d="M23,17a1,1,0,0,1-1-1c0-6.5-2.75-12-6-12a1,1,0,0,1,0-2c4.49,0,8,6.15,8,14A1,1,0,0,1,23,17Z"/><path d="M16,30a1,1,0,0,1,0-2c3.25,0,6-5.5,6-12a1,1,0,0,1,2,0C24,23.85,20.49,30,16,30Z"/><path d="M9,17a1,1,0,0,1-1-1C8,8.15,11.51,2,16,2a1,1,0,0,1,0,2c-3.25,0-6,5.5-6,12A1,1,0,0,1,9,17Z"/><path d="M16,30c-4.49,0-8-6.15-8-14a1,1,0,0,1,2,0c0,6.5,2.75,12,6,12a1,1,0,0,1,0,2Z"/><path d="M29,17H3a1,1,0,0,1,0-2H29a1,1,0,0,1,0,2Z"/><path d="M27,11H5A1,1,0,0,1,5,9H27a1,1,0,0,1,0,2Z"/><path d="M27,23H5a1,1,0,0,1,0-2H27a1,1,0,0,1,0,2Z"/></svg>
                                    <svg className="w-6 h-6" height="56.693px" id="Layer_1" version="1.1" viewBox="0 0 56.693 56.693" width="56.693px" fill="white"><g><path d="M30.071,27.101v-0.077c-0.016,0.026-0.033,0.052-0.05,0.077H30.071z"/><path d="M49.265,4.667H7.145c-2.016,0-3.651,1.596-3.651,3.563v42.613c0,1.966,1.635,3.562,3.651,3.562h42.12   c2.019,0,3.654-1.597,3.654-3.562V8.23C52.919,6.262,51.283,4.667,49.265,4.667z M18.475,46.304h-7.465V23.845h7.465V46.304z    M14.743,20.777h-0.05c-2.504,0-4.124-1.725-4.124-3.88c0-2.203,1.67-3.88,4.223-3.88c2.554,0,4.125,1.677,4.175,3.88   C18.967,19.052,17.345,20.777,14.743,20.777z M45.394,46.304h-7.465V34.286c0-3.018-1.08-5.078-3.781-5.078   c-2.062,0-3.29,1.389-3.831,2.731c-0.197,0.479-0.245,1.149-0.245,1.821v12.543h-7.465c0,0,0.098-20.354,0-22.459h7.465v3.179   c0.992-1.53,2.766-3.709,6.729-3.709c4.911,0,8.594,3.211,8.594,10.11V46.304z"/></g></svg>
                                    <svg className="w-6 h-6" height="25" viewBox="0 0 25 25" width="25" fill="white"><path d="M15.7481 24.9471C24.0901 24.7061 24.9111 22.9501 24.9111 12.9811C24.9111 1.98108 23.9111 0.981079 12.9111 0.981079C1.91113 0.981079 0.911133 1.98108 0.911133 12.9811C0.911133 22.9761 1.73713 24.7151 10.1391 24.9491C10.2121 24.8581 10.2391 24.7441 10.2391 24.6281C10.2391 24.3781 10.2291 21.8121 10.2241 20.9291C7.18713 21.5681 6.54613 19.5101 6.54613 19.5101C6.04913 18.2881 5.33313 17.9621 5.33313 17.9621C4.34213 17.3061 5.40813 17.3191 5.40813 17.3191C6.50413 17.3941 7.08113 18.4101 7.08113 18.4101C8.05513 20.0271 9.63713 19.5601 10.2591 19.2891C10.3581 18.6061 10.6401 18.1391 10.9521 17.8751C8.52713 17.6081 5.97813 16.7001 5.97813 12.6451C5.97813 11.4901 6.40413 10.5461 7.10213 9.80608C6.98913 9.53808 6.61513 8.46208 7.20913 7.00608C7.20913 7.00608 8.12613 6.72108 10.2121 8.09008C11.0831 7.85508 12.0171 7.73808 12.9461 7.73408C13.8731 7.73808 14.8071 7.85508 15.6801 8.09008C17.7651 6.72108 18.6801 7.00608 18.6801 7.00608C19.2761 8.46208 18.9011 9.53808 18.7881 9.80608C19.4881 10.5461 19.9111 11.4901 19.9111 12.6451C19.9111 16.7101 17.3581 17.6051 14.9251 17.8661C15.3171 18.1931 15.6661 18.8391 15.6661 19.8261C15.6661 20.7721 15.6601 22.4451 15.6561 23.5541C15.6541 24.1031 15.6531 24.5131 15.6531 24.6281C15.6531 24.7371 15.6821 24.8521 15.7481 24.9471V24.9471Z" fill="white" fill-rule="evenodd"/></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <motion.h2
                            className="text-xl font-bold my-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            Get in Touch
                        </motion.h2>
                        <motion.p
                            className="text-lg mb-5"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            Have questions or want to learn more?
                        </motion.p>
                        <motion.a
                            href="mailto:contact@f1races.com"
                            className="bg-red-500 text-white px-6 py-3 rounded-full font-semibold inline-block hover:bg-red-600 transition"
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            Contact Us
                        </motion.a>
                    </div>
                </div>
            </section>

            <footer className="bg-gray-900 text-white p-5 text-center">
            <p>&copy; 2024 F1 Analytics. All rights reserved.</p>
            </footer>
        </div>
    )
}

export default Footer;