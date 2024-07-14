import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import MapComponent from "./components/svg/MapComponent";
import Homepage from "./components/main/Homepage";
import ProvinceDetail from "./components/main/ProvinceDetail";
import DistrictDetail from "./components/main/DistrictDetail";

function App() {
  return (
    <div className="App">
      <Router>
        < MapComponent />
        <Routes>
          <Route path="/province/:provinceId" element={<ProvinceDetail/>} />
          <Route path="/district/:districtId" element={<DistrictDetail/>} />
          <Route path="/" element={<Homepage/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
