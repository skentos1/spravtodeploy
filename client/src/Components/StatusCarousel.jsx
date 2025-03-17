import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import uspesna from "../assets/uspesna.jpg";
import neuspesna from "../assets/neuspesna.jpg";
import konfliktna from "../assets/konfliktna.jpg";

const statuses = [
  {
    title: "Práca úspešne dokončená",
    description:
      "Práca nadobúda stav úspešne dokončenej ak obe strany potvrdia, že práca bola úspešne dokončená. V tomto momente sa uvoľnia peniaze z platobného úmyslu a pošlú sa pracovníkovi na účet.",
    img: uspesna,
    imgAlt: "Status 1 Illustration",
  },
  {
    title: "Práca neúspešne dokončená",
    description:
      "Práca nadobúda stav neúspešne dokončenej ak obe strany potvrdia, že práca bola neúspešne dokončená. V tomto momente sa platobný úmysel zruší a peniaze budú vrátene Tvorcovi práce späť na jeho účet.",
    img: neuspesna,
    imgAlt: "Status 2 Illustration",
  },
  {
    title: "Práca v spore",
    description:
      "Práca nadobudne status v spore vtedy, ak sa potvrdenia práce z oboch strán nezhodujú. To znamená, že tvorca práce potvrdil Prácu ako neúspešnú a pracovník ako úspešnú a naopak. V tomto prípade, budú obaja používatelia kontaktovaní naším Admin Tímom, a prešetria tento konflikt o potvrdení práce a následne manuálne ustanovia Stav Práce.",
    img: konfliktna,
    imgAlt: "Status 3 Illustration",
  },
];

const arrowStyles = {
  position: "absolute",
  zIndex: 2,
  top: "calc(50% - 20px)",
  width: 40,
  height: 40,
  cursor: "pointer",
  backgroundColor: "#4a5568",
  color: "#fff",
  border: "none",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "24px",
};

const StatusCarousel = () => {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-green-500 text-sm font-semibold tracking-wide uppercase">
          Statusy Práce
        </h2>
        <h1 className="text-5xl font-extrabold text-gray-800 mt-2 mb-12">
          Prehľad Statusov Práce
        </h1>

        <Carousel
          showThumbs={false}
          infiniteLoop
          useKeyboardArrows
          autoPlay
          renderIndicator={(onClickHandler, isSelected, index, label) => {
            const indicatorStyles = {
              background: isSelected ? "#2d3748" : "#cbd5e0",
              width: 14,
              height: 14,
              display: "inline-block",
              margin: "0 8px",
              borderRadius: "50%",
              cursor: "pointer",
            };
            return (
              <li
                style={indicatorStyles}
                onClick={onClickHandler}
                onKeyDown={onClickHandler}
                value={index}
                key={index}
                role="button"
                tabIndex={0}
                aria-label={`${label} ${index + 1}`}
              />
            );
          }}
          renderArrowPrev={(onClickHandler, hasPrev, label) =>
            hasPrev && (
              <button
                type="button"
                onClick={onClickHandler}
                title={label}
                style={{ ...arrowStyles, left: 15 }}
                className="arrow-prev"
              >
                ‹
              </button>
            )
          }
          renderArrowNext={(onClickHandler, hasNext, label) =>
            hasNext && (
              <button
                type="button"
                onClick={onClickHandler}
                title={label}
                style={{ ...arrowStyles, right: 15 }}
                className="arrow-next"
              >
                ›
              </button>
            )
          }
        >
          {statuses.map((status, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row items-center justify-center md:justify-between mb-12"
            >
              <div className="md:w-5/12 p-4">
                <div className="w-full h-auto bg-gray-100 rounded-lg shadow-lg p-6">
                  <img
                    src={status.img}
                    alt={status.imgAlt}
                    className="rounded-lg shadow-md"
                  />
                </div>
              </div>
              <div className="text-left md:w-6/12 p-4">
                <h3 className="text-3xl font-bold text-gray-800 mb-4">
                  {status.title}
                </h3>
                <p className="text-gray-500 text-lg mb-6">
                  {status.description}
                </p>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default StatusCarousel;
