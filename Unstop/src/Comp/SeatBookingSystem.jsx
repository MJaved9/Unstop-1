import React, { useState } from "react";

const TOTAL_SEATS = 80;
const SEATS_PER_ROW = 7;
const LAST_ROW_SEATS = 3;

const SeatBookingSystem = () => {
  const [seats, setSeats] = useState(Array(TOTAL_SEATS).fill(true));
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const reserveSeats = () => {
    const seatsToReserve = parseInt(inputValue, 10);
    if (isNaN(seatsToReserve) || seatsToReserve < 1 || seatsToReserve > 7) {
      console.log(
        "Invalid number of seats. Please enter a value between 1 and 7."
      );
      return;
    }

    const availableSeats = seats.reduce((acc, seat, index) => {
      if (seat && !selectedSeats.includes(index)) {
        acc.push(index);
      }
      return acc;
    }, []);

    if (availableSeats.length < seatsToReserve) {
      console.log("Not enough seats available.");
      return;
    }

    const newSelectedSeats = [
      ...selectedSeats,
      ...availableSeats.slice(0, seatsToReserve)
    ];
    setSelectedSeats(newSelectedSeats);

    const newSeats = [...seats];
    newSelectedSeats.forEach((seat) => {
      newSeats[seat] = false;
    });
    setSeats(newSeats);
  };

  const createSeats = () => {
    const seatRows = [];

    for (let i = 0; i < TOTAL_SEATS; i += SEATS_PER_ROW) {
      const seatRow = seats.slice(i, i + SEATS_PER_ROW).map((seat, index) => (
        <button
          key={i + index}
          onClick={() => reserveSeat(i + index)}
          style={{ backgroundColor: seat ? "green" : "red" }}
        >
          {i + index + 1}
        </button>
      ));
      seatRows.push(<div key={i}>{seatRow}</div>);
    }

    return seatRows;
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div>
      <div>
        <input
          type="number"
          min="1"
          max="7"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button onClick={reserveSeats}>Reserve</button>
      </div>
      {createSeats()}
    </div>
  );
};

export default SeatBookingSystem;
