import Image from "next/image";
import React from "react";

const PreviewSection: React.FC = () => {
  return (
    <div className="w-[50%] flex flex-col items-center leading-5">
      <p className="text-[#9BA6AB] text-xs font-bold">Preview</p>
      <div className="mt-[200px] flex flex-col items-center gap-2">
        <Image src="/icons/preview.svg" width={24} height={20} alt="preview" />
        <p className="text-white text-xs font-bold text-center">
          Preview not available
        </p>
        <p className="text-[#9BA6AB] text-xs font-bold text-center">
          Please click on “Start Cropper” <br />
          and then play video
        </p>
      </div>
    </div>
  );
};

export default PreviewSection;
