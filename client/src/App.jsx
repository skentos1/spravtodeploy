import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './Components/SignUp';
import Login from './Components/Login';
import Home from './Components/Home';
import Navbar from './Components/Navbar';
import PonukyHome from './Components/PonukyHome';
import './index.css';
import Sluzby from './Components/Sluzby';
import Counters from './Components/Counter';
import Footer from './Components/Footer';
import CreateJob from './Components/CreateJob';
import JobSuccess from './Components/JobSuccess';
import PonukaPrac from './Components/PonukaPrac';
import JobDetail from './Components/JobDetail';
import MyAccount from './Components/MyAccount'; // Import the new MyAccount component

function App() {
  return (
    <div className='min-h-screen w-full'>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<>
            <Home />
            <PonukyHome />
            <Sluzby />
            <Counters />
          </>} />
          <Route path='/login' element={<Login />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/create-job' element={<CreateJob />} />
          <Route path='/job-success' element={<JobSuccess />} />
          <Route path='/prace' element={<PonukaPrac />} />
          <Route path='/job/:id' element={<JobDetail />} />
          <Route path='/my-account' element={<MyAccount />} /> {/* Add the new route */}
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
