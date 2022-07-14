import React from 'react';
import Listcharts from '../../components/listcharts/listcharts'
import Listtel from '../../components/listcharts/listtel'
import './userstati.css'

class Userstati extends React.Component {
    
    render() {
        return (
            <div className="listBox">
                <Listtel className="list"></Listtel>
                <Listcharts className="listchar"></Listcharts>
            </div>      
        );
    }
}

export default Userstati;
