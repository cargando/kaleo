import * as React from 'react';
import { createPortal } from 'react-dom';
import { hexToRgbA } from 'utils/fn';

const modalRoot = document.getElementById('modal-root');
const root = document.getElementsByTagName('body')[0];

interface TPortalProps {
  bgColor?: string;
  opacity?: number;
  padding?: string;
  zIndex?: number;
}

export class Portal extends React.PureComponent<TPortalProps> {
  htmlNode = null;

  constructor(props) {
    super(props);
    this.htmlNode = document.createElement('div');
    this.htmlNode.style.cssText =
      'position: fixed; overflow-y: auto; width: 100%; height: 100%; margin: 0 !important; top: 0px; left: 0px';
  }

  componentDidMount() {
    const { bgColor = null, opacity = null, padding = null, zIndex = null } = this.props;
    modalRoot.appendChild(this.htmlNode);

    const oldCss = this.htmlNode.style.cssText;
    this.htmlNode.style.cssText = `${oldCss} background-color: ${
      bgColor === null ? 'rgba(255,255,255, 0)' : hexToRgbA(bgColor, opacity === null ? 1 : opacity)
    }; padding: ${padding === null ? '0' : padding}; z-index: ${zIndex === null ? 10000 : zIndex};`;
    root.style.overflow = 'hidden';
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.htmlNode);
    root.style.overflow = 'auto';
  }

  render() {
    return createPortal(this.props.children, this.htmlNode);
  }
}
