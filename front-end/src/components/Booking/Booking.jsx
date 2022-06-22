import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Container } from 'react-bootstrap';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DarkNavbar from '../Header/DarkNavbar'
import './Booking.css';


const Booking = () => {
    const [value, setValue] = useState(new Date('2018-01-01T00:00:00.000Z'));
    const [date, setDate] = useState(('2018-01-01T00:00:00.000Z'));

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            email: data.get('email'),
            password: data.get('password'),
        });
    };
    return (<>
        <DarkNavbar />  
        <Container>

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
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="dob"
                            label="Date"
                            type="date"
                            id="dob"
                            autoComplete="dob"
                        />
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                        </LocalizationProvider>
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

            {/* Other Details */}
        </Container>
    </>);
}

export default Booking;
