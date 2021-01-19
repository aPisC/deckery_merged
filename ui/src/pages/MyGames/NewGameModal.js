import React, { useEffect, useState } from 'react';
import useCommunicator from '../../core/useCommunicator';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import CardItem from '../Game/components/Card/CardItem';

export default function NewGameModal({ onClose, onCreated }) {
  const [schemas, setSchemas] = useState([]);
  const comm = useCommunicator();
  const [selectedId, setSelectedId] = useState(-1);

  useEffect(() => {
    comm.get('/stored-schemas').then((d) => setSchemas(d.data));
  }, [comm]);

  const create = async () => {
    if (!schemas[selectedId]) return;
    const data = await comm.get(`/games/init/${schemas[selectedId].key}`);
    console.log(data);
    onCreated(data.data);
  };

  console.log(schemas);

  return (
    <div>
      <Modal isOpen={true} toggle={onClose}>
        <ModalHeader toggle={onClose}>New Game</ModalHeader>
        <ModalBody>
          <div
            className="d-flex justify-content-between"
            style={{ flexWrap: 'wrap' }}
          >
            {schemas.map((s, i) => (
              <SchemaCard
                data={s}
                onSelect={() => setSelectedId(i)}
                isSelected={selectedId === i}
              />
            ))}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={create}>
            Create
          </Button>{' '}
          <Button color="secondary" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

function SchemaCard({ data, isSelected, onSelect }) {
  return (
    <div
      className={`m-2 btn ${isSelected ? 'bg-primary' : ''}`}
      style={{ width: '10rem' }}
      onClick={onSelect}
    >
      <CardItem cardData={{ background: data.image }} width="100%" />
      <div className="container-fluid">
        <h6 className="">{data.name}</h6>
        {data.description && <p className="card-text">{data.description}</p>}
      </div>
    </div>
  );
}
