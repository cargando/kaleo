import React from 'react';
import { observer } from 'mobx-react';
import { SideBlock } from '../sideBlock';
import { DropDown } from '../dropdown';
import { relativeToAbsolute } from 'utils/fn';

export interface TSideBlockProps {
  children?: React.ReactNode;
}

export const MaterialSliders: React.FC<TSideBlockProps> = observer(({ children }) => {
  const renderSubTitles = (s: string | number) => <>{(+s).toFixed()}</>;
  return (
    <SideBlock bubble={5} title="Задайте установки для генерации">
      <div className="flex flex__left" style={{ paddingRight: '15px' }}>
        <DropDown
          title="Количество элементов"
          sliderVal={50}
          minVal={1}
          maxVal={15}
          renderSubTitle={renderSubTitles}
          slider
          hideControl
        />
      </div>
      <div className="flex flex__right" style={{ paddingLeft: '15px' }}>
        <DropDown
          title="Количество текстур"
          sliderVal={14}
          minVal={1}
          maxVal={15}
          renderSubTitle={renderSubTitles}
          slider
          hideControl
        />
      </div>
    </SideBlock>
  );
});

/*



*/
