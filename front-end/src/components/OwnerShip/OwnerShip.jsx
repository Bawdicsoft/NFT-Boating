import React from 'react';
import Form from "./Form";
import './OwnerShip.css'
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import DarkNavbar from '../Header/DarkNavbar'




const OwnerShip = () => {
    return (<div id='bg-clr'>
        <DarkNavbar />
        {/* <Link to='/hello'>
        <ArrowBackIcon></ArrowBackIcon>
        </Link> */}
        <Typography className='heading' component="h1" variant="h4">
            Buy Ownership
        </Typography>
        <Container className='d-flex justify-content-evenly flex-wrap' component="main" maxWidth="s">
            {/* <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}> */}

            <Form />

            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    // border: 'grey solid 1px',
                    borderRadius: '10px'

                }}
            >
                <div style={{  width: '24rem', padding: '20px' }}>
                    <div>
                        <img style={{ marginRight: '15px', borderRadius: '10px' }} width='100%' src="https://imgs.yachthub.com/reviews/1/0_3.jpg" alt="" />

                    </div>
                    <div style={{ borderBottom: 'black solid 1px', marginTop: '10px' }}>
                        <p>Terms and Conditions.
                            <Link>
                                click here
                            </Link>
                        </p>

                    </div>
                    <Typography style={{ marginTop: '10px' }} component="h1" variant="h5">
                        Price Details
                    </Typography>
                    <div className='price-details'>
                        <p>Hello</p>
                        <p>20 eth</p>
                    </div>
                    <div style={{ borderBottom: '1px solid black' }} className='price-details'>
                        <p>Hello</p>
                        <p>30 rth</p>
                    </div>
                    <div className='price-details'>
                        <p>Total Price</p>
                        <p>50 eth</p>
                    </div>
                </div>
            </Box>


            {/* </div> */}
        </Container>
    </div>);
}

export default OwnerShip;
