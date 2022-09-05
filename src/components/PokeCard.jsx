import React, { useEffect, useRef, useState } from "react";
import analyze from "rgbaster";
import { findColor } from "../utils/utils";
import { PokeLoading } from "./PokeLoading";
const IMG_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";
const MODE = 1;
export const PokeCard = ({ pokemon, index }) => {
  const [color, setColor] = useState("");
  const loadingRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const checkRGB = async (pict) => {
      const extractColor = await analyze(pict, {
        ignore: [
          "rgb(255,255,255)",
          "rgb(0,0,0)",
          "rgb(1,2,2)",
          "rgb(2,3,3)",
          "rgb(17,17,17)",
        ],
      });
      return extractColor[2].color;
    };
    checkRGB(`${IMG_URL}${index}.png`).then((color) => {
      setColor(color);
    });
  }, [index]);

  useEffect(() => {
    if (!shouldLoad && loadingRef.current) {
      const observer = new IntersectionObserver(([{ intersectionRatio }]) => {
        if (intersectionRatio > 0) {
          setShouldLoad(true);
        }
      });
      observer.observe(loadingRef.current);
      return () => observer.disconnect();
    }
  }, [shouldLoad, loadingRef]);

  return (
    <>
      {shouldLoad ? (
        <div
          className={`max-w-sm md:w-full h-fit rounded-xl relative shadow-md`}
          style={{
            backgroundColor:
              MODE === 2 ? findColor(pokemon.types[0].type.name) : color,
          }}
        >
          <div className="w-full">
            <img
              className="mx-auto object-cover w-full p-6"
              src={`${IMG_URL}${index}.png`}
              alt=""
              loading="lazy"
            />
          </div>
          <div className="absolute bottom-2 w-full text-center">
            <span className="text-white text-center lg:text-lg md:text-md text-sm shadow-sm">
              {pokemon.name}
            </span>
          </div>
        </div>
      ) : (
        <div
          className="max-w-sm md:w-full h-fit rounded-xl relative shadow-md"
          ref={loadingRef}
        >
          <PokeLoading />
        </div>
      )}
    </>
  );
};
