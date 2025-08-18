import RestaurantCardShimmer from "./RestaurantCardShimmer";

// Desc: Shimmer effect for loading
// Shimmer ui

const Shimmer = () => {
    return (
        <div className="pt-[80px]">
            <div className="flex flex-wrap justify-center sm:justify-between sm:mx-20 sm:my-2">
                {Array(12).fill("").map((_, index) => (
                    <div key={index} className="w-72 h-80 bg-gray-200 m-2 rounded-lg animate-pulse">
                        <div className="w-full h-48 bg-gray-300 rounded-t-lg animate-pulse"></div>
                        <div className="p-4">
                            <div className="h-4 bg-gray-300 rounded mb-2 animate-pulse"></div>
                            <div className="h-3 bg-gray-300 rounded mb-2 w-3/4 animate-pulse"></div>
                            <div className="h-3 bg-gray-300 rounded w-1/2 animate-pulse"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Shimmer;