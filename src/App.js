import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Map from './Map';
import Reviewpage from './Reviewpage';
import Mypage from './Mypage';
import Sidebar from './Sidebar';

function App() {
  return (
    <BrowserRouter>
      {/* 🔧 여기 flex container 추가 */}
      <div style={{ display: 'flex', height: '100vh' }}>
        <Sidebar />
        {/* 🔁 페이지 전환이 이 영역에서 일어남 */}
        <div style={{ flex: 1, padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Map />} />
            <Route path="/Reviewpage" element={<Reviewpage />} />
            <Route path="/Mypage" element={<Mypage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
