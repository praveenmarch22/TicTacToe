import React from "react";

const PlayerSelect = ({ onSelectSymbol }) => {
  return (
    <div>
      <h2>Select Your Symbol:</h2>
      <button onClick={() => onSelectSymbol("X")}>X</button>
      <button onClick={() => onSelectSymbol("O")}>O</button>
    </div>
  );
};

export default PlayerSelect;
