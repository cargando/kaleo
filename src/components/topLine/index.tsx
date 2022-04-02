import React, { useCallback, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { STOREs, TStore } from 'store';
import * as URLs from 'router/url';
import { useStores } from '../../hooks/index';
import { TopLineTabs } from 'store/vm';
import { ControlIcons } from './controlIcons';
import './styles.scss';
import { TNavTabItem, NavTabs } from './NavTabs';

import { ReactComponent as KollazhBtn } from 'assets/icons/kollazh_btn.svg';
import { ReactComponent as KalaydoscopeBtn } from 'assets/icons/kaleydoscope_btn.svg';
import { ReactComponent as D3DBtn } from 'assets/icons/3d_btn.svg';
import { Button } from 'components/button';

const iconList: TNavTabItem[] = [
  {
    id: TopLineTabs.MATERIAL,
    title: 'Материалы',
    component: KollazhBtn,
  },
  {
    id: TopLineTabs.KALEIDOSCOPE,
    title: 'Калейдоскоп',
    component: KalaydoscopeBtn,
  },
  {
    id: TopLineTabs.INTERIOR,
    title: 'Трехмерное представление',
    component: D3DBtn,
  },
];

export const TopLine = observer(() => {
  const { App, Materials }: Partial<TStore> = useStores();
  const topLineRef = React.useRef(null);
  const btnRef = React.useRef(null);

  const handleNavClick = () => {
    App.toggleNav();
    topLineRef.current.classList.toggle('top-line_opened');
    btnRef.current.classList.toggle('top-line__nav-btn-inner_active');
  };
  useEffect(() => {
    if (topLineRef.current) {
      if (App.isLeftColOpened) {
        topLineRef.current.classList.toggle('top-line_opened');
      } else {
        topLineRef.current.classList.remove('top-line_opened');
      }
    }
  }, []);

  const handleChangeTab = useCallback((tabIndex: number) => {
    App.setTopLineTab(tabIndex);
  }, []);

  return (
    <>
      <div className="top-line">
        <Link to={URLs.HOME} className="logo">
          <span className="logo__name">nterio</span>
          <span className="logo__dot" />
        </Link>
        <div className="col-4 no-pad" style={{ flexGrow: 0, display: 'flex' }}>
          <div
            ref={topLineRef}
            className="top-line__nav-btn"
            onClick={handleNavClick}
            role="button"
            style={App.isLeftColOpened ? null : { marginLeft: '170px' }}>
            <div
              ref={btnRef}
              className={`top-line__nav-btn-inner ${App.isLeftColOpened ? 'top-line__nav-btn-inner_active' : ''}`}
            />
          </div>
          {Materials.generateButton && <Button className="btn-topline">Генерировать</Button>}
        </div>
        <div className="col-4 no-pad top-line__icons">
          {/* <TabIcons active={App.topLineTab} onChange={handleChangeTab} /> */}
          <NavTabs onChange={handleChangeTab} active={App.topLineTab} items={iconList} />
        </div>
        <div className="col-4 no-pad top-line__icons top-line__icons_right">
          <ControlIcons />
        </div>
      </div>
    </>
  );
});

export default TopLine;
