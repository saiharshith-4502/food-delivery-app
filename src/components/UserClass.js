import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter, faLinkedin, faMedium, faInstagram, faReddit } from '@fortawesome/free-brands-svg-icons';
import profileImage from './profile.jpg'; // Your profile image

import { Link } from 'react-router-dom';
import UserInfoShimmer from './UserInfoShimmer';

class UserClass extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userInfo: {
                name: 'Harshith Karanam',
                location: 'Hyderabad, India',
                avatar_url: profileImage,
                loaded: true
            },
        };
    }

    async componentDidMount(){  
        // Using local data instead of API call
        // Simulating loading time for smooth UX
        setTimeout(() => {
            this.setState({
                userInfo: {
                    name: 'Harshith Karanam',
                    location: 'Hyderabad, India', 
                    avatar_url: profileImage,
                    loaded: true
                }
            });
        }, 500);
    }

  render() {
    const { name, location,avatar_url } = this.state.userInfo  ;
    return (
        
        <div className="user-card flex flex-col sm:flex-row items-center w-auto p-1 my-3 border border-slate-100 rounded-md shadow-xl">
            {
                this.state.userInfo.name === 'Dummy' ? <UserInfoShimmer /> 
                    : <>
                        <img src={avatar_url} className='avatar w-[250px] object-cover object-center' alt="avatar" />

            
                        <div className='user-info flex flex-col justify-center font-poppins p-1'>
                            <h3 className='py-2 text-sm sm:text-md'><span className='font-bold'>Name:</span> {name}</h3>
                            <h4 className='py-2 text-sm sm:text-md'><span className='font-bold'>Location:</span> {location}</h4>
                            <h4 className='py-2 text-sm sm:text-md'><span className='font-bold'>Role:</span> Frontend Developer</h4>
                            <h4 className='py-2 text-sm sm:text-md'><span className='font-bold'>Mail:</span> karanamsaiharshith@gmail.com</h4>
                            <div className='flex gap-3 justify-center sm:mt-5'>
                                <p className='text-sm text-gray-600 font-semibold'>Connect with me for collaborations!</p>
                            </div>
                        </div>
                    </> 
            }
            
            



            {/* <h4>Count : {count} (class)</h4>
            <h4>count2 : {count2} (class)</h4>
            <button onClick={() => {
                // Never update the state directly using this.state.count = this.state.count + 1;
                // Always use setState method to update the state
                this.setState({ 
                    count: count + 1,
                    count2: count2 + 2 
                 });
            }}>Increment</button> */}

        </div>
    );
  }
}

export default UserClass;