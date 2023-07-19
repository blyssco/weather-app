import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import Form from "./components/Form";
import "./index.css";

const API_KEY = "ac6141f581224e4e3db421b8411770d7";

const App = () => {
  const [nameOfCity, setNameOfCity] = useState("");
  const [nameToDisplay, setNameToDisplay] = useState([]);
  const [res, setRes] = useState([]);
  const [temperatures, setTemperatures] = useState([]);
  const [images, setImages] = useState([]);
  const [dayName, setDayName] = useState([]);
  const [currentInfoWeather, setCurrentInfo] = useState([]);
  const [currentFeelsTemp, setCurrentFeels] = useState([]);
  const [currentWind, setCurrentWind] = useState([]);
  const [currentHumidity, setCurrentHumidity] = useState([]);
  const [currentTemperature, setCurrentTemperature] = useState([]);
  const [infoWeather, setInfo] = useState([]);
  const [feelsTemp, setFeels] = useState([]);
  const [wind, setWind] = useState([]);
  const [humidity, setHumidity] = useState([]);
  const [Currentimage, setCurrentImage] = useState([]);

  ///take image from API
  const fetchRequest = async () => {
    try {
      const response = await axios.get(
        `https://api.unsplash.com/search/photos?page=1&query=${nameOfCity}&client_id=pQPYbaGP-HcpkU51Oty3UfINY-I1gWHDwO0C0cVxjrw&per_page=1`
      );
      const result = response.data.results;
      setRes(result);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  /// Take current info
  const fetchCurrentTemperatures = async () => {
    try {
      const responseCurrent = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${nameOfCity}&appid=${API_KEY}&units=metric`
      );
      const currentTemperature = responseCurrent.data.main.temp + "°C";
      setCurrentTemperature(currentTemperature);
      const Currentimage = responseCurrent.data.weather[0].icon;
      setCurrentImage(Currentimage);
      const currentInfoWeather = responseCurrent.data.weather[0].main;
      setCurrentInfo(currentInfoWeather);
      const currentFeelsTemp =
        "Feels : " + responseCurrent.data.main.feels_like + " °C";
      setCurrentFeels(currentFeelsTemp);
      const currentWind = "Wind : " + responseCurrent.data.wind.speed + " Km/h";
      setCurrentWind(currentWind);
      const currentHumidity =
        "Wind : " + responseCurrent.data.main.humidity + "%";
      setCurrentHumidity(currentHumidity);
    } catch (error) {
      console.error("Error fetching temperatures:", error);
    }
  };

  /// Get temperatures for next 5 days from OpenWeatherMap API
  const fetchTemperatures = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${nameOfCity}&appid=${API_KEY}&units=metric`
      );
      const temperatures = response.data.list
        .filter((item) => item.dt_txt.includes("12:00:00")) // Filter data for 12:00:00 time only
        .map((item) => item.main.temp + "°C");
      setTemperatures(temperatures);
      const image = response.data.list
        .filter((item) => item.dt_txt.includes("12:00:00")) // Filter data for 12:00:00 time only
        .map((item) => item.weather[0].icon);
      setImages(image);
      const infoWeather = response.data.list
        .filter((item) => item.dt_txt.includes("12:00:00"))
        .map((item) => item.weather[0].main);
      setInfo(infoWeather);
      const feelsTemp = response.data.list
        .filter((item) => item.dt_txt.includes("12:00:00"))
        .map((item) => item.main.feels_like + " °C");
      setFeels(feelsTemp);
      const wind = response.data.list
        .filter((item) => item.dt_txt.includes("12:00:00"))
        .map((item) => item.wind.speed + " Km/h");
      setWind(wind);
      const humidity = response.data.list
        .filter((item) => item.dt_txt.includes("12:00:00"))
        .map((item) => item.main.humidity + "%");
      setHumidity(humidity);
    } catch (error) {
      console.error("Error fetching temperatures:", error);
    }
  };

  ///Get current date
  const currentDate = new Date();
  const options = { weekday: "long" };
  const currentDay = currentDate.toLocaleDateString("en-US", options);
  const nextDays = [];
  for (let i = 1; i <= 4; i++) {
    const nextDate = new Date();
    nextDate.setDate(currentDate.getDate() + i);
    const nextDay = nextDate.toLocaleDateString("en-US", options);
    nextDays.push(nextDay);
  }

  /// Execute functions
  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedName = nameOfCity.charAt(0).toUpperCase() + nameOfCity.slice(1);
    fetchRequest();
    fetchTemperatures();
    fetchCurrentTemperatures();
    setNameToDisplay(formattedName + ",");
    setNameOfCity("");
    setDayName([currentDay, ...nextDays]);
  };

  /// execute with enter
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        handleSubmit(e);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [nameOfCity]);

  /// edit background image
  useEffect(() => {
    if (res.length > 0) {
      document.body.style.backgroundImage = `url(${res[0].urls.raw})`;
    } else {
      document.body.style.backgroundImage = "";
    }
  }, [res]);

  return (
    <>
      <header>
        <h1>BlysscoWeather</h1>{" "}
        <Form
          setImg={setNameOfCity}
          nameOfCity={nameOfCity}
          handleSubmit={handleSubmit}
        />
      </header>
      <main>
        <div className="container">
          <div className="container-current-day">
            <div className="container-infos">
              <div>{nameToDisplay}</div>
              <div>{dayName[0]}</div>
            </div>
            <div className="div-temperature">
              {currentTemperature}
              <img
                src={`https://openweathermap.org/img/wn/${images[0]}@2x.png`}
                alt=""
              />
            </div>
            <div className="info-weather-div"> {currentInfoWeather}</div>
            <div className="more-infos">
              <div>{currentFeelsTemp}</div>
              <div>{currentWind}</div>
              <div>{currentHumidity}</div>
            </div>
          </div>
          <div className="container-previsions">
            {temperatures.map((elementInsideOfTemperature, index) => (
              <div key={index} className="element">
                <p>{dayName[index]}</p>
                <p>{elementInsideOfTemperature}</p>
                <img
                  src={`https://openweathermap.org/img/wn/${images[index]}@2x.png`}
                  alt=""
                />
              </div>
            ))}
          </div>
        </div>
      </main>
      <footer></footer>
    </>
  );
};

createRoot(document.getElementById("root")).render(<App />);
