import React from 'react';

const Modal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null; // Don't render anything if the modal is closed

  return (
    <div className="modal-overlay">
      <div className="custom-modal">
        <h2>{title}</h2>
        <p>{message}</p>
        <button className="modalButton" onClick={onConfirm}>Yes</button>
        <button className="modalButton" onClick={onCancel}>No</button>
      </div>
    </div>
  );
};

export default Modal;
