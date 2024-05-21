import { Routes, Route, useLocation } from "react-router-dom";
import { Home } from "../views/home";
import { Register } from "../views/register";
import { Sidebar } from "../components/sidebar";

export const MainRouter = () => {
    const location = useLocation()
  const shouldRenderSidebar = location.pathname !== '/' && location.pathname !== '/register';
    return (
        <>
        {shouldRenderSidebar && <Sidebar />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="register" element={<Register />} />
            </Routes>
        </>
    )
}


// MainRouter.tsx
// import React, { useState } from 'react';
// import { Routes, Route } from 'react-router-dom';
// import { Sidebar } from '../components/sidebar/index';
// import { Home } from '../views/home/index';
// import { Register } from '../views/register/index';
// import { Intial } from '../views/intial/index';

// const MainRouter: React.FC = () => {
//     const [isDarkMode, setIsDarkMode] = useState(false);

//     const toggleColor = () => {
//         setIsDarkMode(prevMode => !prevMode);
//     };

//     return (
//         <div className={`flex ${isDarkMode ? 'bg-gray-800' : 'bg-[#0353e5]'} text-white`}>
//             <Sidebar isDarkMode={isDarkMode} toggleColor={toggleColor} />
//             <Routes>
//                 <Route path="/" element={<Home />} />
//                 <Route path="register" element={<Register />} />
//                 <Route path="initial" element={<Intial />} />
//             </Routes>
//         </div>
//     );
// };

// export default MainRouter;
