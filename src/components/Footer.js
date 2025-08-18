import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter, faLinkedin, faMedium, faInstagram, faReddit } from '@fortawesome/free-brands-svg-icons';
import logo from './footer.png';

const Footer = () => {
  return (
    <div className='bg-black sm:px-16 px-8 py-7'>
        <div className='flex justify-center'>
            <Link href="/">
                <img className='w-[190px]' src={logo} alt='TasteHub logo' />
            </Link>
        </div>

        <div className=" gap-3 flex flex-col text-white">

            <div className='flex gap-3 justify-center sm:mt-5 text-lg'>
                <p className='text-center text-white font-semibold'>Developed by Harshith</p>
            </div>
        </div>

        <div>
            <p className='text-center text-white mt-5 text-sm sm:text-lg' >© {new Date().getFullYear()} TasteHub. All rights reserved.</p>
        </div>
    </div>
  )
}

export default Footer