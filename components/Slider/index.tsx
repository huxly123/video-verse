import React, { useEffect, useState } from "react";
import styles from "./slider.module.scss";

interface ISlider {
  min: string;
  max: string;
  step: string;
  onChange?: (val: string) => void;
  defaultValue?: string;
  width?: string;
  customValue?: string;
}

const Slider: React.FC<ISlider> = ({
  max,
  min,
  step,
  defaultValue,
  onChange,
  width,
  customValue,
}) => {
  const [inputValue, setInputValue] = useState(defaultValue ?? "0");

  useEffect(() => {
    if (customValue !== undefined) setInputValue(customValue);
  }, [customValue]);
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={inputValue}
      onChange={(e) => {
        onChange?.(e.target.value);
        setInputValue(e.target.value);
      }}
      className={styles.slider}
      style={{
        backgroundSize: `${
          ((+inputValue - +min) * 100) / (+max - +min) < 0
            ? 0
            : ((+inputValue - +min) * 100) / (+max - +min)
        }% 100%`,
        width: width,
      }}
    />
  );
};

export default Slider;
