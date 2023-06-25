import FeaturedWorkshops from "../Workshops/FeaturedWorkshops/FeaturedWorkshops";
import { useState } from "react";

function Homepage() {
  const [searchLocation, setSearchLocation] = useState("");

  return (
    // <div>
    //   <div>
    <>
      <input
        type="text"
        value={searchLocation}
        //   onChange={this.handleLocationChange}
      />
      <FeaturedWorkshops />
    </>
    //     <button onClick={this.handleSearch}>Search</button>
    //   </div>
    //   {searched ? (
    //     <NearbyWorkshops
    //       workshops={nearbyWorkshops}
    //       location={searchLocation}
    //     />
    //   ) : (
    //     <FeaturedWorkshops workshops={featuredWorkshops} />
    //   )}
    // </div>
  );
}

export default Homepage;
