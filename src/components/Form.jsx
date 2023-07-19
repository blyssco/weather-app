import React from "react";

const Form = ({ handleSubmit, setImg, nameOfCity,  }) => {
  return (
    <form onSubmit={handleSubmit} className="form">
      <input
        className="input-field"
        type="text"
        placeholder="Search any city..."
        value={nameOfCity}
        onChange={(e) => setImg(e.target.value)}
      />
    </form>
  );
};

export default Form;
