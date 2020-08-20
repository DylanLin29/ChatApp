import { useState } from "react";

const CharactersList = ({ handleSelect, charactersDisplay }) => {
  const [imgSelect, setImgSelect] = useState(-1);
  const handleImgClick = (index) => {
    if (imgSelect === -1) {
      setImgSelect(index);
    }
  };
  const imagesLinks = [
    "../images/Character_1.png",
    "../images/Character_2.png",
    "../images/Character_3.png",
    "../images/Character_4.png",
    "../images/Character_5.png",
    "../images/Character_6.png",
    "../images/Character_7.png",
    "../images/Character_8.png",
    "../images/Character_9.png",
    "../images/Character_10.png",
    "../images/Character_11.png",
    "../images/Character_12.png",
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
