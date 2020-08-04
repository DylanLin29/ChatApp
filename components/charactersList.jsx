import { useState } from "react";

const CharactersList = ({ handleSelect }) => {
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
      <h1>Pick Your Character</h1>
      <div className="characters-list">
        {imagesLinks.map((imageLink, index) => {
          return (
            <img
              src={imageLink}
              key={`characters-${index}`}
              onClick={() => handleImgClick(index)}
              className={
                imgSelect === -1 || index === imgSelect ? "" : "character-hide"
              }
            />
          );
        })}
        {imgSelect !== -1 && (
          <div className="characters-buttons">
            <div
              id="characters-continue-button"
              onClick={() => handleSelect(imagesLinks[imgSelect])}
            >
              Continue
            </div>
            <div
              id="characters-reselect-button"
              onClick={() => setImgSelect(-1)}
            >
              Reselect
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharactersList;
