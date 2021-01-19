import React, { useContext, useState, useMemo } from 'react';
import { useDrop } from 'react-dnd';
import { DispatchContext } from '../../contexts';
import { moveCardAction } from '../../store/actions/container';
import {
  dropOver,
  pileContainer,
  cardArea,
  containerName,
  optionsBar,
  small,
  optionsRight,
} from './Container.module.scss';
import classNames from 'classnames';
import Card from '../Card';
import * as faIcons from '@fortawesome/free-solid-svg-icons';
import PopupMenu from '../Popup/PopupMenu';
import useStayAction from '../../../../core/useStayAction';
import PopupMenuDropItem from '../Popup/PopupMenuDropItem';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { ActionsContext } from '../Actions/ActionsBackend';
import CardItem from '../Card/CardItem';
import RenderPopupMenu from './RenderPopupMenu';
import CardOnClickModule from '../Card/Modules/CardOnClickModule';
import CardDragAmountModule from '../Card/Modules/CardDragAmountModule';
import CardOnWheelModule from '../Card/Modules/CardOnWheelModule';
import CardOnDoubleClickModule from '../Card/Modules/CardOnDoubleClickModule';

export default function PileContainer({ holder, isSinked }) {
  const dispatch = useContext(DispatchContext);
  const [isDropOpen, setIsDropOpen] = useState(false);
  const [dragAmount, setDragAmount] = useState(1);

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'CARD',
    drop: (d) =>
      dispatch(moveCardAction(d.cards, d.container, holder.id, d.dragProps)),

    collect: (mon) => ({
      isOver: !!mon.isOver(),
      canDrop: !!mon.canDrop(),
      offset: mon.getClientOffset(),
    }),
  });
  const isDropContextAllowed = useMemo(
    () =>
      (holder.actions &&
        holder.actions.find((a) => a.type === 'dropcontext')) != null,
    [holder]
  );
  const percent = useStayAction(
    isOver && canDrop && isDropContextAllowed,
    2000,
    () => {
      setIsDropOpen(true);
    }
  );

  const actionRunner = useContext(ActionsContext);

  if (!holder) return null;

  const gridPosition = holder.settings.find(
    (s) => s.__component === 'container.grid-position'
  );
  const pileIcons = holder.settings.find(
    (s) => s.__component === 'container.pile-icons'
  );
  const multiDrag = holder.settings.find(
    (s) => s.__component === 'container.multidrag'
  );

  const hoverIcon = pileIcons && faIcons[pileIcons.hoverIcon];
  const dropIcon = pileIcons && faIcons[pileIcons.dropIcon];
  const emptyIcon = pileIcons && faIcons[pileIcons.emptyIcon];

  const getActionExecuter = (a) =>
    a &&
    (() => {
      if (
        a.filter &&
        !actionRunner.execute(
          a.filter,
          {},
          { containerId: holder.id, card: holder?.top }
        )
      )
        return;
      actionRunner.execute(
        a.code,
        {},
        {
          containerId: holder.id,
          card: holder?.top,
        }
      );
    });

  const clickAction = getActionExecuter(
    holder?.actions?.find((a) => a.type === 'click')
  );

  const dbClickAction = getActionExecuter(
    holder?.actions?.find((a) => a.type === 'doubleclick')
  );

  return (
    <div
      className={classNames({
        [pileContainer]: true,
        [small]: isSinked,
        [dropOver]: isOver,
        [optionsRight]: gridPosition && gridPosition.optionsOnRight,
      })}
      ref={drop}
    >
      <div className={optionsBar}>
        <div style={{ position: 'relative' }}>
          <RenderPopupMenu actionRunner={actionRunner} holder={holder} />
        </div>
      </div>
      <div className={containerName}>{holder.name}&nbsp;</div>
      <div className={cardArea}>
        {holder.top && holder.top.count > 1 && <CardItem cardData={{}} />}
        {holder.top && holder.top.count > 2 && (
          <CardItem cardData={{}} noShadow />
        )}
        {holder.top && (
          <Card
            key={`${holder.top.id || 0}-${holder.top._id || 0}`}
            card={holder.top}
            overIcon={
              dragAmount !== 1 ? dragAmount : canDrop ? dropIcon : hoverIcon
            }
            dropTarget={canDrop}
            noShadow={holder.top.count > 1}
            selectable={false}
            onDoubleClick={false}
          >
            {clickAction && <CardOnClickModule onClick={clickAction} />}
            {dbClickAction && (
              <CardOnDoubleClickModule onDoubleClick={dbClickAction} />
            )}

            <CardDragAmountModule
              amount={dragAmount}
              onDragEnd={() => setDragAmount(1)}
            />
            {multiDrag && multiDrag.allow && (
              <CardOnWheelModule
                onWheel={(event) => {
                  const dif = Math.sign(event.deltaY);
                  setDragAmount((dragAmount) => Math.max(dragAmount - dif, 1));
                }}
              />
            )}
            <RenderProgressOverlay percentage={percent} />
            <div style={{ position: 'absolute' }}>
              <RenderDropMenu
                isOpen={isDropOpen}
                onClose={() => setIsDropOpen(false)}
                holder={holder}
                actionRunner={actionRunner}
              />
            </div>
          </Card>
        )}
        {!holder.top && (
          <CardItem
            cardData={{}}
            overIcon={canDrop ? dropIcon : emptyIcon}
            dropTarget
          />
        )}
      </div>
    </div>
  );
}

function RenderDropMenu({ isOpen, onClose, holder, actionRunner }) {
  const items = useMemo(
    () =>
      (holder &&
        holder.actions &&
        holder.actions.filter((a) => a.type === 'dropcontext')) ||
      [],
    [holder]
  );

  return (
    isOpen &&
    items.length > 0 && (
      <PopupMenu onClose={onClose}>
        {items.map((a) => (
          <PopupMenuDropItem
            iconLeft={faIcons[a.icon]}
            onDrop={(d, c) => {
              actionRunner.execute(
                a.code,
                { getDropData: () => d },
                {
                  containerId: holder.id,
                }
              );
              c();
            }}
            key={a.id}
          >
            {a.name}
          </PopupMenuDropItem>
        ))}
      </PopupMenu>
    )
  );
}

function RenderProgressOverlay({ percentage }) {
  return (
    percentage >= 50 && (
      <div
        style={{
          backgroundColor: 'var(--color-base)',
          opacity: '.5',
          padding: '20%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <CircularProgressbar
          value={percentage * 2 - 100}
          styles={buildStyles({
            pathTransition: 'none',
            pathColor: 'var(--color-opposite)',
            trailColor: 'transparent',
          })}
        />
      </div>
    )
  );
}
