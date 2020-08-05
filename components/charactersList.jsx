import { useState } from "react";

const CharactersList = ({ handleSelect, charactersDisplay }) => {
  const [imgSelect, setImgSelect] = useState(-1);
  const handleImgClick = (index) => {
    if (imgSelect === -1) {
      setImgSelect(index);
    }
  };
  const imagesLinks = [
    "https://playjoor.com/assets/avatar/matthew.png",
    "https://playjoor.com/assets/avatar/jenny.jpg",
    "https://playjoor.com/assets/avatar/joe.jpg",
    "https://playjoor.com/assets/avatar/nan.jpg",
    "https://playjoor.com/assets/avatar/elliot.jpg",
    "https://playjoor.com/assets/avatar/helen.jpg",
    "https://playjoor.com/assets/avatar/mark.png",
    "https://playjoor.com/assets/avatar/rachel.png",
  ];
  return (
    <div className="characters-list-container">
      <div
        className={charactersDisplay ? "characters-display" : "characters-hide"}
      >
        <div className="characters-list-wrapper">
          <h2>PICK YOUR CHARACTER</h2>
          <div className="characters-list">
            {imagesLinks.map((imageLink, index) => {
              return (
                <img
                  src={imageLink}
                  key={`characters-${index}`}
                  onClick={() => handleImgClick(index)}
                  className={
                    imgSelect === -1 || index === imgSelect
                      ? ""
                      : "character-hide"
                  }
                />
              );
            })}
          </div>
        </div>
        {imgSelect !== -1 && (
          <div className="characters-buttons">
            <div
              className="characters-reselect-button"
              onClick={() => setImgSelect(-1)}
            >
              Reselect
            </div>
            <div
              className="characters-continue-button"
              onClick={() => handleSelect(imagesLinks[imgSelect])}
            >
              Continue
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharactersList;
