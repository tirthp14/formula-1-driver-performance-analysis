import { SessionProvider } from "../utils/SessionContext";
import SelectRace from "../components/SelectRace";
import FastestLap from "../components/FastestLap";
import FastestPitstop from "../components/FastestPitstop";
import WindData from "../components/WindData";

function Home() {
  return (
    <SessionProvider>
      <div className="bg-mainBackground text-white">
        <SelectRace/>
        <FastestLap/>
        <FastestPitstop/>
        <WindData/>
      </div>
    </SessionProvider>
  );
}

export default Home;