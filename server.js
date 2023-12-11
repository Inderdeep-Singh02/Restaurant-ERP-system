const express = require('express');
const fs = require('fs');
const cors = require('cors'); // Import the cors middleware

const app = express();
const port = 3001;

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());

const dataFilePath = 'Orders.json';

const menuFilePath = 'Menu.json'; // Add this variable for Menu.json

// Function to read data from the JSON file
const readData = () => {
  try {
    if (fs.existsSync(dataFilePath)) {
      const rawData = fs.readFileSync(dataFilePath, 'utf-8');
      return JSON.parse(rawData);
    } else {
      return { users: [] }; // Initialize with an empty users array if the file doesn't exist
    }
  } catch (error) {
    console.error('Error reading data:', error);
    return { users: [] }; // Initialize with an empty users array in case of an error
  }
};

// Function to write data to the JSON file
const writeData = (data) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing data:', error);
    throw error;
  }
};

// Define a route to read data from the JSON file
app.get('/api/data', (req, res) => {
  const data = readData();
  res.json(data);
});

// Define a route to write data to the JSON file
app.post('/api/data', (req, res) => {
  try {
    // Read existing data from the file
    const data = readData();

    // Add new data (assuming the request body is an object to be added)
    const newData = req.body;

    // Make sure the "users" property exists in the data object
    if (!data.users) {
      data.users = [];
    }

    data.users.push(newData);

    // Write the updated data back to the file
    writeData(data);

    res.json({ message: 'Data added successfully.' });
  } catch (error) {
    console.error('Error writing data:', error);
    res.status(500).json({ error: 'Could not write data to the file.' });
  }
});


// Define a route to read data from the Menu.json file
app.get('/api/Mdata', (req, res) => {
  try {
    // Read data from the Menu.json file
    const rawData = fs.readFileSync(menuFilePath, 'utf-8');
    const data = JSON.parse(rawData);
    // console.log(data); // This line logs the data to the server console
    res.json(data);
  } catch (error) {
    console.error('Error reading data from Menu.json:', error);
    res.status(500).json({ error: 'Could not read data from Menu.json.' });
  }
});


app.post('/api/addToMenu', (req, res) => {
  try {
    // Get the new menu item from the request body
    const newItem = req.body;

    // Read the existing menu data from the JSON file
    const rawData = fs.readFileSync(menuFilePath, 'utf-8');
    const menuData = JSON.parse(rawData);

    // Ensure that "User_1" is an array
    if (!Array.isArray(menuData.User_1)) {
      menuData.User_1 = [];
    }

    // Add the new menu item to the "User_1" array
    menuData.User_1.push(newItem);

    // Save the updated menu data to the JSON file
    fs.writeFileSync(menuFilePath, JSON.stringify(menuData, null, 2), 'utf-8');

    console.log('New menu item added to User_1:', newItem);
    res.json({ message: 'Menu item added successfully.' });
  } catch (error) {
    console.error('Error adding menu item:', error);
    res.status(500).json({ error: 'Could not add menu item.' });
  }
});


app.post('/api/updateMenu', (req, res) => {
  try {
    // Get the updated item from the request body
    const updatedItem = req.body;

    // Read the existing menu data from the JSON file
    const rawData = fs.readFileSync(menuFilePath, 'utf-8');
    const menuData = JSON.parse(rawData);

    // Ensure that "User_1" is an array
    if (!Array.isArray(menuData.User_1)) {
      menuData.User_1 = [];
    }

    // Find and update the item in the "User_1" array based on its id
    let updated = false; // Change this to let
    menuData.User_1 = menuData.User_1.map((item) => {
      if (item.id === updatedItem.id) {
        updated = true;
        return updatedItem;
      }
      return item;
    });

    if (!updated) {
      // If the item with the specified id is not found, add it to the array
      menuData.User_1.push(updatedItem);
    }

    // Write the updated menu data back to the JSON file
    const updatedMenuJSON = JSON.stringify(menuData, null, 2);
    fs.writeFileSync(menuFilePath, updatedMenuJSON, 'utf-8');

    console.log('Menu data updated on the server:', updatedItem);
    res.json({ message: 'Menu data updated successfully.' });
  } catch (error) {
    console.error('Error updating menu data:', error);
    res.status(500).json({ error: 'Could not update menu data.' });
  }
});



app.post('/api/addItem', (req, res) => {
  const newItem = req.body;
  // Determine the next ID by finding the maximum ID in the existing data

  const rawData = fs.readFileSync(menuFilePath, 'utf-8');
  const menuData = JSON.parse(rawData);
  const existingData = menuData['User_1'];
  const nextId = existingData.reduce((maxId, item) => Math.max(maxId, item.id), 0) + 1;

  // Set the ID for the new item
  newItem.id = nextId;

  const orderedItem = {
    id: newItem.id,
    name: newItem.name,
    price: newItem.price,
    image: newItem.image,
  };

  // Append the new item to the "User_1" array
  existingData.push(orderedItem);
  fs.writeFileSync('Menu.json', JSON.stringify(menuData, null, 2));

  res.status(200).json({ message: 'Item added to User_1' });
});


app.delete('/api/deleteItem/:id', (req, res) => {
  const itemIdToDelete = req.params.id;

  // Read your menu data from the JSON file
  const rawData = fs.readFileSync(menuFilePath, 'utf-8');
  const menuData = JSON.parse(rawData);

  // Find and remove the item by ID
  menuData.User_1 = menuData.User_1.filter((item) => item.id !== parseInt(itemIdToDelete));

  // Save the updated data back to the JSON file
  fs.writeFileSync(menuFilePath, JSON.stringify(menuData, null, 2));

  res.status(200).json({ message: 'Item deleted successfully' });
});


app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});