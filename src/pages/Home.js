import { SessionProvider } from "../utils/SessionContext";
import SelectRace from "../components/SelectRace";

function Home() {
  return (
    <SessionProvider>
      <SelectRace/>
    </SessionProvider>
  );
}

export default Home;