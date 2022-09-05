import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { getUniqueListBy } from "../utils/utils";
import { PokeCard } from "./PokeCard";

export const Pokedex = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [nextUrl, setNextUrl] = useState();
  const [loading, setLoading] = useState(false);
  const url = "https://pokeapi.co/api/v2/pokemon?offset=0&limit=20";

  const getPokemonList = useCallback(async (url) => {
    setLoading(true);
    const res = await axios.get(url);
    getPokemon(res.data.results);
    // setPokemonList(res.data.results);
    setNextUrl(res.data.next);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPokemon = async (resp) => {
    resp.map(async (item) => {
      const result = await axios.get(item.url);
      setPokemonList((state) => {
        state = [...state, result.data];
        state.sort((a, b) => (a.order > b.order ? 1 : -1));
        return getUniqueListBy(state, "id");
      });
    });
  };
  const handleScroll = useCallback(() => {
    const bottom =
      Math.ceil(window.innerHeight + window.scrollY) >=
      document.documentElement.scrollHeight;
    if (bottom && nextUrl !== null) {
      getPokemonList(nextUrl);
    }
  }, [getPokemonList, nextUrl]);

  useEffect(() => {
    getPokemonList(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 px-3">
        {pokemonList.map((pokemon, i) => (
          <div
            className="p-2"
            key={pokemon.order}
            // style={{ order: pokemon.order }}
          >
            <PokeCard pokemon={pokemon} loading={loading} index={pokemon.id} />
          </div>
        ))}
      </div>
    </>
  );
};
