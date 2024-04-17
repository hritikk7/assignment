import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"
///debouncing for animal breed search input
const useDebouncedValue = (inputValue, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(inputValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, delay]);

  return debouncedValue;
};

function App() {
  const [jokes, setJokes] = useState([]);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [animalName, setAnimalName] = useState("");
  const [animalDetails, setAnimalDetails] = useState([]);
  const apiKey = "R1TCEGAwcgO0RhPxqLqgPA==yosvDTnIDsoxTGGV";

  const debouncedAnimalName = useDebouncedValue(animalName, 500);

  /////funtion to get jokes
  const getJokes = () => {
    let config = {
      headers: { "X-Api-Key": apiKey },
      method: "get",
      url: "https://api.api-ninjas.com/v1/jokes?limit=" + limit,
    };
    axios
      .request(config)
      .then((res) => {
        let data = res.data;
        console.log("data", data);
        setJokes(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("error occurred", error);
      });
  };

  useEffect(() => {
    getJokes();
  }, []);
  /// funtinn to fetch animal details
  const fetchAnimalDetails = async (name) => {
    try {
      setIsLoading(true);

      let config = {
        headers: { "X-Api-Key": apiKey },
        method: "get",
        url: "https://api.api-ninjas.com/v1/animals?name=" + name,
      };
      const response = await axios.request(config);
      setAnimalDetails(response.data);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching animal details:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedAnimalName) {
      fetchAnimalDetails(debouncedAnimalName);
    }
  }, [debouncedAnimalName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    getJokes();
  };

  const handleInputChange = (event) => {
    setAnimalName(event.target.value);
  };

  console.log("animalDetails", animalDetails);

  return (
    <div className="App">
      <div className="wrapper">
        <h1>Jokes</h1>

        <form onSubmit={handleSubmit}>
          <label>
            Enter jokes to search: 
            <input
              type="number"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
            />
          </label>
          <button type="submit">Fetch Jokes</button>

        </form>

        <h1>Animal Details</h1>
        <form>
          <input
            type="text"
            value={animalName}
            onChange={handleInputChange}
            placeholder="Enter animal name"
          />
        </form>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {jokes.map((item, index) => (
              <li key={index}>{item.joke}</li>
            ))}
          </ul>
        )}

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <h2>Animal breeds</h2>
            <p>
              Enter animal name in the input box to get animal breeds (e.g.
              tiger or bengal tiger)
            </p>
            <ul>
              {animalDetails.map((item, index) => (
                <li key={index}>{item.name}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
