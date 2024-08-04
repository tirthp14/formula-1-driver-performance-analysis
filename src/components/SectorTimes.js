import React from 'react';

const SegmentsDivs = ({ selectedLap }) => {
  const data = [
    { name: 'Sector 1', duration: selectedLap?.duration_sector_1, segments: selectedLap?.segments_sector_1 },
    { name: 'Sector 2', duration: selectedLap?.duration_sector_2, segments: selectedLap?.segments_sector_2 },
    { name: 'Sector 3', duration: selectedLap?.duration_sector_3, segments: selectedLap?.segments_sector_3 },
  ];

  const colors = {
    0: 'bg-white', // not available
    2048: 'bg-yellow-500', // yellow sector
    2049: 'bg-green-500', // green sector
    2050: 'bg-blue-500', // ?
    2051: 'bg-purple-500', // purple sector
    2052: 'bg-pink-500', // ?
    2064: 'bg-red-500', // pitlane
    2068: 'bg-black', // ?
  };

  return (
    <div className="flex flex-row gap-4 items-center">
      {data.map((sector, sectorIndex) => (
        <div key={sectorIndex} className="mb-6 text-center">
          <h3 className="text-xl font-bold">
            {sector.name}
          </h3>
          <h2 className='mb-1.5'>
            {sector.duration}s
          </h2>
          <div className="flex gap-[2px] w-fit bg-transparent">
            {sector.segments?.map((value, segmentIndex) => (
              <div
                key={segmentIndex}
                className={`w-[14px] h-1 ${colors[value]}`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SegmentsDivs;