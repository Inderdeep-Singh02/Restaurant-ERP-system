import React, { useState } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  width: 300px;
  position: relative;
`;

const CloseButton = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 18px;
  cursor: pointer;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;

  label {
    font-weight: medium;
  }

  input[type="text"],
  input[type="number"] {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  input[type="file"] {
    display: none;
  }
`;

const AddToDbButton = styled.button`
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
`;

const FileInputLabel = styled.label`
  background: #007bff;
  color: #fff;
  padding: 10px 10px;
  border-radius: 2px;
  cursor: pointer;
`;

const AddToDbModal = ({ isOpen, onClose, onAddToDB }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);

  const handleAddToDB = () => {
    const newItem = {
      name,
      price: parseFloat(price),
      image: image, // Use the selected image file
    };
    onAddToDB(newItem);
    onClose();
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage['name']);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <h2>Add New Item </h2>
        <FormField>
          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </FormField>
        <FormField>
          <label>Price</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        </FormField>
        <FormField>
          <label>Image:</label>
          <FileInputLabel htmlFor="imageInput">Choose Image</FileInputLabel>
          <input
            type="file"
            accept="image/*"
            id="imageInput"
            onChange={handleImageChange}
          />
        </FormField>
        <AddToDbButton onClick={handleAddToDB}>Add</AddToDbButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AddToDbModal;
