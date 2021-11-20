import Veneer from '../assets/materials/veneer.png';
import Stone from '../assets/materials/stone.png';
import Plaster from '../assets/materials/plaster.png';
import Textile from '../assets/materials/texstile.png';
import Concrete from '../assets/materials/concrete.png';
import Plastic from '../assets/materials/plastic.png';
import Wood from '../assets/materials/wood.png';
import Metal from '../assets/materials/metal.png';
import Paper from '../assets/materials/paper.png';

import Img1 from '../assets/materials/shpon_01.png';
import Img2 from '../assets/materials/shpon_02.png';
import Img3 from '../assets/materials/shpon_03.png';
import Img4 from '../assets/materials/shpon_04.png';
import Img5 from '../assets/materials/shpon_05.png';
import Img6 from '../assets/materials/shpon_06.png';
import Img7 from '../assets/materials/shpon_07.png';
import Img8 from '../assets/materials/shpon_08.png';
import Img9 from '../assets/materials/shpon_09.png';
import Img10 from '../assets/materials/shpon_10.png';
import Img11 from '../assets/materials/shpon_11.png';
import Img12 from '../assets/materials/shpon_12.png';
import Img13 from '../assets/materials/shpon_13.png';
import Img14 from '../assets/materials/shpon_14.png';
import Img15 from '../assets/materials/shpon_15.png';
import Img16 from '../assets/materials/shpon_16.png';
import Img17 from '../assets/materials/shpon_17.png';

import Gen1 from '../assets/materials/gen/r1.png';
import Gen2 from '../assets/materials/gen/r2.png';
import Gen3 from '../assets/materials/gen/r3.png';
import Gen4 from '../assets/materials/gen/r4.png';
import Gen5 from '../assets/materials/gen/r5.png';
import Gen6 from '../assets/materials/gen/r6.png';
import Gen7 from '../assets/materials/gen/r7.png';
import Gen8 from '../assets/materials/gen/r8.png';
import Gen9 from '../assets/materials/gen/r9.png';
import Gen10 from '../assets/materials/gen/r10.png';

import Len1 from '../assets/materials/gen/l1.png';
import Len2 from '../assets/materials/gen/l2.png';
import Len3 from '../assets/materials/gen/l3.png';
import Len4 from '../assets/materials/gen/l4.png';
import Len5 from '../assets/materials/gen/l5.png';
import Len6 from '../assets/materials/gen/l6.png';
import Len7 from '../assets/materials/gen/l7.png';
import Len8 from '../assets/materials/gen/l8.png';
import Len9 from '../assets/materials/gen/l9.png';
import Len10 from '../assets/materials/gen/l10.png';

import { TMaterial, TColor, TSelectedMaterial } from './types';

export const GeneratedStub: TSelectedMaterial[] = [
  {
    id: 1,
    src: Gen1,
    srcLarge: Len1,
    title: 'Шпон',
    width: 176,
    height: 345,
    top: 15,
    left: 25,
    active: false,
    bgScale: 103,
  },
  {
    id: 2,
    src: Gen2,
    srcLarge: Len2,
    title: 'Шпон',
    width: 238,
    height: 234,
  },
  {
    id: 3,
    src: Gen3,
    srcLarge: Len3,
    title: 'Шпон',
    width: 400,
    height: 306,
  },
  {
    id: 4,
    src: Gen4,
    srcLarge: Len4,
    title: 'Шпон',
    width: 405,
    height: 163,
  },
  {
    id: 5,
    src: Gen5,
    srcLarge: Len5,
    title: 'Шпон',
    width: 148,
    height: 146,
  },
  {
    id: 6,
    src: Gen6,
    srcLarge: Len6,
    title: 'Шпон',
    width: 629,
    height: 146,
  },
  {
    id: 7,
    src: Gen7,
    srcLarge: Len7,
    title: 'Шпон',
    width: 110,
    height: 339,
  },
  {
    id: 8,
    src: Gen8,
    srcLarge: Len8,
    title: 'Шпон',
    width: 11,
    height: 413,
  },
  {
    id: 9,
    src: Gen9,
    srcLarge: Len9,
    title: 'Шпон',
    width: 19,
    height: 672,
  },
  {
    id: 10,
    src: Gen10,
    srcLarge: Len10,
    title: 'Шпон',
    width: 102,
    height: 209,
  },
];

export const MaterialStub: TMaterial[] = [
  {
    id: 1,
    src: Veneer,
    title: 'Шпон',
  },
  {
    id: 2,
    src: Stone,
    title: 'Камень',
  },
  {
    id: 3,
    src: Plaster,
    title: 'Штукатурка',
  },
  {
    id: 4,
    src: Textile,
    title: 'Текстиль',
  },
  {
    id: 5,
    src: Concrete,
    title: 'Бетон',
  },
  {
    id: 6,
    src: Plastic,
    title: 'Пластик',
  },
  {
    id: 7,
    src: Wood,
    title: 'Дерево',
  },
  {
    id: 8,
    src: Metal,
    title: 'Металл',
  },
  {
    id: 9,
    src: Paper,
    title: 'Бумага',
  },
];

export const VeneerStub: TMaterial[] = [
  {
    id: 1,
    src: Img1,
    title: 'Миланский орех',
  },
  {
    id: 2,
    src: Img2,
    title: 'Северный мокка',
  },
  {
    id: 3,
    src: Img3,
    title: 'Клен карамель',
  },
  {
    id: 4,
    src: Img4,
    title: 'Американский орех',
  },
  {
    id: 5,
    src: Img5,
    title: 'Береза вишневая',
  },
  {
    id: 6,
    src: Img6,
    title: 'Береза карликовая',
  },
  {
    id: 7,
    src: Img7,
    title: 'Берёза повислая',
  },
  {
    id: 8,
    src: Img8,
    title: 'Осина темная',
  },
  {
    id: 9,
    src: Img9,
    title: 'Осина светлая',
  },
  {
    id: 10,
    src: Img10,
    title: 'Сосна камчатская',
  },
  {
    id: 11,
    src: Img11,
    title: 'Дуб орегано',
  },
  {
    id: 12,
    src: Img12,
    title: 'Дуб темный',
  },
  {
    id: 13,
    src: Img13,
    title: 'Дуб темный',
  },
  {
    id: 14,
    src: Img14,
    title: 'Дуб темный',
  },
  {
    id: 15,
    src: Img15,
    title: 'Дуб темный',
  },
  {
    id: 16,
    src: Img16,
    title: 'Дуб темный',
  },
  {
    id: 17,
    src: Img17,
    title: 'Дуб темный',
  },
];

export const ColorsStub: TColor[] = [
  {
    id: 1,
    color: '#FFA599',
    title: 'Миланский орех',
  },
  {
    id: 2,
    color: '#E1D45C',
    title: 'Миланский орех',
  },
  {
    id: 3,
    color: '#FCA04A',
    title: 'Миланский орех',
  },
  {
    id: 4,
    color: '#5AC21B',
    title: 'Миланский орех',
  },
  {
    id: 5,
    color: '#31BF9D',
    title: 'Миланский орех',
  },
  {
    id: 6,
    color: '#2B7EBA',
    title: 'Миланский орех',
  },
  {
    id: 7,
    color: '#6357EE',
    title: 'Миланский орех',
  },
  {
    id: 8,
    color: '#C757EE',
    title: 'Миланский орех',
  },
  {
    id: 9,
    color: '#B593C0',
    title: 'Миланский орех',
  },
  {
    id: 10,
    color: '#93A5C0',
    title: 'Миланский орех',
  },
  {
    id: 11,
    color: '#B5D69C',
    title: 'Миланский орех',
  },
  {
    id: 12,
    color: '#98815F',
    title: 'Миланский орех',
  },
  {
    id: 13,
    color: '#FFFFFF',
    title: 'Миланский орех',
    border: '#C2C1C6',
  },
  {
    id: 14,
    color: '#D7D7D7',
    title: 'Миланский орех',
  },
  {
    id: 15,
    color: '#595959',
    title: 'Миланский орех',
  },
];
