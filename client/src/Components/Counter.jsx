import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useInView } from 'react-intersection-observer';

const Counter = ({ end, label }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3, // Adjust the threshold as needed
  });

  const { number } = useSpring({
    from: { number: 0 },
    number: inView ? end : 0,
    delay: 300,
    config: { mass: 1, tension: 170, friction: 26 },
  });

  return (
    <div ref={ref} className="text-center">
      <animated.div className="text-4xl font-bold text-white">
        {number.to((n) => n.toFixed(0))}
      </animated.div>
      <div className="text-sm font-light text-white">{label}</div>
    </div>
  );
};

const Counters = () => {
  const countersData = [
    { end: 48, label: 'UCHADZACOV' },
    { end: 120, label: 'REGISTROVANYCH UZIVATELOV' },
    { end: 89, label: 'ÚSPEŠNÝCH PRACI' },
    { end: 1098, label: 'NAVSTEVNIKOV' },
    { end: 137, label: 'VYTVORENYCH PONUK' },
  ];

  return (
    <div className="flex justify-center items-center bg-gray-700 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {countersData.map((counter, index) => (
          <Counter key={index} end={counter.end} label={counter.label} />
        ))}
      </div>
    </div>
  );
};

export default Counters;
