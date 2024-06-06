import React, { useEffect, useState } from 'react';
import './main.css';
import clockLogo from './images/clock_logo.png';
import wakeUpLogo from './images/wake_up.svg';
import lunchTimeLogo from './images/lunch_time.svg';
import napTimeLogo from './images/nap_time.svg';
import wakeupImage from './images/wakeup_image.svg';
import lunchImage from './images/lunch_image.svg';
import goodnightImage from './images/goodnight_image.svg';
import defaultImage from './images/d_clock.jpg';

function TimeSelect(props) {
  const { id, onChange } = props;

  const timeOptions = [];
  for (let i = 1; i < 24; i++) {
    const startTime = `${i === 12? '12' : i < 12? i : i - 12}${i < 12? 'AM' : 'PM'}`;
    const endTime = `${i === 23? '12' : i + 1 < 12? i + 1 : i + 1 - 12}${i < 11? 'AM' : 'PM'}`;
    timeOptions.push(<option value={`${startTime} - ${endTime}`}>{`${startTime} - ${endTime}`}</option>);
  }

  return (
    <select id={id} onChange={onChange}>
      <option value="default">Set Time</option>
      {timeOptions}
    </select>
  );
}

function getHourFromTimeSlot(timeSlot) {
    if (timeSlot === 'default') return null;
    const [startTime, endTime] = timeSlot.split(' - ');
    const hour = parseInt(startTime.split(' ')[0]);
    return hour === 12? 12 : hour;
  }
  

function Clock() {
  const [time, setTime] = useState({
    hour: 0,
    min: 0,
    sec: 0,
    convention: 'AM'
  });

  const [selectedTimes, setSelectedTimes] = useState({
    wakeTime: 'default',
    lunchTime: 'default',
    napTime: 'default'
  });

  const [display, setDisplay] = useState({
    wakeupTime: '',
    lunchTime: '',
    napTime: '',
    image: defaultImage,
    message: ''
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const x = new Date();
      setTime({
        hour: x.getHours(),
        min: x.getMinutes(),
        sec: x.getSeconds(),
        convention: x.getHours() >= 12? 'PM' : 'AM'
      });

      const currentHour = x.getHours();

      const wakeHour=getHourFromTimeSlot(selectedTimes.wakeTime);
      console.log(wakeHour);
      const lunchHour=getHourFromTimeSlot(selectedTimes.lunchTime);
      console.log(lunchHour);
      const napHour=getHourFromTimeSlot(selectedTimes.napTime);
      console.log(napHour);
      
      if (wakeHour === currentHour) {
        setDisplay({
          ...display,
          image: wakeupImage,
          message: 'Good Morning'
        });
      } else if (lunchHour === currentHour) {
        setDisplay({
          ...display,
          image: lunchImage,
          message: 'Lunch Time'
        });
      } else if (napHour === currentHour) {
        setDisplay({
          ...display,
          image: goodnightImage,
          message: 'Nap Time ~ Good Night'
        });
      } else {
        setDisplay({
          ...display,
          image: defaultImage,
          message: ''
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedTimes, display]);

  const handleSetTimer = () => {
    const y = new Date();
    const currentHour = y.getHours();

    if (selectedTimes.wakeTime === 'default'&& 
        selectedTimes.lunchTime === 'default' && 
        selectedTimes.napTime === 'default') {
      alert("Please Set Time First");
      return;
    }
    
    let newDisplay = {...display };
    newDisplay.wakeupTime =  `Wake Up Time : ${selectedTimes.wakeTime === 'default'? 'Not Set' : selectedTimes.wakeTime}` ;
    newDisplay.lunchTime =  `Lunch Time : ${selectedTimes.lunchTime === 'default'? 'Not Set' : selectedTimes.lunchTime}`;
    newDisplay.napTime = `Nap Time : ${selectedTimes.napTime === 'default'? 'Not Set' : selectedTimes.napTime}`;

    setDisplay(newDisplay);
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    setSelectedTimes({
     ...selectedTimes,
      [id]: value
    });
  };

  return (
    <div>  
    <div className="App">
      <div className="first-container">
        <div className="clock-logo">
          <img src={clockLogo} alt="clock-logo-img" />
        </div>
        <div className="time-first">
          <h2>TIME</h2>
          <div className="time-level">
            <h3>{time.hour}</h3>
            <span>hours</span>
          </div>
          :
          <div className="time-level">
            <h3>{time.min}</h3>
            <span>mins</span>
          </div>
          :
          <div className="time-level">
            <h3>{time.sec}</h3>
            <span>secs</span>
          </div>
          <div className="time-schedule">
            <h3>{time.convention}</h3>
          </div>
          <div className="time-second"></div>
          <div className="time-third"></div>
        </div>
      </div>
      <div className="second-container">
        <div className="main-container">
          <div className="content">
            <div className="time-panel">
              <img src={wakeUpLogo} alt="wake-up-logo" />
              <h3>Set wake up time</h3>
              <TimeSelect id="wakeTime" onChange={handleChange} />
            </div>

            <div className="straight-line"></div>
            <div className="time-panel">
              <img src={lunchTimeLogo} alt="lunch-time-logo" />
              <h3>Set lunch time</h3>
              <TimeSelect id="lunchTime" onChange={handleChange} />
            </div>

            <div className="straight-line"></div>
            <div className="time-panel">
              <img src={napTimeLogo} alt="nap-time-logo" />
              <h3>Set nap time</h3>
              <TimeSelect id="napTime" onChange={handleChange} />
            </div>
          </div>

          <button className="click" type="submit" onClick={handleSetTimer}>Party Time!</button>
          <div id="base" style={{ display: display.wakeupTime || display.lunchTime || display.napTime? 'block' : 'none' }}>
            <h2>{display.wakeupTime}</h2>
            <h2>{display.lunchTime}</h2>
            <h2>{display.napTime}</h2>
          </div>
        </div>

        <div className="third-view">
          <h2 id="img-text">{display.message}</h2>
          <img src={display.image} alt="icon" id="image" />
        </div>
      </div>
    </div>
    </div>
  );
}

export default Clock;