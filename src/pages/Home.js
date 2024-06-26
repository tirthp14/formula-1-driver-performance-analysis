import { SessionProvider } from "../utils/SessionContext";
import SelectRace from "../components/SelectRace";
import FastestLap from "../components/FastestLap";
import FastestPitstop from "../components/FastestPitstop";
import WindData from "../components/WindData";
import StartingGrid from "../components/StartingGrid";
import RaceResults from "../components/RaceResults";

function Home() {
  return (
    <SessionProvider>
      <div className="bg-mainBackground text-white">
        <SelectRace/>
        <FastestLap/>
        <FastestPitstop/>
        <WindData/>
        <StartingGrid/>
        <RaceResults/>
      </div>
    </SessionProvider>
  );
}

export default Home;