import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/user-sidebar/sidebar';
import Navbar from '../../components/user-navbar/navbar';
import Ticker from '../../components/ticker/ticker';
import { Page_Title } from '../../components/general-components/general';
import {Plant_row} from '../../components/dashboard-components/plant';
import styles from './light-intensity.module.css';
import UseHttp from '../../hooks/http-request';
import Chart from 'react-google-charts';

const Light_intensity = () => {
  const [data, setData] = useState([])
  useEffect(() => {
    const data = []
    const getData = async () => {
      try {
        const response = await UseHttp("user-data", "GET", "", {Authorization: "bearer "+ localStorage.getItem("token")})
        const chartData = response.map((item) => {
          if(item.name === "light_intensity") {
            const date = new Date(item.created_at).getHours() + ":" + new Date(item.created_at).getMinutes()
            const value = Number(item.value);
            data.push([date, value]);
          }else {
            return null;
          }
        }).filter((item) => item !== null); 
        
        setData(data);
      } catch(error) {
        console.log(error);
      }
    };
    
    getData();
  }, []);
  return (
    <div className="body">
      <Sidebar />
      <div className="main_container">
        <Navbar />
        <div className="submain_container">
          <Page_Title title="Light Intensity" subtitle="Greenhouse 1" />
          <div className="graph container">
          <Chart
            chartType="LineChart"
            options={{
              hAxis: {
                title: 'Time(24h)',
              },
              vAxis: {
                title: 'Light Intensity(Lux)',
              },
              title: 'Light Intensity over Time',
            }}
            data={[["Date", "Light Intensity"], ...data]}
            width="100%"
            height="60vh"
            legendToggle
          />
          </div>
          <div className={styles.plant}>
            <Plant_row />
          </div>
        </div>
        <Ticker />
      </div>
    </div>
  );
};

export default Light_intensity;
