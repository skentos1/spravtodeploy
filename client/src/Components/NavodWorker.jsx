import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import ponuka from "../assets/Ponukaprac.jpg";
import prihlasenie from "../assets/prihlasenie.jpg";
import potvrdzovanie from "../assets/Potvrdzovanie.jpg";
import confirm from "../assets/confirm.jpg";
import StatusCarousel from "./StatusCarousel";
import StatusTabs from "./StatusTab";
import useWindowSize from "./useWindowSize";

const steps = [
  {
    title: "Vyberte si prácu z Ponuky Prác.",
    description:
      "Po úspešnej registrácií, si vyberte prácu o ktorú máte záujem z nášho menu Ponuka Prác, po kliknutí na danú prácu sa Vám otvoria podrobnosti o tejto práci.",
    img: ponuka,
    imgAlt: "Create Job Illustration",
  },
  {
    title: "Prihlásenie na prácu.",
    description:
      "Po otvorení podrobností o danej práci, je prihlásenie veľmi jednoduché. Stačí len kliknút na tlačidlo Prihlásiť sa na túto prácu. Budete informovaný mailom, ak si Vás daný tvorca práce vybral.! Pred prihlásením sa uistite, že vo svojom profile máte nastavené správne číslo účtu. Na tento účet Vám totiž prídu peniaze za vykonanú prácu!",
    img: prihlasenie,
    imgAlt: "Prideleni Illustration",
  },
  {
    title: "Vykonanie práce a potvrdenie.",
    description:
      "Ak si Vás tvorca práce vybral pre túto prácu a boli ste informovaný mailom. Čaká Vás ešte vykonanie tejto práce, podľa dátumu na ktorom ste sa dohodli  s tvorcom. Následne musíte potvrdiť dokončenie práce.",
    img: potvrdzovanie,
    imgAlt: "Platba Illustration",
  },
  {
    title: "Potvrdenie práce.",
    description:
      "Po dokončení práce je nutnosť potvrdiť ukončenie práce.Taktiež to nájdete vo svojom profile, Prihlásené práce, kliknutím na danú prácu, a dole tlačidlo Potvrdiť prácu. Ak práca bola dokončená správne, je potrebné potvrdit ako úspešnú. V opačnom prípade je potrebné ju potvrdiť ako neúspešnú. Status práce o jej dokončení sa zmení až, keď ju potvrdia obe strany, čiže aj Tvorca práce ale aj Pracovník práce. Prosím dohliadnite aby dokončenie práce potvrdili obe strany.",
    img: confirm,
    imgAlt: "Complete Illustration",
  },
];

const NavodWorker = () => {
  const size = useWindowSize();
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-green-500 text-sm font-semibold tracking-wide uppercase">
          How It Works
        </h2>
        <h1 className="text-5xl font-extrabold text-gray-800 mt-2 mb-12">
          Vytvorte prácu v priebehu 5 minút
        </h1>

        {steps.map((step, index) => {
          const { ref, inView } = useInView({
            triggerOnce: true,
            threshold: 0.3,
          });

          const animationDirection = index % 2 === 0 ? -100 : 100;

          return (
            <motion.div
              key={index}
              ref={ref}
              className={`flex flex-col md:flex-row ${
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              } items-center mb-12`}
              initial={{ opacity: 0, x: animationDirection }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <div className="text-left md:w-1/2 p-4">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-lg mb-6">{step.description}</p>
              </div>
              <div className="flex justify-center md:w-1/2 p-4">
                <div className="w-4/5 h-auto bg-gray-100 rounded-lg shadow-lg p-4">
                  <img
                    src={step.img}
                    alt={step.imgAlt}
                    className="rounded-lg shadow-md"
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Pridanie status carousel */}
      {size.width < 768 ? <StatusTabs /> : <StatusCarousel />}
    </div>
  );
};

export default NavodWorker;
