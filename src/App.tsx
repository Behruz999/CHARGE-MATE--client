import './App.css'
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from 'react-router-dom'
import { MainRouter } from './routes/mainRouter'
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from './components/themeProvider/index';

function App() {
  return (
    <>
      <BrowserRouter>
        <ToastContainer />
        <ThemeProvider>
          <MainRouter />
        </ThemeProvider>
      </BrowserRouter>
    </>
  )
}

export default App
