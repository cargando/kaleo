import React from 'react';
import { observer } from 'mobx-react';
import { SideBlock } from '../sideBlock';
import { DropDown } from '../dropdown';
import { relativeToAbsolute } from 'utils/fn';
import { STOREs, TStore } from '../../store';
import { useStores } from '../../hooks';

export interface TSideBlockProps {
  children?: React.ReactNode;
}

export const MaterialSliders: React.FC<TSideBlockProps> = observer(({ children }) => {
  const { Materials }: Pick<TStore, STOREs.Materials> = useStores();
  const renderSubTitles = (s: string | number) => <>{(+s).toFixed()}</>;
  return (
    <SideBlock title="Установите фильтры для подбора">
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
