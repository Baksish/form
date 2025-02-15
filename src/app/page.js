"use client";

import { useState } from "react";
import { 
  TextField, 
  Button, 
  Stepper, 
  Step, 
  StepLabel, 
  FormControlLabel, 
  Checkbox,
  Box,
  Typography,
  Paper,
  Container
} from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc2626',
    },
  },
});

const steps = ["Basic Information", "Contact Details", "Business Details"];

// Add this new component for custom step icon
const CustomStepIcon = ({ active, completed, icon }) => {
  return (
    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center
      ${active ? 'border-white bg-white text-black' : 
        completed ? 'border-white bg-white text-black' : 
        'border-gray-500 text-gray-500'}`}>
      {icon}
    </div>
  );
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    restaurant_uuid: '',
    restaurant_name: '',
    restaurant_email: '',
    restaurant_password: '',
    restaurant_address: '',
    restaurant_phone_number: '',
    restaurant_type: '',
    restaurant_description: '',
    restaurant_image: '',
    restaurant_cgst: '',
    restaurant_sgst: '',
    restaurant_discount: '',
    restaurant_opening_time: '',
    restaurant_closing_time: '',
    food_categories: [],
    isVegOnly: false,
    isCashOnly: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/restaurant/create-restaurant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          restaurant_uuid: formData.restaurant_uuid || `REST_${Date.now()}`,
          food_categories: typeof formData.food_categories === 'string' 
            ? formData.food_categories.split(',').map(cat => cat.trim())
            : formData.food_categories
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create restaurant');
      }

      alert('Restaurant created successfully!');
      setActiveStep(0);
      setFormData({
        restaurant_uuid: '',
        restaurant_name: '',
        restaurant_email: '',
        restaurant_password: '',
        restaurant_address: '',
        restaurant_phone_number: '',
        restaurant_type: '',
        restaurant_description: '',
        restaurant_image: '',
        restaurant_cgst: '',
        restaurant_sgst: '',
        restaurant_discount: '',
        restaurant_opening_time: '',
        restaurant_closing_time: '',
        food_categories: [],
        isVegOnly: false,
        isCashOnly: true
      });
    } catch (error) {
      console.error('Error:', error);
      alert(`Error creating restaurant: ${error.message || 'Unknown error occurred'}`);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box className="space-y-4">
            <TextField
              fullWidth
              label="Restaurant Name"
              name="restaurant_name"
              value={formData.restaurant_name}
              onChange={handleChange}
              required
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Restaurant Type"
              name="restaurant_type"
              value={formData.restaurant_type}
              onChange={handleChange}
              required
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Description"
              name="restaurant_description"
              value={formData.restaurant_description}
              onChange={handleChange}
              required
              multiline
              rows={4}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Image URL"
              name="restaurant_image"
              value={formData.restaurant_image}
              onChange={handleChange}
              required
              variant="outlined"
            />
          </Box>
        );

      case 1:
        return (
          <Box className="space-y-4">
            <TextField
              fullWidth
              label="Email"
              name="restaurant_email"
              type="email"
              value={formData.restaurant_email}
              onChange={handleChange}
              required
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Password"
              name="restaurant_password"
              type="password"
              value={formData.restaurant_password}
              onChange={handleChange}
              required
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="restaurant_phone_number"
              value={formData.restaurant_phone_number}
              onChange={handleChange}
              required
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Address"
              name="restaurant_address"
              value={formData.restaurant_address}
              onChange={handleChange}
              required
              multiline
              rows={3}
              variant="outlined"
            />
          </Box>
        );

      case 2:
        return (
          <Box className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <TextField
                label="CGST (%)"
                name="restaurant_cgst"
                value={formData.restaurant_cgst}
                onChange={handleChange}
                required
                variant="outlined"
              />
              <TextField
                label="SGST (%)"
                name="restaurant_sgst"
                value={formData.restaurant_sgst}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </div>
            <TextField
              fullWidth
              label="Discount (%)"
              name="restaurant_discount"
              value={formData.restaurant_discount}
              onChange={handleChange}
              required
              variant="outlined"
            />
            <div className="grid grid-cols-2 gap-4">
              <TextField
                label="Opening Time"
                name="restaurant_opening_time"
                type="time"
                value={formData.restaurant_opening_time}
                onChange={handleChange}
                required
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Closing Time"
                name="restaurant_closing_time"
                type="time"
                value={formData.restaurant_closing_time}
                onChange={handleChange}
                required
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </div>
            <TextField
              fullWidth
              label="Food Categories"
              name="food_categories"
              value={formData.food_categories}
              onChange={handleChange}
              helperText="Enter categories separated by commas"
              variant="outlined"
            />
            <div className="flex space-x-4">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isVegOnly}
                    onChange={handleChange}
                    name="isVegOnly"
                  />
                }
                label="Veg Only Restaurant"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isCashOnly}
                    onChange={handleChange}
                    name="isCashOnly"
                  />
                }
                label="Cash Only"
              />
            </div>
          </Box>
        );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" className="py-10">
        <Paper elevation={3} className="p-8">
          <Typography variant="h4" className="text-center mb-8 font-bold">
            Restaurant Registration
          </Typography>

          <Stepper activeStep={activeStep} className="mb-8">
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <form onSubmit={handleSubmit}>
            {renderStepContent(activeStep)}

            <Box className="mt-8 flex justify-between">
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
              >
                Back
              </Button>
              
              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Submit
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                >
                  Next
                </Button>
              )}
            </Box>
          </form>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}