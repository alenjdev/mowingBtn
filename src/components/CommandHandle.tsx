import { CommandIssuer } from "./CommandIssuer";
import { FC, useEffect, useState } from "react";
import { App, Device, ModuleData } from "@formant/data-sdk";

interface ICommandHandleProps {
  device: Device | undefined;
}

export const CommandHandle: FC<ICommandHandleProps> = ({ device }) => {
  const [isMowing, setIsMowing] = useState<boolean>();

  useEffect(() => {
    App.addModuleDataListener(receiveModuleData);
  }, [device]);

  const receiveModuleData = async (newValue: ModuleData) => {
    const latestState = getLatestJsonUrl(newValue);
    if (latestState === undefined) return;
    if (isMowing !== latestState.values[0]) setIsMowing(latestState.values[0]);
  };

  return (
    <div>
      {isMowing ? (
        <CommandIssuer
          device={device!}
          label="STOP Mowing"
          params="STOP"
          command="switch_mowing"
        />
      ) : (
        <CommandIssuer
          device={device!}
          label="START Mowing"
          params="START"
          command="switch_mowing"
        />
      )}
    </div>
  );
};

function getLatestJsonUrl(
  moduleData: ModuleData
): { keys: string[]; values: boolean[] } | undefined {
  const streams = Object.values(moduleData.streams);
  if (streams.length === 0) {
    throw new Error("No streams.");
  }
  const stream = streams[0];
  if (stream === undefined) {
    throw new Error("No stream.");
  }
  if (stream.loading) {
    return undefined;
  }
  if (stream.tooMuchData) {
    throw new Error("Too much data.");
  }

  if (stream.data.length === 0) {
    throw new Error("No data.");
  }
  const latestPoint = stream.data[0].points.at(-1);
  if (!latestPoint) {
    throw new Error("No datapoints.");
  }

  return latestPoint[1];
}
