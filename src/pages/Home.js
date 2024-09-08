import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import Footer from "./Footer";

const Home = () => {
  return (
    <div className="text-white min-h-screen flex flex-col justify-between">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 h-screen-minus-92 flex flex-col justify-center items-center text-center px-8 py-12 md:px-16">
            <div className="flex flex-col justify-center items-center mb-16">
                <motion.h1
                    className="text-5xl md:text-6xl font-extrabold mb-6"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    The Ultimate F1 Data & Analysis Site
                </motion.h1>
                <motion.p
                    className="text-lg md:text-2xl font-light mb-10"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    Explore, analyze, and visualize F1 races like never before.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="flex space-x-4"
                >
                    <Link
                    to="race-analysis"
                    className="bg-red-600 text-white px-6 py-3 rounded-full font-semibold flex items-center hover:bg-red-500 transition duration-300 transform hover:scale-105 shadow-lg"
                    >
                    Race Analysis <FaArrowRight className="ml-2" />
                    </Link>
                    <Link
                    to="qualifying-analysis"
                    className="bg-red-600 text-white px-6 py-3 rounded-full font-semibold flex items-center hover:bg-red-500 transition duration-300 transform hover:scale-105 shadow-lg"
                    >
                    Qualifying Analysis <FaArrowRight className="ml-2" />
                    </Link>
                </motion.div>
            </div>
        </section>

        <section className="bg-gradient-to-b from-gray-900 to-gray-800">
            <section className="text-white px-24 container py-12 bg-hero-pattern bg-cover">
                <div>
                    <div className="flex gap-x-16">
                        <div className="w-1/2 pt-16 pb-8">
                            <img className="transition-transform transform hover:scale-110" src={require("../assets/Home Page/Image 1.png")} />
                        </div>
                        <div className="relative last:after:hidden after:absolute after:top-9 after:bottom-2 after:start-3.5 after:w-[2px] after:-translate-x-[0.5px] after:bg-neutral-300">
                            <div className="relative z-10 size-7 flex justify-center items-center">
                                <svg fill="white" enable-background="new 0 0 32 32" height="32px" id="Layer_1" version="1.1" viewBox="0 0 32 32" width="32px"><g id="time_management_1_"><g><circle cx="19.252" cy="10.146" r="0.499"/><path d="M12.286,25.663c0.104-0.256,0.397-0.377,0.653-0.271c0.253,0.103,0.376,0.397,0.27,0.653 c-0.105,0.254-0.398,0.376-0.652,0.269C12.303,26.209,12.18,25.916,12.286,25.663z"/><circle cx="22.01" cy="11.989" r="0.499"/><circle cx="9.99" cy="24.011" r="0.499"/><circle cx="23.853" cy="14.747" r="0.499"/><circle cx="8.147" cy="21.253" r="0.499"/><circle cx="24.5" cy="18" r="0.5"/><circle cx="7.5" cy="18" r="0.5"/><circle cx="23.854" cy="21.252" r="0.5"/><circle cx="8.146" cy="14.748" r="0.5"/><circle cx="22.011" cy="24.01" r="0.5"/><circle cx="9.989" cy="11.99" r="0.5"/><circle cx="19.253" cy="25.853" r="0.5"/><circle cx="12.747" cy="10.147" r="0.5"/><circle cx="16" cy="26.5" r="0.5"/><circle cx="16" cy="9.5" r="0.5"/></g><path d="M16,17.5c-0.276,0-0.5-0.224-0.5-0.5v-6c0-0.276,0.224-0.5,0.5-0.5s0.5,0.224,0.5,0.5v6 C16.5,17.276,16.276,17.5,16,17.5z"/><path d="M16,19.5c-0.827,0-1.5-0.673-1.5-1.5s0.673-1.5,1.5-1.5s1.5,0.673,1.5,1.5S16.827,19.5,16,19.5z M16,17.5 c-0.276,0-0.5,0.225-0.5,0.5s0.224,0.5,0.5,0.5s0.5-0.225,0.5-0.5S16.276,17.5,16,17.5z"/><path d="M23.347,8.387c-0.102,0-0.205-0.031-0.293-0.096c-0.223-0.162-0.273-0.475-0.11-0.698l1.175-1.617 c0.161-0.224,0.474-0.273,0.698-0.11c0.223,0.162,0.273,0.475,0.11,0.698l-1.175,1.617C23.654,8.315,23.502,8.387,23.347,8.387 z"/><path d="M8.653,8.388c-0.155,0-0.307-0.071-0.405-0.206L7.073,6.563C6.911,6.34,6.96,6.027,7.184,5.865 c0.225-0.162,0.537-0.113,0.699,0.11l1.175,1.618C9.219,7.817,9.169,8.13,8.946,8.292C8.857,8.356,8.754,8.388,8.653,8.388z"/><path d="M16.5,6C16.224,6,16,5.776,16,5.5v-2C16,3.224,16.224,3,16.5,3S17,3.224,17,3.5v2 C17,5.776,16.776,6,16.5,6z"/><path d="M16,31C8.832,31,3,25.168,3,18c0-3.343,1.267-6.52,3.566-8.945c0.19-0.2,0.506-0.207,0.707-0.02 c0.201,0.19,0.209,0.507,0.019,0.707C5.169,11.982,4,14.915,4,18c0,6.617,5.383,12,12,12s12-5.383,12-12 c0-3.821-1.76-7.327-4.828-9.621c-0.221-0.165-0.267-0.479-0.101-0.7c0.166-0.221,0.479-0.267,0.7-0.101 C27.094,10.063,29,13.86,29,18C29,25.168,23.168,31,16,31z"/>
                                    <path d="M8.652,8.387c-0.155,0-0.307-0.071-0.405-0.206c-0.163-0.223-0.113-0.536,0.11-0.698 C10.59,5.858,13.232,5,16,5c2.017,0,3.951,0.449,5.747,1.336c0.248,0.122,0.35,0.422,0.227,0.67 c-0.121,0.247-0.42,0.35-0.669,0.227C19.647,6.415,17.862,6,16,6c-2.555,0-4.994,0.792-7.055,2.291 C8.857,8.355,8.754,8.387,8.652,8.387z"/>
                                    <path d="M16,29C9.935,29,5,24.065,5,18S9.935,7,16,7s11,4.935,11,11S22.065,29,16,29z M16,8 C10.486,8,6,12.486,6,18s4.486,10,10,10s10-4.486,10-10S21.514,8,16,8z"/>
                                    <path d="M17.5,4h-1C16.224,4,16,3.776,16,3.5S16.224,3,16.5,3H17V2h-2v0.5C15,2.776,14.776,3,14.5,3 S14,2.776,14,2.5v-1C14,1.224,14.224,1,14.5,1h3C17.776,1,18,1.224,18,1.5v2C18,3.776,17.776,4,17.5,4z"/>
                                </g>
                                </svg>
                            </div>
                        </div>
                        {/* Description */}
                        <div className="flex justify-center items-center w-1/2 grow">
                            <p className="text-lg text-gray-200 bg-[#ffffff] bg-opacity-5 backdrop-blur-sm drop-shadow-md p-6 rounded-2xl shadow-2xl">
                                <span className="text-2xl font-bold block mb-5 text-center">Dive into the telemetry of F1 qualifying!</span>
                                <p className="font-normal">Explore our <span className="font-extrabold tracking-wide">Qualifying Analysis</span> to uncover moments never seen before</p>
                                <div className="mt-6 flex space-x-6">
                                    <div className="flex-1 bg-[#ffffff] bg-opacity-10 rounded-xl shadow-md text-gray-300">
                                        <div className="font-bold bg-[#ffffff] bg-opacity-30 p-2 text-center rounded-t-xl leading-tight">
                                            Performance
                                        </div>
                                        <p className="p-2 text-center">Review top driver performances from qualifying</p>
                                    </div>
                                    <div className="flex-1 bg-[#ffffff] bg-opacity-10 rounded-xl shadow-md text-gray-300">
                                        <div className="font-bold bg-[#ffffff] bg-opacity-30 p-2 text-center rounded-t-xl leading-tight">
                                            Lap Consistency
                                        </div>
                                        <p className="p-2 text-center">Analyze sector times and lap consistency</p>
                                    </div>
                                    <div className="flex-1 bg-[#ffffff] bg-opacity-10 rounded-xl shadow-md text-gray-300">
                                        <div className="font-bold bg-[#ffffff] bg-opacity-30 p-2 text-center rounded-t-xl leading-tight">
                                            Crunching Data
                                        </div>
                                        <p className="p-2 text-center">See how drivers push limits through telemetry</p>
                                    </div>
                                </div>
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-x-16">
                        {/* Description */}
                        <div className="flex justify-center items-center w-1/2 grow">
                            <p className="text-lg text-gray-200 bg-[#ffffff] bg-opacity-5 backdrop-blur-sm drop-shadow-md p-6 rounded-2xl shadow-2xl">
                                <span className="text-2xl font-bold block mb-5 text-center">Race Analysis Highlights</span>
                                <p className="font-normal">Get quick insights from each Grand Prix with <span className="font-extrabold tracking-wide">Race Analysis</span></p>
                                <ul className="mt-6 space-y-4 list-disc list-inside pl-6 text-gray-300">
                                    <li>🔄 <span className="font-bold">Lap-by-lap:</span> Lap time visualization.</li>
                                    <li>🛞 <span className="font-bold">Tyre Strategy:</span> Critical decisions reviewed.</li>
                                    <li>⏱️ <span className="font-bold">Fastest Laps:</span> Key moments during the race.</li>
                                    <li>🏆 <span className="font-bold">Driver Comparisons:</span> Head-to-head stats.</li>
                                </ul>
                            </p>
                        </div>
                        <div className="relative last:after:hidden after:absolute after:top-9 after:bottom-2 after:start-3.5 after:w-[2px] after:-translate-x-[0.5px] after:bg-neutral-300">
                            <div className="relative z-10 size-7 flex justify-center items-center">
                                <svg className="w-6 h-6" enable-background="new 0 0 50 50" height="38px" id="Layer_1" version="1.1" viewBox="0 0 50 50" width="38px"><rect fill="none" height="40" width="40"/><path d="  M25,1C11.767,1,1,11.766,1,25c0,13.234,10.767,24,24,24s24-10.766,24-24C49,11.766,38.233,1,25,1z M25,44C14.524,44,6,35.477,6,25  S14.524,6,25,6s18.999,8.523,18.999,19S35.476,44,25,44z" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2.1111"/><path d="  M43.444,22c-8,0-11.841-5-18.444-5c-6.613,0-9.944,5-18.444,5 M29,42c0,0,0-6.205,0-8c0-2.684,2.26-5,5-5c1.241,0,9.056,0,9.056,0   M6.556,29c0,0,8.341,0,9.444,0c2.885,0,5,2.23,5,5c0,1.857,0,8,0,8" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/><circle cx="25" cy="25" fill="none" r="3" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/></svg>
                            </div>
                        </div>
                            <div className="w-1/2 grow py-8">
                            <img className="transition-transform transform hover:scale-110" src={require("../assets/Home Page/Image 2.png")} />
                        </div>
                    </div>

                    <div className="flex gap-x-16">
                        <div className="w-1/2 py-8">
                            <img className="transition-transform transform hover:scale-110" src={require("../assets/Home Page/Image 3.png")} />
                        </div>
                        <div className="relative last:after:hidden after:absolute after:top-9 after:bottom-2 after:start-3.5 after:w-[2px] after:-translate-x-[0.5px] after:bg-neutral-300">
                            <div className="relative z-10 size-7 flex justify-center items-center">
                                <svg className="w-[25px] h-[25px]" fill="white" enable-background="new 0 0 50 50" height="50px" id="Layer_1" version="1.1" viewBox="0 0 50 50" width="50px"><path d="  M34.504,33.568c-1.801,1.994-4.219,3.42-6.952,3.975" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/><path d="  M37.074,20.751c0.469,1.33,0.725,2.76,0.725,4.249c0,1.49-0.256,2.922-0.726,4.253" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/><path d="  M27.558,12.458c2.731,0.555,5.147,1.98,6.946,3.975" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/><path d="  M15.609,16.305c1.78-1.922,4.145-3.297,6.812-3.843" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/><path d="  M12.892,29.154c-0.447-1.303-0.69-2.7-0.69-4.154c0-1.453,0.242-2.849,0.688-4.15" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/><path d="  M22.576,37.568c-2.748-0.525-5.183-1.931-7.002-3.91" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/><rect fill="none" height="50" width="50"/><path d="  M24.998,7C34.925,7,43,15.074,43,25s-8.075,18-18.002,18C15.072,43,7,34.926,7,25S15.072,7,24.998,7 M25,1C11.746,1,1,11.745,1,25  s10.746,24,24,24s24-10.745,24-24S38.254,1,25,1L25,1z" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/><path d="  M27.299,42.435l0.5-9.719c0.916-0.334,1.747-0.827,2.48-1.444l8.638,4.695 M10.83,35.938l8.833-4.713  c0.767,0.657,1.646,1.17,2.618,1.513l0.576,9.697 M8.594,17.959l8.318,5.597c-0.083,0.471-0.146,0.948-0.146,1.444  s0.062,0.973,0.146,1.444l-8.389,5.645 M22.857,7.565l-0.576,9.697c-0.973,0.342-1.852,0.855-2.618,1.512l-8.709-4.646   M39.179,13.892l-8.899,4.837c-0.733-0.618-1.564-1.111-2.48-1.445l-0.5-9.719 M41.256,32.115l-8.174-5.593  c0.095-0.496,0.155-1.002,0.155-1.522s-0.061-1.026-0.155-1.522l8.15-5.577" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/><circle cx="25" cy="25" fill="none" r="3" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/></svg>              
                            </div>
                        </div>
                        {/* Description */}
                        <div className="flex justify-center items-center w-1/2 grow">
                            <p className="text-lg leading-relaxed text-gray-200 bg-[#ffffff] bg-opacity-5 backdrop-blur-sm drop-shadow-md p-6 rounded-2xl shadow-2xl">
                                <span className="text-2xl font-bold block mb-5 text-center">🛞 Mastering TyreStrategy</span>
                                <p className="font-normal">Use <span className="font-extrabold tracking-wide">Tyre Strategy</span> to gain insights on how tyre choices impact performance</p>
                                <div className="grid grid-cols-1 gap-5 mt-6">
                                <div className="bg-[#ffffff] bg-opacity-10 p-3 rounded-lg shadow-md text-gray-300">
                                    🔍 <span className="font-bold">Compound Usage:</span> Tyre management during races.
                                </div>
                                <div className="bg-[#ffffff] bg-opacity-10 p-3 rounded-lg shadow-md text-gray-300">
                                    ⚡ <span className="font-bold">Stint Analysis</span>: Performance linked to tyre choices.
                                </div>
                                <div className="bg-[#ffffff] bg-opacity-10 p-3 rounded-lg shadow-md text-gray-300">
                                    🛠️ <span className="font-bold">Pit Strategies</span>: Teams’ tactical decisions.
                                </div>
                                </div>
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-x-16">
                        {/* Description */}
                        <div className="flex justify-center items-center w-1/2 grow">
                            <p className="text-lg leading-relaxed text-gray-200 bg-[#ffffff] bg-opacity-5 backdrop-blur-sm drop-shadow-md p-6 rounded-2xl shadow-2xl">
                                <span className="text-2xl font-bold block mb-5 text-center">Explore Lap Data</span>
                                <p className="font-normal"><span className="font-extrabold tracking-wide">Lap Data</span> provides a detailed breakdown of driver performance</p>
                                <ul className="mt-6 space-y-4 list-disc list-inside pl-6 text-gray-300">
                                    <li><span className="font-bold">Lap Time Comparisons:</span> Track driver performance across multiple laps.</li>
                                    <li><span className="font-bold">Interactive Charts:</span> Visualize performance over time.</li>
                                    <li><span className="font-bold">Driver Details:</span> Toggle between drivers for deeper analysis.</li>
                                </ul>
                            </p>
                        </div>
                        <div className="relative last:after:hidden after:absolute after:top-9 after:bottom-0 after:start-3.5 after:w-[2px] after:-translate-x-[0.5px] after:bg-neutral-300">
                            <div className="relative z-10 size-7 flex justify-center items-center">
                                    <svg fill="white" enable-background="new 0 0 32 32" height="32px" id="Layer_1" version="1.1" viewBox="0 0 32 32" width="32px"><g id="time_management_1_"><g><circle cx="19.252" cy="10.146" r="0.499"/><path d="M12.286,25.663c0.104-0.256,0.397-0.377,0.653-0.271c0.253,0.103,0.376,0.397,0.27,0.653 c-0.105,0.254-0.398,0.376-0.652,0.269C12.303,26.209,12.18,25.916,12.286,25.663z"/><circle cx="22.01" cy="11.989" r="0.499"/><circle cx="9.99" cy="24.011" r="0.499"/><circle cx="23.853" cy="14.747" r="0.499"/><circle cx="8.147" cy="21.253" r="0.499"/><circle cx="24.5" cy="18" r="0.5"/><circle cx="7.5" cy="18" r="0.5"/><circle cx="23.854" cy="21.252" r="0.5"/><circle cx="8.146" cy="14.748" r="0.5"/><circle cx="22.011" cy="24.01" r="0.5"/><circle cx="9.989" cy="11.99" r="0.5"/><circle cx="19.253" cy="25.853" r="0.5"/><circle cx="12.747" cy="10.147" r="0.5"/><circle cx="16" cy="26.5" r="0.5"/><circle cx="16" cy="9.5" r="0.5"/></g><path d="M16,17.5c-0.276,0-0.5-0.224-0.5-0.5v-6c0-0.276,0.224-0.5,0.5-0.5s0.5,0.224,0.5,0.5v6 C16.5,17.276,16.276,17.5,16,17.5z"/><path d="M16,19.5c-0.827,0-1.5-0.673-1.5-1.5s0.673-1.5,1.5-1.5s1.5,0.673,1.5,1.5S16.827,19.5,16,19.5z M16,17.5 c-0.276,0-0.5,0.225-0.5,0.5s0.224,0.5,0.5,0.5s0.5-0.225,0.5-0.5S16.276,17.5,16,17.5z"/><path d="M23.347,8.387c-0.102,0-0.205-0.031-0.293-0.096c-0.223-0.162-0.273-0.475-0.11-0.698l1.175-1.617 c0.161-0.224,0.474-0.273,0.698-0.11c0.223,0.162,0.273,0.475,0.11,0.698l-1.175,1.617C23.654,8.315,23.502,8.387,23.347,8.387 z"/><path d="M8.653,8.388c-0.155,0-0.307-0.071-0.405-0.206L7.073,6.563C6.911,6.34,6.96,6.027,7.184,5.865 c0.225-0.162,0.537-0.113,0.699,0.11l1.175,1.618C9.219,7.817,9.169,8.13,8.946,8.292C8.857,8.356,8.754,8.388,8.653,8.388z"/><path d="M16.5,6C16.224,6,16,5.776,16,5.5v-2C16,3.224,16.224,3,16.5,3S17,3.224,17,3.5v2 C17,5.776,16.776,6,16.5,6z"/><path d="M16,31C8.832,31,3,25.168,3,18c0-3.343,1.267-6.52,3.566-8.945c0.19-0.2,0.506-0.207,0.707-0.02 c0.201,0.19,0.209,0.507,0.019,0.707C5.169,11.982,4,14.915,4,18c0,6.617,5.383,12,12,12s12-5.383,12-12 c0-3.821-1.76-7.327-4.828-9.621c-0.221-0.165-0.267-0.479-0.101-0.7c0.166-0.221,0.479-0.267,0.7-0.101 C27.094,10.063,29,13.86,29,18C29,25.168,23.168,31,16,31z"/>
                                        <path d="M8.652,8.387c-0.155,0-0.307-0.071-0.405-0.206c-0.163-0.223-0.113-0.536,0.11-0.698 C10.59,5.858,13.232,5,16,5c2.017,0,3.951,0.449,5.747,1.336c0.248,0.122,0.35,0.422,0.227,0.67 c-0.121,0.247-0.42,0.35-0.669,0.227C19.647,6.415,17.862,6,16,6c-2.555,0-4.994,0.792-7.055,2.291 C8.857,8.355,8.754,8.387,8.652,8.387z"/>
                                        <path d="M16,29C9.935,29,5,24.065,5,18S9.935,7,16,7s11,4.935,11,11S22.065,29,16,29z M16,8 C10.486,8,6,12.486,6,18s4.486,10,10,10s10-4.486,10-10S21.514,8,16,8z"/>
                                        <path d="M17.5,4h-1C16.224,4,16,3.776,16,3.5S16.224,3,16.5,3H17V2h-2v0.5C15,2.776,14.776,3,14.5,3 S14,2.776,14,2.5v-1C14,1.224,14.224,1,14.5,1h3C17.776,1,18,1.224,18,1.5v2C18,3.776,17.776,4,17.5,4z"/>
                                    </g>
                                    </svg>
                            </div>
                        </div>
                        <div className="w-1/2 grow py-16">
                            <img className="transition-transform transform hover:scale-110" src={require("../assets/Home Page/Image 4.png")} />
                        </div>
                    </div>
                </div>
            </section>
        </section>

        <Footer />
    </div>
  );
};

export default Home;
