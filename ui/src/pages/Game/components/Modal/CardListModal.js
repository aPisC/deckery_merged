import React, { useContext } from 'react';
import Modal from '.';
import { StateContext } from '../../contexts';
import CardItem from '../Card/CardItem';
import { ModalContext } from './ModalHandler';

export default function CardListModal(props) {
  const state = useContext(StateContext);
  const { modal } = useContext(ModalContext);
  const cards = modal.cards.map((c) =>
    typeof c === 'object' ? c : state.cards[c]
  );

  return (
    <Modal>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '1em',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {cards.map((card) => (
          <CardItem
            cardData={card}
            key={card && card.id}
            width={props.cardSize || '14em'}
          ></CardItem>
        ))}
      </div>
    </Modal>
  );
}
