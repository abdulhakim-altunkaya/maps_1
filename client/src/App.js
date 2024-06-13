import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import MapComponent from "./components/svg/MapComponent";
import Main from "./components/main/Main";
import ProvinceDetail from "./components/main/ProvinceDetail";
import DistrictDetail from "./components/main/DistrictDetail";

function App() {
  return (
    <div className="App">
      <Router>
        < MapComponent />
        <Routes>
          <Route path="/province/:provinceName" element={<ProvinceDetail/>} />
          <Route path="/district/:districtName" element={<DistrictDetail/>} />
          <Route path="/" element={<Main/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
