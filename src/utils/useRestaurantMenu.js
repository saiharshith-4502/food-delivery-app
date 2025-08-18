import { useState, useEffect } from 'react';
import { MENU_API } from "../utils/constants";

const useRestaurantMenu = (resID) => {

    const [resInfo, setResInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMenu();    
    }, [resID]);

    const fetchMenu = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await fetch(MENU_API + resID);
            
            if (!data.ok) {
                throw new Error(`HTTP error! status: ${data.status}`);
            }
            
            const menu = await data.json();
            setResInfo(menu);
        } catch (err) {
            console.error("Error fetching menu:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    return { resInfo, isLoading, error };
};

export default useRestaurantMenu;