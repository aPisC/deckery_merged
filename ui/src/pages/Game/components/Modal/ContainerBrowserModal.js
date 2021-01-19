import React, { useContext, useState } from 'react';
import Modal from '.';
import useStayAction from '../../../../core/useStayAction';
import { StateContext } from '../../contexts';
import Card from '../Card';
import CardDragModule from '../Card/Modules/CardDragModule';
import { ModalContext } from './ModalHandler';

export default function ContainerBrowserModal(props) {
  const { modal, close } = useContext(ModalContext);
  const state = useContext(StateContext);
  const cards = modal.cards.map((c) =>
    typeof c === 'object' ? c : state.cards[c]
  );
  const [isCardDragged, setIsCardDragged] = useState(false);
  useStayAction(isCardDragged, 250, () => close());

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
        onClick={(e) => e.target === e.currentTarget && close()}
      >
        {cards.map((card) => (
          <Card
            card={{ id: card.id }}
            cardData={card}
            key={card && card.id}
            width={modal.cardSize || '14em'}
            holderId={modal.container}
          >
            <CardDragModule
              dragProps={{ direct: true }}
              onDragBegin={() => {
                setIsCardDragged(true);
              }}
            />
          </Card>
        ))}
      </div>
    </Modal>
  );
}
