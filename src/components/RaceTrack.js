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

        const xValues = trackData.map(d => d.x);
        const yValues = trackData.map(d => d.y);
        const zValues = trackData.map(d => d.z);

        const trace1 = {
            x: xValues,
            y: yValues,
            z: zValues,
            mode: 'lines',
            line: { width: 10, color: '#FFF' },
            type: 'scatter3d',
            hoverinfo: 'none'
        };

        const traceMarkers = {
            x: [xValues[0]],
            y: [yValues[0]],
            z: [zValues[0]],
            mode: 'markers',
            marker: { size: 8, color: 'green', opacity: 0.8 },
            type: 'scatter3d',
            name: 'Start Line',
            hoverinfo: 'none'
        };

        const plotData = [trace1, traceMarkers];

        const layout = {
            scene: {
                xaxis: { visible: false },
                yaxis: { visible: false },
                zaxis: { visible: false, range: [Math.min(...zValues) - 1, Math.max(...zValues) + 1] },
                aspectmode: 'manual',
                aspectratio: { x: 2, y: 2, z: 0.2 },
                annotations: [
                    {
                        x: xValues[0],
                        y: yValues[0],
                        z: zValues[0],
                        text: 'Start',
                        showarrow: true,
                        arrowhead: 2,
                        ax: 0,
                        ay: -75,
                    }
                ],
            },
            margin: { t: 0, b: 0, l: 0, r: 0 },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            showlegend: true,
        };

        return <Plot data={plotData} layout={layout} />;
    };

    return <div>{renderPlot()}</div>
};

export default RaceTrack;