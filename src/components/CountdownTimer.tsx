import { useState } from "react";
import Countdown, { CountdownRenderProps } from "react-countdown";
import classNames from "classnames";

interface Props {
  futureDate: Date;
}

const CountdownTimer: React.FC<Props> = ({ futureDate }) => {
  const [isCompleted, setIsCompleted] = useState(false);

  const renderer = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
  }: CountdownRenderProps) => {
    if (completed) {
      setIsCompleted(true);
      return <div>Times up!</div>;
    } else {
      return (
        <div className="">
          {days} Days {hours} Hours {minutes} Minutes {seconds} Seconds
        </div>
      );
    }
  };

  return (
    <div className={classNames("", { "opacity-50": isCompleted })}>
      <Countdown date={futureDate} renderer={renderer} />
    </div>
  );
};

export default CountdownTimer;
