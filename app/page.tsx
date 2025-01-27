"use client";
import Button from "@/components/Button";
import OptionSelect from "@/components/OptionSelect";
import PreviewSection from "@/components/PreviewSection";
import Tabs from "@/components/Tabs";
import CustomVideoPlayer from "@/components/Video";
import {
  aspectRatioOptionsData,
  playBackOptionsData,
  tabsData,
} from "@/utils/constants";
import { useRef, useState } from "react";

export default function Home() {
  const [playBackSpeed, setPlayBackSpeed] = useState(1);
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [activeTab, setActiveTab] = useState(1);
  const [showCropper, setShowCropper] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [previewData, setPreviewData] = useState<
    {
      timeStamp: number;
      coordinates: number[];
      volume: number;
      playbackRate: number;
    }[]
  >([]);

  const handleStartCropper = () => {
    setShowCropper(true);
  };

  const handleRemoveCropper = () => {
    setShowCropper(false);
    setPreviewData([]);
  };

  const downloadFile = () => {
    const jsonString = JSON.stringify(previewData, null, 2); // Convert data to JSON
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "data.json"; // File name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url); // Clean up the URL object
  };

  const handleGeneratePreview = () => {
    downloadFile();
    setShowCropper(false);
    setPreviewData([]);
  };

  return (
    <div className="bg-black w-[100vw] h-[100vh] flex justify-center items-center">
      <div className="w-[1082px] h-[688px] bg-[#37393F] rounded-[10px] px-5 py-6 flex flex-col justify-between">
        <div>
          <div className="w-full flex justify-between mb-6">
            <p className="text-white text-base font-bold leading-5">Cropper</p>
            <Tabs
              data={tabsData}
              onChange={(key) => {
                setActiveTab(key);
              }}
            />
            <div />
          </div>
          <div className="w-full flex">
            {/* Left Section */}
            <div className="w-[50%]">
              <CustomVideoPlayer
                playBackSpeed={playBackSpeed}
                showCropper={showCropper}
                aspectRatio={aspectRatio}
                ref={canvasRef}
                setPreviewData={setPreviewData}
              />
              <div className="mt-4 flex gap-2">
                <OptionSelect
                  data={playBackOptionsData}
                  title="Playback Speed"
                  onChange={(val) => {
                    setPlayBackSpeed(val as number);
                  }}
                  defaultActiveEle={playBackOptionsData?.[3]}
                />
                <OptionSelect
                  data={aspectRatioOptionsData}
                  title="Cropper Aspect Ratio"
                  onChange={(val) => {
                    setAspectRatio(val as string);
                  }}
                  defaultActiveEle={aspectRatioOptionsData?.[4]}
                />
              </div>
            </div>
            {/* Right Section */}
            {showCropper ? (
              <div className="inset-0 flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  className="object-cover rounded-lg shadow-md"
                />
              </div>
            ) : (
              <PreviewSection />
            )}
          </div>
        </div>
        <div>
          <div className="w-full h-[1px] bg-[#494C55]" />
          <div className="flex justify-between items-center mt-5">
            <div className="flex items-center gap-2">
              <Button
                label="Start Cropper"
                isDisabled={showCropper}
                onClick={handleStartCropper}
              />
              <Button
                label="Remove Cropper"
                isDisabled={!showCropper}
                onClick={handleRemoveCropper}
              />
              <Button
                label="Generate Preview"
                isDisabled={!(showCropper && previewData.length > 0)}
                onClick={handleGeneratePreview}
              />
            </div>
            <div className="w-[87px] h-9 flex justify-center items-center bg-[#45474E] rounded-[10px] cursor-pointer">
              <p className="text-white font-medium text-sm">Cancel</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
