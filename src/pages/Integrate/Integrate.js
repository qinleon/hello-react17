import React, { useState } from 'react';
import { Alert } from 'antd';
import Bigsearch from './components/Bigsearch';
function Integrate() {
  const [showAlert, setShowAlert] = useState(false);
  const [runTime, setRunTime] = useState(0);
  return (
    <div className="container">
      {showAlert ? <Alert message={`用时 ${runTime}s`} type="success" show-icon></Alert> : null}
      <Bigsearch></Bigsearch>
    </div>
  );
}

export default Integrate;
