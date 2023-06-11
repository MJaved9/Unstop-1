const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/seatbooking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

// Define the Seat schema and model
const seatSchema = new mongoose.Schema({
  seatNumber: { type: Number, required: true },
  isReserved: { type: Boolean, default: false },
});
const Seat = mongoose.model('Seat', seatSchema);

// API endpoints will be defined here

// ...

// Endpoint to reserve seats
app.post('/api/seats/reserve', async (req, res) => {
  try {
    const seatsToReserve = parseInt(req.body.seats, 10);

    if (isNaN(seatsToReserve) || seatsToReserve < 1 || seatsToReserve > 7) {
      return res.status(400).json({ error: 'Invalid number of seats. Please enter a value between 1 and 7.' });
    }

    const availableSeats = await Seat.find({ isReserved: false }).limit(seatsToReserve);

    if (availableSeats.length < seatsToReserve) {
      return res.status(400).json({ error: 'Not enough seats available.' });
    }

    const reservedSeatNumbers = availableSeats.map((seat) => seat.seatNumber);
    await Seat.updateMany({ seatNumber: { $in: reservedSeatNumbers } }, { isReserved: true });

    return res.json({ message: 'Seats reserved successfully.', reservedSeats: reservedSeatNumbers });
  } catch (err) {
    console.error('Error while reserving seats', err);
    return res.status(500).json({ error: 'An error occurred while reserving seats. Please try again later.' });
  }
});

// ...




// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
