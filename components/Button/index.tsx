import React from "react";

interface IButton {
  isDisabled: boolean;
  label: string;
  onClick?: () => void;
}

const Button: React.FC<IButton> = ({ isDisabled, label, onClick }) => {
  return (
    <button
      className={`py-[9px] px-[10px] text-white ${
        !isDisabled ? "bg-[#7C36D6]" : "bg-[#615276]"
      } text-sm font-medium rounded-[10px] cursor-pointer`}
      disabled={isDisabled}
      onClick={() => {
        if (!isDisabled) {
          onClick?.();
        }
      }}
    >
      {label}
    </button>
  );
};

export default Button;
