import "./App.css";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal, Typography, Button, Card, CardContent } from "@mui/material";

function App() {
  const [pokemonResults, setPokemonResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pokemonData, setPokemonData] = useState([]);
  const [url, setUrl] = useState("https://pokeapi.co/api/v2/pokemon/?limit=5");
  const [nextUrl, setNextUrl] = useState("");
  const [prevUrl, setPrevUrl] = useState("");
  const [open, setOpen] = useState(false);
  const [pokemonName, setPokemonName] = useState("");
  const [pokemonId, setPokemonId] = useState("");
  const [pokemonDreamWorldSprite, setPokemonDreamWorldSprite] = useState("");
  const [pokemonOfficialArtworkSprite, setPokemonOfficialArtworkSprite] =
    useState("");
  const [pokemonAbilities, setPokemonAbilities] = useState([]);
  const [pokemonTypes, setPokemonTypes] = useState([]);
  const [pokemonSpeciesUrl, setPokemonSpeciesUrl] = useState("");
  const [pokemonDescription, setPokemonDescription] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //gets all pokemons from the api
  const getPokemonResults = () => {
    //the timeout was added just so that the spinner was displayed for a bit
    setLoading(true);
    setTimeout(async function () {
      let response = await axios.get(url);
      setPokemonResults(response.data.results);
      setNextUrl(response.data.next);
      setPrevUrl(response.data.previous);
      getPokemonsData(response.data.results);
      setLoading(false);
    }, 500);
  };
  //


  //stores the data located at the "url" key from each pokemon of the list brought by getPokemonResults
  const getPokemonsData = async (res) => {
    res.map(async (item) => {
      const response = await axios.get(item.url);
      setPokemonData((state) => {
        state = [...state, response.data];
        state.sort((a, b) => (a.id > b.id ? 1 : -1));
        return state;
      });
    });
  };
  //

  //stroes the data located at the "species" key from each pokemon of the list brought by getPokemonResults
  const getPokemonSpeciesInfo = async (url) => {
    let response = await axios.get(pokemonSpeciesUrl);
    setPokemonDescription(response.data.flavor_text_entries[0]["flavor_text"].replace("\n", ""));
    return response;
  };

  //function used to disable the "previous" button if prevUrl is null
  const buttonDisabler = () => {
    if (prevUrl === null) {
      return true;
    }
    return false;
  };
  //

  //useEffects
  useEffect(() => {
    buttonDisabler();
  }, [prevUrl]);

  useEffect(() => {
    getPokemonResults();
  }, [url]);

  useEffect(() => {
    getPokemonSpeciesInfo(pokemonSpeciesUrl);
  }, [pokemonSpeciesUrl]);
  //

  return (
    <div className="App">
      <span className="title">Welcome to PokéInfo</span>

      <div className="spritesContainer">
        {loading ? (
          <div className="spinner"></div>
        ) : (
          pokemonData.map((pokemon) => {
            return (
              <img
                key={pokemon}
                alt="pokemon sprite"
                className="sprite"
                onClick={() => {
                  handleOpen();
                  setPokemonName(pokemon.name);
                  setPokemonId(pokemon.id);
                  setPokemonAbilities(pokemon.abilities);
                  setPokemonTypes(pokemon.types);
                  setPokemonSpeciesUrl(pokemon.species.url);
                  setPokemonDreamWorldSprite(
                    pokemon["sprites"]["other"]["dream_world"]["front_default"]
                  );
                  setPokemonOfficialArtworkSprite(
                    pokemon["sprites"]["other"]["official-artwork"][
                      "front_default"
                    ]
                  );
                }}
                src={
                  pokemon["sprites"]["other"]["dream_world"]["front_default"]
                }
              />
            );
          })
        )}
      </div>

      <div className="buttonsContainer">
        <Button
          disabled={buttonDisabler()}
          className="button"
          variant="text"
          size="large"
          sx={{
            boxShadow: 5,
            fontWeight: "bold",
            color: "#ffcc01",
            backgroundColor: "transparent",
          }}
          onClick={() => {
            setPokemonData([]);
            setUrl(prevUrl);
          }}
        >
          Previous
        </Button>

        <Button
          className="button"
          variant="text"
          sx={{
            color: "#ffcc01",
            backgroundColor: "transparent",
            boxShadow: 5,
            fontWeight: "bold",
          }}
          onClick={() => {
            setPokemonData([]);
            setUrl(nextUrl);
          }}
        >
          Next
        </Button>
      </div>

      <Modal
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(2px)",
        }}
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Card
        className="card"
          style={{
            backgroundColor: "bisque",
            maxWidth: 500,
            height: "fit-content",
            borderRadius: "50px",
            outline: "solid blueviolet",
          }}
        >
          <div className="modalSpritesContainer">
            <img
              className="dreamWorldSprite"
              src={pokemonDreamWorldSprite}
              alt={pokemonName}
            />
            <img
              className="officialArtworkSprite"
              alt={pokemonName}
              src={pokemonOfficialArtworkSprite}
            />
          </div>
          <CardContent>
            <div className="nameAndIdContainer">
              <Typography
                className="pokemonNameLabel"
                gutterBottom
                variant="h5"
                component="div"
              >
                <strong>{pokemonName.toUpperCase()}</strong>
              </Typography>

              <div className="pokemonIdContainer">
                <div className="pokemonIdLabel">ID:</div>
                <div className="idValue">{pokemonId}</div>
              </div>
            </div>

            <Typography
              className="descriptionContainer"
              variant="body2"
              color="text.secondary"
            >
              {pokemonDescription}
            </Typography>

            <div className="sectionContainer">
              <Typography
                className="typesLabel"
                variant="body1"
                color="text.primary"
              >
                Type:{" "}
              </Typography>

              <Typography color="text.secondary">
                {
                  <span className="typesMapContainer">
                    {pokemonTypes.map((type) => {
                      return (
                        <span className="singleElement">
                          {type["type"]["name"].toUpperCase()}
                        </span>
                      );
                    })}
                  </span>
                }
              </Typography>
            </div>

            <div className="sectionContainer">
              <Typography
                className="abilitiesLabel"
                variant="body1"
                color="text.primary"
              >
                Abilities:{" "}
              </Typography>

              <Typography color="text.secondary">
                {
                  <span className="abiltiiesMapContainer">
                    {pokemonAbilities.map((ability) => {
                      return (
                        <span className="singleElement">
                          {ability["ability"]["name"].toUpperCase()}
                        </span>
                      );
                    })}
                  </span>
                }
              </Typography>
            </div>
          </CardContent>
        </Card>
      </Modal>
    </div>
  );
}

export default App;
