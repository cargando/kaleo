import React from 'react';

const imageLoader = new Image();

export interface TLazyImageProps {
  src: string; // путь к файлу high Res
  srcLow?: string; // путь к файлу low Res
  type: 'DIV' | 'IMG'; // тип img - изображение или div c картинкой бэкграунд
  className: string; // класс для картинки или дива
  alt: string; // alt для img
}

interface TLazyImageState {
  src: string;
}

class LazyImage extends React.PureComponent<TLazyImageProps, TLazyImageState> {
  imgRef: React.RefObject<HTMLInputElement>;

  constructor(props) {
    super(props);
    this.imgRef = React.createRef();
    this.state = { src: null };
  }

  componentDidMount() {
    const { src, srcLow } = this.props;
    imageLoader.src = src;
    this.setDivBg(srcLow);

    imageLoader.onload = () => {
      this.setState({ src: this.props.src });
      this.setDivBg(this.props.src);
    };
  }

  componentWillUnmount() {
    imageLoader.onload = null;
  }

  setDivBg = (src) => {
    const imgNode = this.imgRef.current;
    if (this.props.type.toLowerCase() === 'div') {
      imgNode.style.backgroundImage = `url('${src}')`;
      // node.setAttribute('style', `background-image: url('${ src}')`);
      // node.classList.add('iron-image-fade-in');
    }
  };

  render() {
    const { type = 'img', alt = 'Image Loader', srcLow, className = null } = this.props;

    return type.toLowerCase() === 'div' ? (
      <div ref={this.imgRef} className={className} />
    ) : (
      <img src={this.state.src || srcLow} className={className} alt={alt} />
    );
  }
}

export default LazyImage;
