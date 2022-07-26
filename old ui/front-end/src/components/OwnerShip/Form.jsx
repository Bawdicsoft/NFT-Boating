import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import firebase from 'firebase'
import { db } from '../../firebase'
import './OwnerShip.css'
import { useNavigate } from "react-router-dom";
import { Card, Col, Text } from "@nextui-org/react";


export default function Form() {
  let navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    db.collection("userData").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      name: data.get('name'),
      email: data.get('email'),
      phone: data.get('phone'),
      dob: data.get('dob'),

    })
    alert("You Buy your Ownership Successfully")
    navigate("/booking");
    console.log("Data added", data);
  };

  return (<>
    <div className='contain1'>
      {/* <CssBaseline /> */}
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
            // onChange={e => setName(e.target.value)}
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
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
          <TextField
            margin="normal"
            required
            fullWidth
            name="dob"
            label="Date of Birth"
            type="date"
            id="dob"
            autoComplete="dob"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Send
          </Button>
        </Box>
      </Box>

      <Card id='card'>
                <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
                    <Col>
                        <Text size={20} weight="bold" transform="uppercase" color="#black">
                            Ownership Details
                        </Text>
                        <Text h4 color="white">
                            Name:
                            Address:
                            Phone:
                        </Text>
                    </Col>
                </Card.Header>
                <Card.Image
                    src="https://images.unsplash.com/photo-1508272961731-dc692d634a79?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=751&q=80"
                    // width="100%"
                    id='card-image'
                    // height={540}
                    objectFit="cover"
                    alt="Card image background"
                />
            </Card>
    </div>
  </>);
}