export function calculateAvgWindDirection(direction) {
    const totalWindDirection = direction.reduce((acc, direction) => acc + direction, 0);
    const windDirection =  totalWindDirection / direction.length;
    
    const compDirection = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(windDirection / 45) % 8;
    return compDirection[index];
}
  
export function calculateAvgWindSpeed(speed) {
    const totalSpeed = speed.reduce((acc, speed) => acc + speed, 0);
    return totalSpeed / speed.length;
}

export function calculateAvgAirTemp(airTemp) {
    const totalAirTemp = airTemp.reduce((acc, airTemp) => acc + airTemp, 0);
    return totalAirTemp / airTemp.length;
}

export function calculateAvgTrackTemp(trackTemp) {
    const totalTrackTemp = trackTemp.reduce((acc, trackTemp) => acc + trackTemp, 0);
    return totalTrackTemp / trackTemp.length;
}

export function calculateAvgHumidity(humidity) {
    const totalHumidity = humidity.reduce((acc, humidity) => acc + humidity, 0);
    return totalHumidity / humidity.length;
}