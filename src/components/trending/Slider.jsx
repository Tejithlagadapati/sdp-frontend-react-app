import { useEffect, useState } from "react";

const Slider = ({ items }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [items]);

  return (
    <div className="slider">

      <img
        src={items[index].image}
        alt={items[index].title}
      />

      <div className="slider-text">
        <h2>{items[index].title}</h2>
        <p>{items[index].category}</p>
      </div>

    </div>
  );
};

export default Slider;