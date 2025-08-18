import React , {lazy, Suspense,useEffect,useState} from 'react';
import ReactDOM from 'react-dom/client';
import Header from './components/Header';
import Body from './components/Body';
import About from './components/About';
import Contact from './components/Contact';
import Error from './components/Error';
import RestaurantMenu from './components/RestaurantMenu';
import {provider} from 'react-redux';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import {Provider} from 'react-redux';
import UserContext from './utils/UserContext';
import appStore from './utils/appStore';
import Cart from './components/Cart';
import ScheduledOrders from './components/ScheduledOrders';
import OrderStatusUpdater from './components/OrderStatusUpdater';
import Footer from './components/Footer';

//chunking
//lazy loading
//code splitting
//dynamic bundling
// on demand loading
const TasteHubGrocery = lazy(() => import('./components/TasteHubGrocery'));

const AppLayout = () => {
    const [userInfo, setUserInfo] = useState(null);
    // authenticaion code
    useEffect(() => {
        const data = {
            name: 'Harshith',
        };
 
        setUserInfo(data.name);
    }, []);

    return (
        <Provider store={appStore}>
        <UserContext.Provider value={{loggedInUser: userInfo, setUserInfo}}>
            <div className='app'>
                
                <Header />
                
                <Outlet />

                <Footer />
                
                {/* Background component for automatic order status updates */}
                <OrderStatusUpdater />
                
            </div>
        </UserContext.Provider>
        </Provider>
    );
};


const appRouter = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        children: [
            {
                path: '/',
                element: <Body />
            },
            {
                path: '/about',
                element: <About />
            },
            {
                path: '/contact',
                element: <Contact />
            },
            {
                path: '/grocery',
                element: (
                    <Suspense fallback = {<h1>loading....</h1>}>
                        <TasteHubGrocery />
                    </Suspense>)
            },
            {
                path: '/cart',
                element: <Cart />
            },
            {
                path: '/scheduled-orders',
                element: <ScheduledOrders />
            },
            {
                path: '/restaurants/:resID',
                element: <RestaurantMenu />
            },
            
        ], 
        errorElement: <Error />
    },
    
]);



const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<RouterProvider router={appRouter}/>);