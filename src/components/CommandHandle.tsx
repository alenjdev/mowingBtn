import { Component } from "react";
import { App, Device, ModuleData } from "@formant/data-sdk";
import { Button } from "@alenjdev/ui-sdk";
interface ICommandHandleProps {
  device: Device | undefined;
}
interface ICommandHandleState {
  isMowing: boolean;
  disable: boolean;
}
export class CommandHandle extends Component<
  ICommandHandleProps,
  ICommandHandleState
> {
  public constructor(props: any) {
    super(props);
    this.state = {
      isMowing: false,
      disable: false,
    };
  }

  public componentDidMount() {
    App.addModuleDataListener(this.receiveModuleData);
  }

  receiveModuleData = async (newValue: ModuleData) => {
    const { isMowing } = this.state;
    const latestState = getLatestData(newValue);
    if (latestState === undefined) return;
    if (typeof latestState === "string") return;
    if (latestState.values[0] === undefined || latestState.values.length === 0)
      return;
    if (isMowing !== latestState.values[0]) {
      this.setState({
        isMowing: latestState.values[0],
        disable: false,
      });
    }
  };

  issueCommand = async () => {
    const { device } = this.props;
    const { isMowing } = this.state;
    if (!device) return;
    device.sendCommand("switch_mowing", isMowing ? "STOP" : "START");
    this.setState({
      disable: true,
    });
    setTimeout(() => {
      this.setState({
        disable: false,
      });
    }, 20000);
  };

  render() {
    const { disable, isMowing } = this.state;

    return (
      <div>
        <Button
          disabled={disable}
          onClick={this.issueCommand}
          type="primary"
          size="large"
        >
          {isMowing ? "STOP mowing" : "START mowing"}
        </Button>
      </div>
    );
  }
}

function getLatestData(
  moduleData: ModuleData
): { keys: string[]; values: boolean[] } | undefined | string {
  const streams = Object.values(moduleData.streams);
  if (streams.length === 0) {
    return "No streams.";
  }
  const stream = streams[0];
  if (stream === undefined) {
    return "No stream.";
  }
  if (stream.loading) {
    return undefined;
  }
  if (stream.tooMuchData) {
    return "Too much data.";
  }

  if (stream.data.length === 0) {
    return "No data.";
  }
  const latestPoint = stream.data[0].points.at(-1);
  if (!latestPoint) {
    return "No datapoints.";
  }

  return latestPoint[1];
}
