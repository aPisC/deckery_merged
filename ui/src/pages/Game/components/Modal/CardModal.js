import React, { useContext } from 'react';
import Modal from '.';
import CardItem from '../Card/CardItem';
import { ModalContext } from './ModalHandler';

export default function CardModal() {
  const { modal } = useContext(ModalContext);
  return (
    <Modal>
      <div style={{ width: '50vmin' }}>
        <CardItem cardData={modal.cardData} width="100%"></CardItem>
      </div>
    </Modal>
  );
}
