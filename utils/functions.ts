export const formatTime = (time: number) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);

  const paddedHours = hours.toString().padStart(2, "0");
  const paddedMinutes = minutes.toString().padStart(2, "0");
  const paddedSeconds = seconds.toString().padStart(2, "0");

  return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
};

export const timeToPercentage = (currentTime: number, duration: number) => {
  if (!currentTime || !duration) return 0;
  const currentTimePerc = (currentTime / duration) * 100;
  return currentTimePerc;
};

export const percentageToTime = (
  currentPercentage: number,
  duration: number
) => {
  const currentTime = (duration * currentPercentage) / 100;
  return currentTime;
};

export const getDimensionsfromRatio = (ratio: string, height: number) => {
  const [widthR, heightR] = ratio.split(":");
  const width = (height * +widthR) / +heightR;
  return width;
};
