import React, { useContext, useState, useMemo } from 'react';
import { useDrop } from 'react-dnd';
import { DispatchContext } from '../../contexts';
import { moveCardAction } from '../../store/actions/container';
import {
  dropOver,
  handContainer,
  cardArea,
  containerName,
  optionsBar,
  stacked,
  small,
  optionsRight,
} from './Container.module.scss';
import classNames from 'classnames';
import Card from '../Card';
import * as faIcons from '@fortawesome/free-solid-svg-icons';
import PopupMenu from '../Popup/PopupMenu';
import PopupMenuItem from '../Popup/PopupMenuItem';
import PopupSubMenu from '../Popup/PopupSubMenu';
import FieldGroup from '../Fields/FieldGroup';
import ButtonCheck from '../Fields/ButtonCheck';
import useStayAction from '../../../../core/useStayAction';
import { ActionsContext } from '../Actions/ActionsBackend';
import PopupMenuDropItem from '../Popup/PopupMenuDropItem';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import RenderPopupMenu from './RenderPopupMenu';
import useSettings from '../../core/useSettings';
import CardDragModule from '../Card/Modules/CardDragModule';
import CardOrderModule from '../Card/Modules/CardOrderModule';
import CardSelectableModule from '../Card/Modules/CardSelectableModule';
import CardOnClickModule from '../Card/Modules/CardOnClickModule';
import CardOnDoubleClickModule from '../Card/Modules/CardOnDoubleClickModule';

export default function HandContainer({ holder, isSinked }) {
  const dispatch = useContext(DispatchContext);
  const [isDropOpen, setIsDropOpen] = useState(false);
  const [isStacked, setIsStacked] = useSettings(
    `container_stacked.${holder.id}`,
    true
  );

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'CARD',
    drop: (d) => {
      if (d.container !== holder.id)
        dispatch(moveCardAction(d.cards, d.container, holder.id, d.dragProps));
    },

    collect: (mon, i) => ({
      isOver: !!mon.isOver(),
      canDrop: !!(
        mon.canDrop() &&
        mon.getItem() &&
        mon.getItem().container !== holder.id
      ),
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

  const gridPosition = holder?.settings?.find(
    (s) => s.__component === 'container.grid-position'
  );

  const getActionExecuter = (a) => (card) =>
    a &&
    (() => {
      if (
        a.filter &&
        !actionRunner.execute(
          a.filter,
          {},
          { containerId: holder.id, card: card }
        )
      )
        return;
      actionRunner.execute(
        a.code,
        {},
        {
          containerId: holder.id,
          card: card,
        }
      );
    });

  const clickAction = getActionExecuter(
    holder?.actions?.find((a) => a.type === 'click')
  );

  const dbClickAction = getActionExecuter(
    holder?.actions?.find((a) => a.type === 'doubleclick')
  );

  if (!holder) return null;
  return (
    <div
      className={classNames({
        [handContainer]: true,
        [stacked]: isStacked !== false,
        [small]: isSinked,
        [dropOver]: isOver && canDrop,
        [optionsRight]: gridPosition && gridPosition.optionsOnRight,
      })}
      ref={drop}
    >
      <div className={optionsBar}>
        <div style={{ position: 'relative' }}>
          <RenderPopupMenu
            actionRunner={actionRunner}
            holder={holder}
            states={{
              isStacked,
              setIsStacked,
            }}
          >
            <PopupSubMenu title="Beállítások" icon={faIcons.faCog}>
              <PopupMenuItem text>
                <FieldGroup noPadding>
                  <label>Összecsukva</label>
                  <small>
                    <ButtonCheck
                      onUpdate={(v) => setIsStacked(v)}
                      value={isStacked}
                    />
                  </small>
                </FieldGroup>
              </PopupMenuItem>
            </PopupSubMenu>
          </RenderPopupMenu>
          <RenderDropMenu
            isOpen={isDropOpen}
            onClose={() => setIsDropOpen(false)}
            actionRunner={actionRunner}
            holder={holder}
          />
        </div>
      </div>
      <div className={containerName}>{holder.name}&nbsp;</div>
      <div className={cardArea}>
        {holder.cards.map((x, i) => (
          <Card card={x} key={`${x.id || 0}-${x._id || 0}`}>
            <CardDragModule />
            <CardOrderModule orderIndex={i} />
            <CardSelectableModule />

            {clickAction && <CardOnClickModule onClick={clickAction(x)} />}
            {dbClickAction && (
              <CardOnDoubleClickModule onDoubleClick={dbClickAction(x)} />
            )}
            {/* <CardContextMenuModule>
              <CardContext.Consumer>
                {({ setState, state }) => (
                  <PopupMenuItem
                    onClick={(close) => {
                      console.log(setState, state);
                      setState('style', {
                        ...state.style,
                        marginRight: state.style.marginRight == null ? 0 : null,
                      });
                      close();
                    }}
                  >
                    Separate
                  </PopupMenuItem>
                )}
              </CardContext.Consumer>
                  </CardContextMenuModule>*/}
          </Card>
        ))}
      </div>
      <RenderProgressOverlay percentage={percent} />
    </div>
  );
}

function RenderProgressOverlay({ percentage }) {
  return (
    percentage >= 50 && (
      <div
        style={{
          backgroundColor: 'var(--color-base)',
          opacity: '.5',
          padding: '2em',
          display: 'flex',
          justifyContent: 'center',
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
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
