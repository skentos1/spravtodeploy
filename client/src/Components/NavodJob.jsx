import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import CreateJob from "../assets/CreateJob.jpg";
import Prideleni from "../assets/Prideleni.jpg";
import Platba from "../assets/platba.jpg";
import PotvrdeniePrace from "../assets/potvrdeniePrace.jpg";
import StatusCarousel from "./StatusCarousel";
import StatusTabs from "./StatusTab";
import useWindowSize from "./useWindowSize";

const steps = [
  {
    title: "Kliknite na tlačidlo Vytvoriť Prácu.",
    description:
      "Po kliknutí sa Vám zobrazí formulár na vyplnenie. V tomto formulári vyplnte potrebné informácie ohľadom práce, taktiež potrebných kontaktných informácií na Vás.",
    img: CreateJob,
    imgAlt: "Create Job Illustration",
  },
  {
    title: "Voľba pracovníka pre Vašu prácu.",
    description:
      "Po úspešnom vytvorení práce, ju nájdete vo svojom profile v sekcii Moje práce. Ak sa Vám niekto na túto prácu prihlási, budete o tom informovaný mailom. Následne si môžete vybrať jedného pracovníka, kliknutím na jeho profil sa Vám zobrazia informácie o tomto používateľovi.",
    img: Prideleni,
    imgAlt: "Prideleni Illustration",
  },
  {
    title: "Potvrdenie pracovníka a platba.",
    description:
      "Potvrdením a následnou platbou kartou, sa vytvorí platobný úmysel. Peniaze Vám nebudú ihneď stiahnuté z účtu, ale až po úspešnom dokončení a potvrdení práce. Po tomto kroku, bude pracovník oboznámený, že ste ho vybrali pre túto Prácu.",
    img: Platba,
    imgAlt: "Platba Illustration",
  },
  {
    title: "Práca je dokončená a odovzdaná.",
    description:
      "Po dokončení práce je nutnosť potvrdiť ukončenie práce.Taktiež to nájdete vo svojom profile, Moje Práce, kliknutím na danú prácu, a dole tlačidlo Potvrdiť prácu. Ak práca bola dokončená správne, je potrebné potvrdit ako úspešnú. V opačnom prípade je potrebné ju potvrdiť ako neúspešnú. Status práce o jej dokončení sa zmení až, keď ju potvrdia obe strany, čiže aj Tvorca práce ale aj Pracovník práce.",
    img: PotvrdeniePrace,
    imgAlt: "Complete Illustration",
  },
];

const NavodJob = () => {
  const size = useWindowSize();

  return (
    <div className="bg-white py-16 w-full flex flex-col items-center">
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
              transition={{ duration: 0.5, delay: 0.3 * index }}
            >
              <div className="text-left md:w-1/2 p-4">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-lg mb-6">{step.description}</p>
              </div>
              <div className="flex justify-center md:w-1/2 p-4">
                <div className="w-full sm:w-4/5 h-auto bg-gray-100 rounded-lg shadow-lg p-4">
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

      {/* Conditional rendering of the status component */}
      {size.width < 768 ? <StatusTabs /> : <StatusCarousel />}
    </div>
  );
};

export default NavodJob;
