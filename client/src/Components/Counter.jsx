import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useInView } from 'react-intersection-observer';

const Counter = ({ end, label }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
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
    { end: 48, label: 'UCHÁDZAČOV' },
    { end: 120, label: 'REGISTROVANÝCH UŽÍVATEĽOV' },
    { end: 89, label: 'ÚSPEŠNÝCH PRACÍ' },
    { end: 1098, label: 'NÁVŠTEVNÍKOV' },
    { end: 137, label: 'VYTVORENÝCH PONÚK' },
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
