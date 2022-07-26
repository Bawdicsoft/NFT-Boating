import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AddressForm from "./AddressForm";
import Review from "./Review";
import { useContextAPI } from "../../ContextAPI";
import { auth, db } from "../../DB/firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, getDocs, collection, where, addDoc, doc, updateDoc } from "firebase/firestore";

const steps = ["Shipping address", "Review your order"];

function getStepContent(step) {
  switch (step) {
    case 0:
      return <AddressForm />;
    case 1:
      return <Review />;
    default:
      throw new Error("Unknown step");
  }
}

const theme = createTheme();

export default function Booking() {
  const { Contract } = useContextAPI();

  const buyOwnership = async () => {
    let ab = await Contract.owner().then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log(err);
    });
  };
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const [user, loading, error] = useAuthState(auth);
  console.log("My user:", user);
  const [data, setData] = React.useState();

  React.useEffect(() => {

    const databaseRef = collection(db, "users");
    getDocs(databaseRef)
      .then((res) => {
        res.docs.map((doc) => {
          if (doc.data().uid == user.uid) {
            setData({ ...doc.data(), id: doc.id });
          }
        });
        


      })
      .catch((err) => {
        console.log(err);
      });

  }, []);


  console.log({ data });


 const addBuyNFT = async () => {
  //  if(data.id)
   const fieldToEdit = doc(db, "users", data.id);
   await updateDoc(fieldToEdit, {hi: {name1: 'farooq', name2: 'nabeel'}}).then(res => console.log(res)).catch(err => console.log(err));
 };

  return (
    <ThemeProvider theme={theme}>
      <Container
        component="main"
        maxWidth="sm"
        style={{ paddingTop: "50px" }}
        sx={{ mb: 4 }}
      >
        <Typography component="h1" variant="h4" align="center">
          Buy NFT
        </Typography>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <React.Fragment>
            {activeStep === steps.length ? (
              <React.Fragment>
                <Typography variant="h5" gutterBottom>
                  Thank you for your order.
                </Typography>
                <Typography variant="subtitle1">
                  Your order number is #2001539. We have emailed your order
                  confirmation, and will send you an update when your order has
                  shipped.
                </Typography>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {getStepContent(activeStep)}
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                      Back
                    </Button>
                  )}

                  {activeStep === steps.length - 1 ? (
                    <Button
                      variant="contained"
                      onClick={buyOwnership}
                      sx={{ mt: 3, ml: 1 }}
                    >
                      Place order
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mt: 3, ml: 1 }}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </React.Fragment>
            )}
          </React.Fragment>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
