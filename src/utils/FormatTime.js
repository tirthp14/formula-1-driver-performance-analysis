export const formatLapTime = (lapTime) => {
    const totalSeconds = Math.floor(lapTime);
    const milliseconds = Math.round((lapTime - totalSeconds) * 1000);
  
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
  
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(3, '0')}`;
  
    return formattedTime;
}