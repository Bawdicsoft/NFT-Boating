import React from 'react';
import { Form } from "./Form";
import './Booking.css'

const Booking = () => {
    return (
        <div>
            <div className='container'>
                <div>
                <Form />
                </div>

                <div style={{border:'white solid 1px',width: '24rem', padding:'20px'}}>
                    <h3>Price Details</h3>
                    <div className='price-details'>
                        <p>Hello</p>
                        <p>20 eth</p>
                    </div>
                    <div style={{borderBottom:'1px solid white'}} className='price-details'>
                        <p>Hello</p>
                        <p>30 rth</p>
                    </div>
                    <div className='price-details'>
                        <p>Total Price</p>
                        <p>50 eth</p>
                    </div>
                </div>
            </div>
            
        </div>
    );
}

export default Booking;
