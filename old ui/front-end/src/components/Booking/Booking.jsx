import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Container } from 'react-bootstrap';
import Typography from '@mui/material/Typography';
import DarkNavbar from '../Header/DarkNavbar'
import SelectDate from "./Date";
import './Booking.css';
import { Link } from 'react-router-dom';

const Booking = () => {

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            email: data.get('email'),
            password: data.get('password'),
        });
    };
    return (
      <>
        <DarkNavbar />
        <Container>
          <Typography className="heading" component="h1" variant="h4">
            Booking Details
          </Typography>
          {/* Form */}
          <div className="contain1">
            <Box
              sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                // border:'red solid 1px'
              }}
            >
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1 }}
              >
                <SelectDate />

<<<<<<< HEAD
            <Typography className='heading' component="h1" variant="h4">
                Booking Details
            </Typography>
            {/* Form */}
            <div className='contain1'>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        // border:'red solid 1px'
                    }}
                >
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <SelectDate />

                        {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
=======
                {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
>>>>>>> 84c027b6fbb7938391eab904b828e2a2f13f4baa
                            <Stack spacing={3}>
                                <MobileTimePicker
                                    label="Time"
                                    value={value}
                                    onChange={(newValue) => {
                                        setValue(newValue);
                                    }}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </Stack>
                        </LocalizationProvider> */}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="where"
                  label="Where"
                  name="where"
                  autoComplete="where"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="phone"
                  label="Phone"
                  type="number"
                  id="phone"
                  autoComplete="current-phone"
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  BOOK
                </Button>
              </Box>
            </Box>
          </div>

<<<<<<< HEAD
            {/* Other Details */}

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
                <div style={{ width: '24rem', padding: '20px' }}>
                    <div>
                        <img style={{ marginRight: '15px', borderRadius: '10px' }} width='100%' src="https://imgs.yachthub.com/reviews/1/0_3.jpg" alt="" />

                    </div>
                    <div style={{ borderBottom: 'black solid 1px', marginTop: '10px' }}>
                        <p>Terms and Conditions.
                            {/* <Link>
                                click here
                            </Link> */}
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
=======
          {/* Other Details */}
>>>>>>> 84c027b6fbb7938391eab904b828e2a2f13f4baa
        </Container>
      </>
    );
}

export default Booking;
