import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import './styles.scss';
import { STOREs, TStore } from '../../store';
import { useStores } from '../../hooks';

export interface TStepSliderProps {
  content: React.ReactNode[];
}

// TODO - переместить константу или вычислять ширину автоматом от предка
const LEFT_COL_WIDTH = 513;

export const StepSlider = observer(({ content }: TStepSliderProps) => {
  const { App }: Pick<TStore, STOREs.App> = useStores();
  const stepRef = useRef(null);
  const [xCoord, setCoord] = useState<number>(0);

  useEffect(() => {
    const newX = App.leftColStep * LEFT_COL_WIDTH * -1;
    if (newX !== xCoord) {
      setCoord(newX);
    }
  }, [stepRef.current, App.leftColStep]);

  const renderContent = (Component, index) => {
    return (
      <div key={index} className="step__item" data-index={index}>
        <Component />
      </div>
    );
  };
  return (
    <div ref={stepRef} className="step-slider" style={{ left: xCoord }}>
      {content.map(renderContent)}
    </div>
  );
});
