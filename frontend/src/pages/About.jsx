import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>

      <div className='text-center text-5xl pt-10 text-[#707070]'>
        <p>Subscription <span className='text-gray-700 font-semibold'>PLAN</span></p>
      </div>

      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer text-center'>
          <b className="text-4xl">6 Month Pickle Pass</b>
          <h1 className="text-xl">RM35</h1>
          <p><b>Complimentary Paddle and Ball Rentals:</b> Members enjoy free access to paddles and balls during their play sessions.</p>
          <p><b>Priority Booking – 30 Days in Advance:</b> Secure your court up to 30 days ahead, ensuring you get your preferred play times.</p>
          <p><b>Discounted Court Rentals:</b> Enjoy an exclusive rate of RM30 per hour (regularly RM39) for all court bookings.</p>
          <p><b>Access to Pickle Points Rewards Program:</b> Earn rewards for every booking, referral, and event participation, redeemable for exciting prizes.</p>
          <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-800 transition-all duration-300">
            Subscribe
          </button>
        </div>

        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer text-center'>
          <b className="text-4xl">12 Month Pickle Pass</b>
          <h1 className="text-xl">RM60</h1>
          <p><b>Complimentary Paddle and Ball Rentals:</b> Members enjoy free access to paddles and balls during their play sessions.</p>
          <p><b>Priority Booking – 30 Days in Advance:</b> Secure your court up to 30 days ahead, ensuring you get your preferred play times.</p>
          <p><b>Discounted Court Rentals:</b> Enjoy an exclusive rate of RM30 per hour (regularly RM39) for all court bookings.</p>
          <p><b>Access to Pickle Points Rewards Program:</b> Earn rewards for every booking, referral, and event participation, redeemable for exciting prizes.</p>
          <p><b>Limited Edition Pickle Club T-Shirt:</b> Get your hands on an exclusive, members-only Pickle Club t-shirt, designed just for our community.</p>
          <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-800 transition-all duration-300">
            Subscribe
          </button>
        </div>
      </div>

    </div>
  )
}

export default About
