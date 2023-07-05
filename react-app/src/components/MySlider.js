import React from "react";
import Slider from "@mui/material/Slider";

const MySlider = ({ name, value, onChange }) => {
  return (
    <div>
      <span>
        {name}: {value.toFixed(1)}
      </span>{" "}
      <Slider
        value={value}
        min={0}
        max={5}
        step={0.1}
        onChange={onChange}
        aria-labelledby="slider-label"
      />
    </div>
  );
};

export default MySlider;
