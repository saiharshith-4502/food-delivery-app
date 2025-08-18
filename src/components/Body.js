import RestaurantCard, {withPromotedLabel} from "./RestaurantCard";
// import resList from "../utils/mockData"; // not using this anymore
import { useEffect, useState, useContext } from "react";
import Shimmer from "./Shimmer";
import { Link } from "react-router-dom";
import useOnlineStatus from "../utils/useOnlineStatus";
import UserContext from '../utils/UserContext';
import { RiArrowUpDownFill } from "react-icons/ri";


//not using keys(not acceptable) <<<<<< index as key <<<<<<<< unique id  (best practice) must follow
const Body = () => {

    // state variable is created using useState - super powerful variable 
    // it maintains the state of your application
    // a react hook is normal javascript function that starts with use
    // javascript utility function given by react
    // two important react hooks - useState, useEffect

    const [listOfRestaurants, setListOfRestaurants] = useState([]); // local state variable for list of restaurants
    const [filteredListOfRestaurants, setFileteredListOfRestaurants] = useState([]); // local state variable for filtered list of restaurants
    const [searchText, setSearchText] = useState(''); // local state variable for search text
    const [isLoading, setIsLoading] = useState(true); // loading state
    const {loggedInUser , setUserInfo} = useContext(UserContext); // context variable

    const RestaurantCardPromoted = withPromotedLabel(RestaurantCard); // higher order component

    // console.log("Body rendered",listOfRestaurants); // whenever a state variable changes, the component re-renders 

//     const [listOfRestaurants, setListOfRestaurants] = useState([
//         {
//         "info": {
//           "id": "587665",
//           "name": "Subway",
//           "cloudinaryImageId": "RX_THUMBNAIL/IMAGES/VENDOR/2024/6/4/518837c9-252e-47e6-90d3-055f0ea2c79d_587665.JPG",
//           "costForTwo": "₹350 for two",
//           "cuisines": [
//             "Salads",
//             "Snacks",
//             "Desserts",
//             "Beverages"
//           ],
//           "avgRating": 3.7,
//           "sla": {
//             "deliveryTime": 20,
//           },
          
//         }
//         },
//         {
//     "info": {
//       "id": "587666",
//       "name": "My shop",
//       "cloudinaryImageId": "RX_THUMBNAIL/IMAGES/VENDOR/2024/6/4/518837c9-252e-47e6-90d3-055f0ea2c79d_587665.JPG",
//       "costForTwo": "₹350 for two",
//       "cuisines": [
//         "Salads",
//         "Snacks",
//         "Desserts",
//         "Beverages"
//       ],
//       "avgRating": 4.7,
//       "sla": {
//         "deliveryTime": 20,
//       },
      
//     }
//         }, 
//         {
// "info": {
//   "id": "587667",
//   "name": "McDonalds",
//   "cloudinaryImageId": "RX_THUMBNAIL/IMAGES/VENDOR/2024/6/4/518837c9-252e-47e6-90d3-055f0ea2c79d_587665.JPG",
//   "costForTwo": "₹350 for two",
//   "cuisines": [
//     "Salads",
//     "Snacks",
//     "Desserts",
//     "Beverages"
//   ],
//   "avgRating": 4.2,
//   "sla": {
//     "deliveryTime": 20,
//   },
  
// }
//         }
//     ]);

    // normal js variable
//     let listOfRestaurantsJS = [
//         {
//             "info": {
//               "id": "587665",
//               "name": "Subway",
//               "cloudinaryImageId": "RX_THUMBNAIL/IMAGES/VENDOR/2024/6/4/518837c9-252e-47e6-90d3-055f0ea2c79d_587665.JPG",
//               "costForTwo": "₹350 for two",
//               "cuisines": [
//                 "Salads",
//                 "Snacks",
//                 "Desserts",
//                 "Beverages"
//               ],
//               "avgRating": 3.7,
//               "sla": {
//                 "deliveryTime": 20,
//               },
              
//             }
//     },
//     {
//         "info": {
//           "id": "587666",
//           "name": "My shop",
//           "cloudinaryImageId": "RX_THUMBNAIL/IMAGES/VENDOR/2024/6/4/518837c9-252e-47e6-90d3-055f0ea2c79d_587665.JPG",
//           "costForTwo": "₹350 for two",
//           "cuisines": [
//             "Salads",
//             "Snacks",
//             "Desserts",
//             "Beverages"
//           ],
//           "avgRating": 4.7,
//           "sla": {
//             "deliveryTime": 20,
//           },
          
//         }
// }, 
// {
//     "info": {
//       "id": "587667",
//       "name": "McDonalds",
//       "cloudinaryImageId": "RX_THUMBNAIL/IMAGES/VENDOR/2024/6/4/518837c9-252e-47e6-90d3-055f0ea2c79d_587665.JPG",
//       "costForTwo": "₹350 for two",
//       "cuisines": [
//         "Salads",
//         "Snacks",
//         "Desserts",
//         "Beverages"
//       ],
//       "avgRating": 4.2,
//       "sla": {
//         "deliveryTime": 20,
//       },
      
//     }
// }]

// useEffect(() => {}, []); // empty array means it will run only once when the component is mounted 

// if no dependency array is given, useeffect will run everytime the component is rendered
// if empty dependency array is given, useeffect will run only once when the component is mounted

    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to top
        fetchData();    
    },[]); 

    // Real-time search effect
    useEffect(() => {
        if (searchText.trim() === '') {
            setFileteredListOfRestaurants(listOfRestaurants);
        } else {
            const filteredRestaurants = listOfRestaurants.filter((restaurant) => 
                restaurant.info.name.toLowerCase().includes(searchText.toLowerCase()) ||
                restaurant.info.cuisines.some(cuisine => 
                    cuisine.toLowerCase().includes(searchText.toLowerCase())
                )
            );
            setFileteredListOfRestaurants(filteredRestaurants);
        }
    }, [searchText, listOfRestaurants]);


    const fetchData = async () => {
        try {
            setIsLoading(true);
            // const data = await fetch("https://www.swiggy.com/dapi/restaurants/list/v5?lat=11.084887052121998&lng=76.99808970093727&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING");
            
            const data = await fetch("https://foodfire.onrender.com/api/restaurants?lat=11.084887052121998&lng=76.99808970093727&page_type=DESKTOP_WEB_LISTING");

            const json = await data.json();
            // console.log(json);
            //optional chaining operator
            setListOfRestaurants(json?.data?.cards[1]?.card?.card?.gridElements?.infoWithStyle?.restaurants);
            setFileteredListOfRestaurants(json?.data?.cards[1]?.card?.card?.gridElements?.infoWithStyle?.restaurants);
        } catch (error) {
            console.error("Error fetching restaurants:", error);
        } finally {
            setIsLoading(false);
        }
    }


    const onlineStatus = useOnlineStatus();

    if (!onlineStatus) {
        return <h1 className="offline">You are offline!!! Please check your connection!</h1>;
    }


// conditional rendering

    // if (listOfRestaurants.length === 0) {
    //     return <Shimmer />;
    // }
    return  (
        <div className='pt-[80px]'>

            <div className='filter flex max-sm:flex-col items-center justify-between m-2 p-2 mx-5 sm:mx-20'>
                <div className="flex justify-center mt-2 pt-2 sm:p-4 sm:w-6/12 w-full sm:h-[70px] font-palanquin font-semibold">  
                    <input 
                        type="text" 
                        className=" font-palanquin border px-2 max-sm:py-1 border-solid border-gray-300 rounded-md w-5/6 sm:w-4/6 search-input" 
                        placeholder="Search for restaurants or cuisines..." value={searchText} onChange={(event)=>{
                        setSearchText(event.target.value);
                    }}/>
                    {searchText && (
                        <button 
                            className="bg-gray-300 font-palanquin px-4 rounded-sm mx-2 hover:bg-gray-400 transition-colors"
                            onClick={() => {
                                setSearchText('');
                            }}
                        >
                            Clear
                        </button>
                    )}
                </div>

                <div className=" flex justify-center mt-1 pt-2 sm:my-4 sm:py-4 max-sm:w-full sm:h-[70px]">
                    <button className="filter-btn font-palanquin flex items-center justify-center gap-1 bg-yellow-100  px-4 rounded-sm sm:mx-2 font-palanquin font-semibold hover:bg-yellow-200 transition-colors" 
                            onClick={() => {
                                const filteredRestaurants = listOfRestaurants.filter((restaurant) => restaurant.info.avgRating > 4.3);
                                setFileteredListOfRestaurants(filteredRestaurants);
                    }}>Top Rated Restaurants <span><RiArrowUpDownFill/></span></button>

                    <button 
                        className="filter-btn font-palanquin flex items-center justify-center gap-1 bg-blue-100 px-4 rounded-sm sm:mx-2 font-palanquin font-semibold hover:bg-blue-200 transition-colors"
                        onClick={() => {
                            setFileteredListOfRestaurants(listOfRestaurants);
                        }}
                    >
                        Show All
                    </button>
                </div>   
            </div>
                

            
            <div>
                <h1 className="text-2xl sm:text-4xl  font-poppins font-bold text-center">Nearby Food Joints</h1>
            </div>
            {
                isLoading ? <Shimmer /> 
                    :
                    <div className='restau-container flex flex-wrap justify-center sm:justify-between sm:mx-20 sm:my-2'>

                {filteredListOfRestaurants.length === 0 ? (
                    <div className="w-full text-center py-10">
                        {searchText ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">🔍</div>
                                <h2 className="text-2xl font-bold text-gray-700 mb-2">No restaurants found</h2>
                                <p className="text-gray-500 mb-4">We couldn't find any restaurants matching "{searchText}"</p>
                                <button 
                                    className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                                    onClick={() => {
                                        setSearchText('');
                                        setFileteredListOfRestaurants(listOfRestaurants);
                                    }}
                                >
                                    Clear Search
                                </button>
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-state-icon">🍽️</div>
                                <h2 className="text-2xl font-bold text-gray-700 mb-2">No restaurants available</h2>
                                <p className="text-gray-500">Please try again later or check your internet connection</p>
                            </div>
                        )}
                    </div>
                ) : (
                    filteredListOfRestaurants.map((restaurant) => (
                        <Link to={'/restaurants/'+restaurant.info.id} key={restaurant.info.id}>
                            {
                                restaurant.info.avgRating < 4.2  ? <RestaurantCardPromoted resData={restaurant} /> : <RestaurantCard resData={restaurant} />
                            }
                        </Link>
                    ))
                )} 
                
                {/* this not a good apporach  */}
                {/* <RestaurantCard resData={resList[0]} />
                <RestaurantCard resData={resList[1]} />
                <RestaurantCard resData={resList[2]} />
                <RestaurantCard resData={resList[3]} />
                <RestaurantCard resData={resList[4]} />
                <RestaurantCard resData={resList[5]} />
                <RestaurantCard resData={resList[6]} />
                <RestaurantCard resData={resList[7]} />
                <RestaurantCard resData={resList[8]} />
                <RestaurantCard resData={resList[9]} />
                <RestaurantCard resData={resList[10]} />
                <RestaurantCard resData={resList[11]} />
                <RestaurantCard resData={resList[12]} />
                <RestaurantCard resData={resList[13]} /> 
                <RestaurantCard resData={resList[19]} /> */}
            </div> 
            }
            

            {/* <div className='filter flex items-center justify-center bg-gray-100'>
                <div className="m-4 p-4">  
                    <input 
                        type="text" 
                        className="border border-solid border-gray-300 rounded-md"
                        value={loggedInUser} 
                        onChange={(event)=> setUserInfo(event.target.value)}/>
                </div>
            </div> */}
            
            
            
        </div>
    );
};



export default Body;