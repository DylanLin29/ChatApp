import { useState } from "react";

const CharactersList = () => {
  const [imgSelect, setImgSelect] = useState(0);
  const handleImgClick = (index) => {
    console.log(index);
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
      <div>
        {imagesLinks.map((imageLink, index) => {
          return (
            <img
              src={imageLink}
              key={`characters-${index}`}
              onClick={() => handleImgClick(index)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CharactersList;
