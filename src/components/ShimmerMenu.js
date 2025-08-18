const ShimmerMenu = () => {
    return (
        <div className="pt-[80px] mx-4 my-6 sm:mx-56 sm:my-9">
            {/* Restaurant Header Shimmer */}
            <div className="flex flex-col justify-center items-center mb-8">
                <div className="h-8 bg-gray-300 rounded w-64 mb-4 animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-48 animate-pulse"></div>
            </div>
            
            {/* Restaurant Info Shimmer */}
            <div className="flex justify-between items-center mb-6">
                <div className="h-6 bg-gray-300 rounded w-32 animate-pulse"></div>
                <div className="h-6 bg-gray-300 rounded w-24 animate-pulse"></div>
            </div>

            {/* Menu Categories Shimmer */}
            <div className="space-y-4">
                {Array(6).fill("").map((_, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 shadow-md card-hover">
                        {/* Category Header */}
                        <div className="flex justify-between items-center mb-4">
                            <div className="h-6 bg-gray-300 rounded w-40 animate-pulse"></div>
                            <div className="h-4 bg-gray-300 rounded w-8 animate-pulse"></div>
                        </div>
                        
                        {/* Menu Items */}
                        <div className="space-y-4">
                            {Array(3).fill("").map((_, itemIndex) => (
                                <div key={itemIndex} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover-scale">
                                    <div className="w-20 h-20 bg-gray-300 rounded-lg animate-pulse"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                                        <div className="h-3 bg-gray-300 rounded w-1/2 animate-pulse"></div>
                                        <div className="h-3 bg-gray-300 rounded w-1/3 animate-pulse"></div>
                                    </div>
                                    <div className="w-16 h-8 bg-gray-300 rounded animate-pulse"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShimmerMenu;