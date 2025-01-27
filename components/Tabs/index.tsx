import React, { useState } from "react";

interface ITabs {
  data: {
    key: number;
    label: string;
  }[];
  onChange: (key: number) => void;
}

const Tabs: React.FC<ITabs> = ({ data, onChange }) => {
  const [activeKey, setActiveKey] = useState(1);
  return (
    <div className="w-fit h-9 bg-[#45474E] p-[3px] rounded-md flex items-center">
      {data?.map((ele) => (
        <div
          key={ele.key}
          className={`w-[118px] h-full flex items-center justify-center cursor-pointer ${
            activeKey === ele.key ? "bg-[#37393F] rounded-md" : ""
          }`}
          onClick={() => {
            setActiveKey(ele.key);
            onChange(ele.key);
          }}
        >
          <p className="text-white text-xs text-center leading-4">
            {ele.label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Tabs;
