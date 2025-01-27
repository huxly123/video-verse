"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

interface IOptionSelect {
  title: string;
  data: {
    key: number;
    label: string | number;
    value: string | number;
  }[];
  onChange: (val: string | number) => void;
  defaultActiveEle?: {
    key: number;
    label: string | number;
    value: string | number;
  };
}

const OptionSelect: React.FC<IOptionSelect> = ({
  title,
  data,
  onChange,
  defaultActiveEle,
}) => {
  const [activeEle, setActiveEle] = useState(defaultActiveEle ?? data[0]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    onChange(activeEle.value);
  }, [activeEle.value, onChange]);
  return (
    <div className="w-fit">
      {/* Select */}
      <div
        className="bg-[#37393F] border border-[#45474E] py-[7px] px-[10px] rounded-[5px] w-fit flex items-center gap-[5px] cursor-pointer"
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
      >
        <p className="text-white text-xs font-normal leading-4">
          {title} <span className="text-[#9BA6AB]">{activeEle?.label}</span>
        </p>
        <Image
          src="/icons/chevron-bottom.svg"
          alt="chevron-bottom"
          width={12}
          height={12}
        />
      </div>
      {/* Options */}
      {isOpen && (
        <div className="border border-[#45474E] rounded-[5px] h-[100px] overflow-y-scroll">
          {data?.map((ele) => (
            <div
              key={ele.key}
              className={`py-[7px] px-[10px] flex items-center justify-between rounded-[5px] hover:bg-[#45474E] cursor-pointer ${
                activeEle?.key === ele.key ? "bg-[#45474E]" : ""
              } `}
              onClick={() => {
                setActiveEle(ele);
                setIsOpen(false);
              }}
            >
              <p
                className={`${
                  activeEle?.key === ele.key ? "text-white" : "text-[#9BA6AB]"
                } text-xs font-normal leading-4`}
              >
                {ele.label}
              </p>
              {activeEle?.key === ele.key && (
                <Image
                  src="/icons/tick-icon.svg"
                  alt="tick"
                  width={16}
                  height={16}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OptionSelect;
