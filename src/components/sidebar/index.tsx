import './sidebar.css';
import { useContext } from 'react';
import { NavLink, useNavigate, useLocation, } from 'react-router-dom'; // Import Link for routing
import { GiExpense } from "react-icons/gi";
import { Routes, Route } from "react-router-dom";
import { Charges } from '../../views/charges/index';
import { Profile } from '../../views/profile/index';
import { Intial } from '../../views/intial/index';
import { Family } from '../../views/family';
import { CiDark, CiLight } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { MdOutlineFamilyRestroom } from "react-icons/md";
import { FamilyInfo } from '../familyInfo';
import { FamilyMember } from '../familyMember';
import { Reports } from '../../views/reports';
import { ThemeContext } from '../../components/themeProvider/index';
import { TbReport } from "react-icons/tb";

export const Sidebar = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const themeContext = useContext(ThemeContext);

    if (!themeContext) {
        throw new Error('ThemeToggleButton must be used within a ThemeProvider');
    }

    const { isDark, setIsDark } = themeContext;

    const isActive = (path: string) => location.pathname === path ? 'active-link' : 'text-white-70';

    const toggleColor = () => {
        setIsDark(!isDark);
    };

    return (
        <>
            <div className="flex">
                {/* Sidebar for larger screens */}
                <div className={`hidden side_wrapper rounded-tr-top-right-lg rounded-br-bottom-right-lg lg:flex lg:flex-col lg:w-64 ${isDark ? 'bg-gray-800' : 'bg-[#0353e5]'} transition-colors duration-500 in-out-quad text-white fixed top-0 h-screen z-10`}>
                    <div className="px-4 py-5">
                        <NavLink to="/intial">
                            <div className="sid_part py-2 text-white hover:text-white-70 transition-colors duration-500 in-out-quad flex items-center capitalize">
                                <div className="icc">
                                    <span className="p-2 rounded"><RiMoneyDollarCircleLine size={30} /></span>
                                </div>
                                <div className="ww">
                                    <span onClick={() => navigate('/intial')} className="p-2 text-xl rounded">charge-mate</span>
                                </div>
                            </div>
                        </NavLink>
                    </div>

                    <nav className="flex flex-col space-y-2 p-4">
                        <NavLink to="/charges">
                            <div className={`sid_part py-2 hover:text-white ${isActive('/charges')} transition-colors duration-500 in-out-quad flex items-center capitalize`}>
                                <div className="icc">
                                    <span className="p-2 rounded"><GiExpense size={25} /></span>
                                </div>
                                <div className="ww">
                                    <span className="p-2 text-xl rounded">charges</span>
                                </div>
                            </div>
                        </NavLink>

                        <NavLink to="/family">
                            <div className={`sid_part py-2 hover:text-white ${isActive('/family')} transition-colors duration-500 in-out-quad flex items-center capitalize`}>
                                <div className="icc">
                                    <span className="p-2 text-xl rounded"><MdOutlineFamilyRestroom size={25} /></span>
                                </div>
                                <div className="ww">
                                    <span className="p-2 text-xl rounded">my family</span>
                                </div>
                            </div>
                        </NavLink>

                        <NavLink to="/profile">
                            <div className={`sid_part py-2 hover:text-white ${isActive('/profile')} transition-colors duration-500 in-out-quad flex items-center capitalize`}>
                                <div className="icc">
                                    <span className="p-2 text-xl rounded"><CgProfile size={25} /></span>
                                </div>
                                <div className="ww">
                                    <span className="p-2 text-xl rounded">my profile</span>
                                </div>
                            </div>
                        </NavLink>
                        <NavLink to="/reports">
                            <div className={`sid_part py-2 hover:text-white ${isActive('/reports')} transition-colors duration-500 in-out-quad flex items-center capitalize`}>
                                <div className="icc">
                                    <span className="p-2 text-xl rounded"><TbReport size={25} /></span>
                                </div>
                                <div className="ww">
                                    <span className="p-2 text-xl rounded">reports</span>
                                </div>
                            </div>
                        </NavLink>

                        {/* <ThemeToggleButton /> */}
                        <div className="sid_part py-2 hover:text-white cursor-pointer text-white-70 transition-colors duration-500 in-out-quad flex items-center capitalize">
                            <div className="icc">
                                <span className="p-2 text-xl rounded">{isDark ? <CiLight size={25} /> : <CiDark size={25} />}</span>
                            </div>
                            <div className="ww">
                                <a onClick={toggleColor} className="p-2 text-xl rounded cursor-pointer">{isDark ? 'light' : 'dark'} mode</a>
                            </div>
                        </div>

                    </nav>
                </div>

                {/* Sidebar for smaller screens */}
                <div className={`lg:hidden text-lg sm:text-xl md:text-2xl fixed bottom-0 w-full ${isDark ? 'bg-gray-800' : 'bg-[#0353e5]'} transition-colors duration-500 ease-in-out text-white py-2 flex justify-around z-10 rounded-tl-top-left-lg rounded-tr-top-right-lg`}>
                    <NavLink to="/charges" className={`sid_ph_part hover:text-white text-center-webkit ${isActive('/charges')} mx-1 sm:mx-2 md:mx-3 transition-colors duration-500 ease-in-out`}>
                        <GiExpense className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
                        <h1 className="text-xs sm:text-sm md:text-base">Charges</h1>
                    </NavLink>

                    <NavLink to="/family" className={`sid_ph_part hover:text-white text-center-webkit ${isActive('/family')} mx-1 sm:mx-2 md:mx-3 transition-colors duration-500 ease-in-out`}>
                        <MdOutlineFamilyRestroom className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
                        <h1 className="text-xs sm:text-sm md:text-base">Family</h1>
                    </NavLink>

                    <NavLink to="/profile" className={`sid_ph_part hover:text-white text-center-webkit ${isActive('/profile')} mx-1 sm:mx-2 md:mx-3 transition-colors duration-500 ease-in-out`}>
                        <CgProfile className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
                        <h1 className="text-xs sm:text-sm md:text-base">Profile</h1>
                    </NavLink>

                    <div onClick={toggleColor} className={`sid_ph_part hover:text-white text-center-webkit mx-1 sm:mx-2 md:mx-3 transition-colors duration-500 ease-in-out cursor-pointer`}>
                        {isDark ? <CiLight className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" /> : <CiDark className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />}
                        <h1 className="text-xs sm:text-sm md:text-base">{isDark ? 'Light' : 'Dark'}</h1>
                    </div>
                </div>


                {/* Main content */}
                <div className="flex-1 p-4 ml-0 lg:ml-64">
                    <Routes>
                        <Route path="/charges" element={<Charges />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/intial" element={<Intial />} />
                        <Route path="/family" element={<Family />} />
                        <Route path="/familyinfo" element={<FamilyInfo />} />
                        <Route path="/familymember" element={<FamilyMember />} />
                        <Route path="/reports" element={<Reports />} />
                    </Routes>
                </div>
            </div>
        </>
    )
}

