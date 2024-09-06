import { motion } from "framer-motion";
import { FaArrowRight, FaPlay } from "react-icons/fa";
import Footer from "./Footer";

const Home = () => {
  return (
    <div className="bg-gradient-to-b from-gray-950 to-gray-800 text-white min-h-screen flex flex-col justify-between">
      {/* Hero Section */}
      <section className="h-screen-minus-92 flex flex-col justify-center items-center text-center px-6 py-12 md:px-12">
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          The Ultimate F1 RaceTrack Visualizer
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Explore, analyze, and visualize F1 races like never done before.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex space-x-4"
        >
          <a
            href="#features"
            className="bg-red-500 text-white px-6 py-3 rounded-full font-semibold flex items-center hover:bg-red-600 transition"
          >
            Get Started <FaArrowRight className="ml-2" />
          </a>
          <a
            href="#"
            className="bg-gray-800 text-white px-6 py-3 rounded-full font-semibold flex items-center hover:bg-gray-700 transition"
          >
            <FaPlay className="mr-2" /> Watch Demo
          </a>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-900 text-white py-12">
        <img className="w-1/2 h-1/2" src={require("../assets/Home Page/Image 1.png")} />
        <img className="w-1/2 h-1/2" src={require("../assets/Home Page/Image 2.png")} />
        <img className="w-1/2 h-1/2" src={require("../assets/Home Page/Image 3.png")} />
        <img className="w-1/2 h-1/2" src={require("../assets/Home Page/Image 4.png")} />
        <div className="container mx-auto px-6">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Key Features
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="bg-gray-800 p-6 rounded-lg text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-xl font-semibold mb-4">Real-Time Data</h3>
              <p>Get live updates and visualize the race as it happens.</p>
            </motion.div>
            <motion.div
              className="bg-gray-800 p-6 rounded-lg text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-xl font-semibold mb-4">Interactive 3D Tracks</h3>
              <p>Explore race tracks in 3D and analyze driver performance.</p>
            </motion.div>
            <motion.div
              className="bg-gray-800 p-6 rounded-lg text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-xl font-semibold mb-4">Detailed Lap Analysis</h3>
              <p>Break down each lap and discover crucial moments in the race and beyond.</p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;