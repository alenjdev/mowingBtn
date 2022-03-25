import "./App.scss";
import { Fleet, Device, Authentication } from "@formant/data-sdk";
import { CommandHandle } from "./components/CommandHandle";
import { useState, useEffect } from "react";

export const App = () => {
  const [device, setDevice] = useState<Device | undefined>();

  useEffect(() => {
    getCurrentDevice();
  }, []);

  const getCurrentDevice = async () => {
    if (await Authentication.waitTilAuthenticated()) {
      const currentDevice = await Fleet.getCurrentDevice();
      setDevice(currentDevice);
    }
  };

  return (
    <div className="App">
      <CommandHandle device={device} />
    </div>
  );
};
