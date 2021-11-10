import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { FullScreen } from 'components/fullScreen';
import { STOREs, TStore } from 'store';
import { useStores } from 'hooks';
import { ReactComponent as CloseBtn } from 'assets/icons/close_white.svg';
import './styles.scss';
import { Button } from '../button';
import { UploadProgress } from '../uploadProgress';

export const UPLOAD_IMG_MODAL = 'UPLOAD_IMG_MODAL';

export interface TUploadImageProps {
  children?: React.ReactNode;
}

export const UploadImages = observer((props: TUploadImageProps) => {
  const { Modals }: Pick<TStore, STOREs.Modals> = useStores();

  const handleClick = () => {
    Modals.closeModal(UPLOAD_IMG_MODAL);
  };

  // @ts-ignore
  return (
    Modals.modalID === UPLOAD_IMG_MODAL && (
      <FullScreen name={UPLOAD_IMG_MODAL} bgColor="#000000" opacity={0.85}>
        <div className="modal-img__container">
          <div className="modal-img__close">
            <CloseBtn onClick={handleClick} />
          </div>
          <h3 className="modal-img__header">Загрузка собственной текстуры</h3>
          <div className="modal-img__upload-area">
            <div className="modal-img__progress">
              <div className="modal-img__progress-cover">
                <UploadProgress width={96} height={96} progress={70} className="modal-img__progress-icon" />
              </div>
              <p className="modal-img__progress-text">
                Перетащите изображение с текстурой в эту область или выберите файл на устройстве
              </p>
              <div className="modal-img__btn-container">
                <Button color="white" onClick={null} size="L">
                  Выбрать текстуру...
                </Button>
              </div>
            </div>
          </div>
        </div>
      </FullScreen>
    )
  );
});
