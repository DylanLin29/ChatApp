import { Input } from "semantic-ui-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const SearchArea = ({
  searchRef,
  handleAddClick,
  searchSubmit,
  searchNotFound,
  handleSearchNotFoundChange,
}) => {
  const [searchInput, setSearchInput] = useState("");

  const handleInputChange = ({ currentTarget: input }) => {
    setSearchInput(input.value);
    handleSearchNotFoundChange();
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      searchSubmit(searchInput);
    }
  };

  return (
    <div
      className={
        searchNotFound ? "search-area search-not-found" : "search-area"
      }
    >
      <Input
        placeholder="Search..."
        ref={searchRef}
        onKeyDown={(event) => handleKeyPress(event)}
        onChange={(event) => handleInputChange(event)}
        value={searchInput}
      />
      <FontAwesomeIcon icon={faPlusSquare} size="2x" onClick={handleAddClick} />
    </div>
  );
};

export default SearchArea;
