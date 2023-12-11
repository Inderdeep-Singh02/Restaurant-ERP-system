import React, { useState } from 'react';
import styled from 'styled-components';

const ModalWrapper = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 20px;
  width: 320px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;

const ModalHeader = styled.h2`
  margin-bottom: 20px;
`;
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

const FormLabel = styled.label`
  display: block;
  font-weight: bold;
  margin-top: 10px;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-top: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const ModalButtons = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
`;

const SaveButton = styled.button`
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const CancelButton = styled.button`
  background-color: #ccc;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;


const FileInput = styled.input`
  display: none;
`;
const FileInputLabel = styled.label`
  background: #007bff;
  color: #fff;
  padding: 10px 10px;
  border-radius: 2px;
  cursor: pointer;
`;

const EditItemModal = ({ item, onEdit, onClose }) => {
  const [editedName, setEditedName] = useState(item.name);
  const [editedPrice, setEditedPrice] = useState(item.price);
  const [imageFile, setImageFile] = useState(item.image);



  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file.name);
  };

  const handleSave = () => {
    const editedItem = {
      ...item,
      name: editedName,
      price: editedPrice,
      image: imageFile,
    };

    onEdit(editedItem);
    onClose();
  };

  return (
    <ModalOverlay>
    <ModalWrapper>
      <ModalHeader>Edit Item</ModalHeader>
      <FormLabel>Name:</FormLabel>
      <FormInput
        type="text"
        value={editedName}
        onChange={(e) => setEditedName(e.target.value)}
      />
      <FormLabel>Price:</FormLabel>
      <FormInput
        type="number"
        value={editedPrice}
        onChange={(e) => setEditedPrice(parseFloat(e.target.value))}
      />

      <FormLabel>Image:</FormLabel>
        {/* <label htmlFor="image-upload">
          Choose an image
        </label> */}
         <FileInputLabel htmlFor="image-upload">Choose Image</FileInputLabel>
        <FileInput
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        {/* {item.image && <img src={URL.createObjectURL(item.image)} alt="Item" />} */}

      <ModalButtons>
        <SaveButton onClick={handleSave}>Save</SaveButton>
        <CancelButton onClick={onClose}>Cancel</CancelButton>
      </ModalButtons>
    </ModalWrapper>
    </ModalOverlay>
  );
};

export default EditItemModal;
