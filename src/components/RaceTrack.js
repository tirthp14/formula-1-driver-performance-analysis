import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../utils/SessionContext";
import Plot from 'react-plotly.js';

const RaceTrack = ({lapNumber, driverNumber}) => {
    const { qualifyingSessionKey } = useContext(SessionContext);
    const [lapData, setLapData] = useState(null);
    const [trackData, setTrackData] = useState([]);

    useEffect(() => {
        const fetchLapData = async () => {
            if (qualifyingSessionKey && driverNumber && lapNumber) {
                try {
                    const response = await fetch(`https://api.openf1.org/v1/laps?session_key=${qualifyingSessionKey}&driver_number=${driverNumber}&lap_number=${lapNumber}`);
                    const lapData = await response.json();

                    setLapData(lapData[0])    
                } catch (error) {
                    console.log("Error fetching location data: ", error);
                }
            }
        }

        fetchLapData();
    }, [qualifyingSessionKey, driverNumber, lapNumber]);

    useEffect(() => {
        if (lapData) {
            processData(lapData.date_start, lapData.lap_duration);
        }

    }, [lapData]);

    const fetchTrackData = async () => {
        const response = await fetch(`https://api.openf1.org/v1/location?session_key=${qualifyingSessionKey}&driver_number=${driverNumber}`);
        const data = await response.json();

        return data;
    }

    const processData = async (dateStart, lapDuration) => {
        try {
            const data = await fetchTrackData(qualifyingSessionKey, driverNumber)

            const startTime = new Date(dateStart).getTime();
            const endTime = startTime + lapDuration * 1000;

            const startIndex = findClosestIndex(data, startTime);
            const endIndex = findClosestIndex(data, endTime);

            setTrackData(data.slice(startIndex, endIndex + 1));
        } catch (error) {
            console.log("Error fetching Graph Data: ", error);
        }
    }
    
    const findClosestIndex = (data, targetTime) => {
        return data.reduce((closestIndex, entry, index) => {
            const entryTime = new Date(entry.date).getTime();
            const diff = Math.abs(entryTime - targetTime);
            return diff < Math.abs(new Date(data[closestIndex].date).getTime() - targetTime) ? index : closestIndex;
        }, 0)
    }

    const renderPlot = () => {
        if (trackData.length === 0) return null;
    
        const segmentCount = 3;
        const splitSize = Math.floor(trackData.length / segmentCount);
        const segments = Array.from({ length: segmentCount }, (_, i) => {
            const startIndex = i * splitSize;
            const endIndex = i === segmentCount - 1 ? trackData.length : (i + 1) * splitSize;
            return trackData.slice(startIndex, endIndex);
        });
    
        const segmentColors = ['#D60F19', '#07A9D2', '#E4CC28'];
    
        const plotData = segments.map((segment, index) => ({
            x: segment.map(d => d.x),
            y: segment.map(d => d.y),
            z: segment.map(d => d.z),
            mode: 'lines',
            line: { width: 10, color: segmentColors[index] },
            type: 'scatter3d',
            hoverinfo: 'none',
            showlegend: false
        }));
    
        const traceMarkers = {
            x: [trackData[0].x],
            y: [trackData[0].y],
            z: [trackData[0].z],
            mode: 'markers',
            marker: { size: 8, color: '#818589' }, 
            type: 'scatter3d',
            hoverinfo: 'none',
            showlegend: false,
        };
    
        plotData.push(traceMarkers);
    
        const layout = {
            scene: {
                xaxis: { visible: false },
                yaxis: { visible: false },
                zaxis: { visible: false, range: [Math.min(...trackData.map(d => d.z)) - 1, Math.max(...trackData.map(d => d.z)) + 1] },
                aspectmode: 'manual',
                aspectratio: { x: 2, y: 2, z: 0.2 },
                annotations: [
                    {
                        x: trackData[0].x,
                        y: trackData[0].y,
                        z: trackData[0].z,
                        text: 'Start',
                        font: { color: '#FFF' },
                        ax: 0,
                        ay: -45,
                    }
                ],
            },
            margin: { t: 0, b: 0, l: 0, r: 0 },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            autosize: true,
        };
    
        const config = {
            displayModeBar: false
        };
    
        return <Plot data={plotData} layout={layout} config={config} className='w-full h-full'/>;
    };

    return <div className="w-full h-[270px] flex justify-center items-center border-[3px] border-t-0 border-lineBackground">{renderPlot()}</div>
};

export default RaceTrack;