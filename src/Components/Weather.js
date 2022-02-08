import axios from "axios";
import React, { useState } from "react";
import {
  WiDaySunny,
  WiDayCloudy,
  WiThunderstorm,
  WiRainMix,
  WiRain,
  WiSnow,
  WiWindy,
} from "weather-icons-react";

import { temp } from "../suggestion";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState();
  const [loading, setLoading] = useState(false);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const date = new Date();
  const day = days[date.getDay()];
  const fullDate =
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

  const buttonHandler = () => {
    setLoading(true);
    if (city) {
      fetchWeather();
      setCity("");
      setLoading(false);
    } else {
      alert("City cannot be empty");
    }
  };

  let lat, lon;
  const useCurrentLoc = () => {
    navigator.geolocation.getCurrentPosition((ps) => {
      lat = ps.coords.latitude;
      lon = ps.coords.longitude;
      console.log(ps.coords.latitude);
      console.log(ps.coords.longitude);
      fetchWeatherUsingCurrentLoc();
    });
  };

  const fetchWeatherUsingCurrentLoc = () => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=08a457d2f5f8f080bc6623b63a077dec`
      )
      .then((response) => {
        setWeather(response.data);
        setLoading(false);
      });
  };

  const fetchWeather = () => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=08a457d2f5f8f080bc6623b63a077dec`
      )
      .then((response) => {
        setWeather(response.data);
        setLoading(false);
      });
  };

  let icon;
  if (weather) {
    const id = weather.weather[0].id;
    if (id >= 200 && id <= 232) {
      icon = <WiThunderstorm />;
    } else if (id >= 300 && id <= 321) {
      icon = <WiRainMix />;
    } else if (id >= 500 && id <= 521) {
      icon = <WiRain />;
    } else if (id >= 600 && id <= 622) {
      icon = <WiSnow />;
    } else if (id >= 701 && id <= 781) {
      icon = <WiWindy />;
    } else if (id > 800 && id <= 804) {
      icon = <WiDayCloudy />;
    } else if (id === 800) {
      icon = <WiDaySunny />;
    }
  }

  let content;
  if (weather) {
    content = (
      <div className="py-10  flex flex-col justify-center items-center lg:mt-5 mt-7 lg:w-6/12 w-4/5 rounded-2xl bg-white bg-opacity-40 ">
        <h1 className="text-6xl p-2">{weather.name}</h1>
        <div>{weather.sys.country}</div>
        <div className="text-8xl p-4">{icon}</div>
        <div className="text-lg my-2">
          <span>{day},</span>
          <span>&nbsp;{fullDate}</span>
        </div>
        <h1 className="text-lg my-2">{weather.weather[0].main}</h1>
        <span className="text-5xl my-2">
          {(weather.main.temp - 273.15).toPrecision(2)}&deg;C
        </span>
        <span className="text-xl my-2">
          Humidity : {weather.main.humidity}%
        </span>
        <div className="flex justify-between items-center my-2 text-lg">
          <span className="p-2">
            Min : {(weather.main.temp_min - 273.15).toPrecision(4)}&deg;C
          </span>
          <span className="p-2">
            Max : {(weather.main.temp_max - 273.15).toPrecision(4)}&deg;C
          </span>
        </div>
      </div>
    );
  }

  //SEARCH SUGGESTION RELATED LOGIC
  const [suggest, setSuggest] = useState([]);

  const handlerChange = (e) => {
    setCity(e.target.value);
    let suggestion = [];
    console.log(city.length);
    if (city.length >= 2) {
      suggestion = temp.filter((cit) =>
        cit.name.toLowerCase().startsWith(city.toLowerCase())
      );
    }
    console.log(suggestion);
    setSuggest(suggestion.slice(0, 9));
  };

  const suggestedItem = (value) => {
    setCity(value);
  };
  const getSuggestions = () => {
    if (suggest.length === 0) {
      return;
    }
    return (
      <ul className="lg:w-60 p-2 absolute top-20 lg:left-1/3 left-12 w-48 bg-white">
        {suggest.map((item) => (
          <span className="cursor-pointer">
            <li
              key={item.id}
              onClick={() => {
                suggestedItem(item.name);

                setSuggest([]);
              }}
            >
              {item.name}
            </li>
            <hr />
          </span>
        ))}
      </ul>
    );
  };

  return (
    <div className="font-Readex">
      <div className="mt-10">
        <input
          className="lg:w-2/12 p-2 rounded-2xl text-lg sm:w-4/5"
          type="text"
          onChange={handlerChange}
          value={city}
          placeholder="Enter City"
        />

        {city && getSuggestions()}

        <button
          className="ml-2 p-2 border-2 rounded-2xl 
        "
          onClick={buttonHandler}
        >
          Search
        </button>

        <button
          className="lg: ml-2 p-2 border-2 rounded-2xl mt-3 lg:w-auto"
          onClick={useCurrentLoc}
        >
          Use Current Location
        </button>
      </div>

      <div className="flex justify-center items-center ">
        {!loading && content}
        {loading && <h1>Loading...</h1>}
      </div>
    </div>
  );
};
export default Weather;
