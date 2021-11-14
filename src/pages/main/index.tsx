import React from 'react';
import { STOREs, TStore } from 'store';
import { useStores } from 'hooks';
import { TopLineTabs } from 'store/vm';
import { MaterialTab, KaleidoscopeTab, InteriorTab } from './tabs';
import { TNavTabItem } from 'components/topLine/NavTabs';
import { observer } from 'mobx-react';

interface TTabsContent extends Omit<TNavTabItem, 'component'> {
  tab: React.ElementType;
}

const tabsContent: TTabsContent[] = [
  {
    id: TopLineTabs.MATERIAL,
    tab: MaterialTab as React.ElementType,
    title: 'Материалы',
  },
  {
    id: TopLineTabs.KALEIDOSCOPE,
    tab: KaleidoscopeTab as React.ElementType,
    title: 'Калейдоскоп',
  },
  {
    id: TopLineTabs.INTERIOR,
    tab: InteriorTab,
    title: 'Интерьер',
  },
];

const MainPage = observer((props) => {
  const { App }: Pick<TStore, STOREs.App> = useStores();
  const currentTab = tabsContent.filter((item) => item.id === App.activeTab);
  const Component = currentTab[0]?.tab;

  return <Component />;
});

export default MainPage;
