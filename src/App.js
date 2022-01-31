import "./App.css";
import Weather from "./Components/Weather";
import bg from "./images/Bg.jpeg";
function App() {
  return (
    <div className="App">
      <div
        style={{ backgroundImage: `url(${bg})` }}
        className="bg-cover w-full h-screen overflow-auto"
      >
        <Weather />
      </div>
    </div>
  );
}

export default App;
