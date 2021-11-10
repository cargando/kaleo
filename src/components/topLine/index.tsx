import React, { useCallback } from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { Link } from 'react-router-dom';
import { STOREs, TStore } from 'store';
import * as URLs from 'router/url';
import { useStores } from '../../hooks/index';
import { TabIcons } from './tabIcons';
import { ControlIcons } from './controlIcons';
import './styles.scss';

export const TopLine = observer(() => {
  const { App }: Pick<TStore, STOREs.App> = useStores();
  const topLineRef = React.useRef(null);
  const btnRef = React.useRef(null);

  const handleNavClick = () => {
    App.toggleNav();
    topLineRef.current.classList.toggle('top-line_opened');
    btnRef.current.classList.toggle('top-line__nav-btn-inner_active');
  };

  const handleChangeTab = useCallback(
    (e) => {
      const val = e.currentTarget.getAttribute('data-id');
      App.setTopLineTab(parseInt(val, 10));
      console.log('handleChangeTab > ', toJS(App.topLineTab), val);
    },
    [App.topLineTab],
  );
  console.log('TOP Line: ', toJS(App.topLineTab));
  return (
    <div>
      <div ref={topLineRef} className="top-line">
        <Link to={URLs.HOME} className="logo">
          <span className="logo__name">nterio</span>
          <span className="logo__dot" />
        </Link>
        <div className="col-4 no-pad" style={{ flexGrow: 0, display: 'flex' }}>
          <div className="top-line__nav-btn" onClick={handleNavClick} role="button">
            <div
              ref={btnRef}
              className={`top-line__nav-btn-inner ${App.isLeftColOpened ? 'top-line__nav-btn-inner_active' : ''}`}
            />
          </div>
          {/* <Button className="btn-topline">Генерировать</Button> */}
        </div>
        <div className="col-4 no-pad top-line__icons">
          <TabIcons active={App.topLineTab} onChange={handleChangeTab} />
        </div>
        <div className="col-4 no-pad top-line__icons top-line__icons_right">
          <ControlIcons />
        </div>
      </div>
    </div>
  );
});

export default TopLine;
