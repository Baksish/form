"use client";

import { useState } from "react";
import { 
  TextField, 
  Button, 
  FormControlLabel, 
  Checkbox,
  Box,
  Typography,
  Paper,
  Container
} from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { 
  Description, 
  ContactMail, 
  Business,
  CheckCircle,
  RadioButtonUnchecked 
} from '@mui/icons-material';

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

const steps = [
  {
    label: "Basic Information",
    icon: <Description />,
    description: "Restaurant name, type, and basic details"
  },
  {
    label: "Contact Details",
    icon: <ContactMail />,
    description: "Contact information and address"
  },
  {
    label: "Business Details",
    icon: <Business />,
    description: "Tax, timing, and payment information"
  }
];

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
      // Validate required fields before submission
      const requiredFields = [
        'restaurant_name',
        'restaurant_email',
        'restaurant_password',
        'restaurant_address',
        'restaurant_phone_number',
        'restaurant_type',
        'restaurant_description',
        'restaurant_image',
        'restaurant_cgst',
        'restaurant_sgst',
        'restaurant_discount',
        'restaurant_opening_time',
        'restaurant_closing_time'
      ];

      const missingFields = requiredFields.filter(field => !formData[field]);
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.restaurant_email)) {
        throw new Error('Please enter a valid email address');
      }

      // Validate password length
      if (formData.restaurant_password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      // Validate phone number
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(formData.restaurant_phone_number)) {
        throw new Error('Please enter a valid 10-digit phone number');
      }

      // Format the data before sending
      const formattedData = {
        ...formData,
        restaurant_uuid: `REST_${Date.now()}`,
        food_categories: typeof formData.food_categories === 'string' 
          ? formData.food_categories.split(',').map(cat => cat.trim()).filter(cat => cat)
          : formData.food_categories,
        restaurant_cgst: String(formData.restaurant_cgst),
        restaurant_sgst: String(formData.restaurant_sgst),
        restaurant_discount: String(formData.restaurant_discount)
      };

      const response = await fetch(`${API_URL}/api/restaurant/create-restaurant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to create restaurant');
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
      console.error('Error details:', error);
      alert(`Error: ${error.message || 'An unknown error occurred'}`);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box className="space-y-6">
            <TextField
              fullWidth
              label="Restaurant Name"
              name="restaurant_name"
              value={formData.restaurant_name}
              onChange={handleChange}
              required
              variant="outlined"
              className="bg-gray-50"
              InputProps={{
                className: "rounded-lg"
              }}
              helperText="Enter your restaurant's official name"
            />
            <TextField
              fullWidth
              label="Restaurant Type"
              name="restaurant_type"
              value={formData.restaurant_type}
              onChange={handleChange}
              required
              variant="outlined"
              className="bg-gray-50"
              InputProps={{
                className: "rounded-lg"
              }}
              helperText="e.g., Fine Dining, Casual Dining, Fast Food"
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
              className="bg-gray-50"
              InputProps={{
                className: "rounded-lg"
              }}
              helperText="Describe your restaurant, cuisine, and specialties"
            />
            <TextField
              fullWidth
              label="Image URL"
              name="restaurant_image"
              value={formData.restaurant_image}
              onChange={handleChange}
              required
              variant="outlined"
              className="bg-gray-50"
              InputProps={{
                className: "rounded-lg"
              }}
              helperText="URL of your restaurant's main image"
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
      <div className="flex min-h-screen bg-gray-100">
        {/* Left Sidebar */}
        <div className="w-80 bg-white shadow-lg p-6 fixed h-full">
          <Typography variant="h5" className="mb-8 font-bold text-gray-800">
            Baksish.
          </Typography>
          
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div 
                key={step.label}
                className={`flex items-start space-x-4 p-4 rounded-lg transition-all
                  ${activeStep === index ? 'bg-blue-50 border-l-4 border-blue-500' : ''}
                  ${activeStep > index ? 'text-green-600' : 'text-gray-600'}`}
              >
                <div className="mt-1">
                  {activeStep > index ? <CheckCircle /> : 
                   activeStep === index ? step.icon : 
                   <RadioButtonUnchecked />}
                </div>
                <div>
                  <Typography variant="subtitle1" className="font-semibold">
                    {step.label}
                  </Typography>
                  <Typography variant="body2" className="text-gray-500">
                    {step.description}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-80 p-8">
          <Container maxWidth="md">
            <Paper elevation={3} className="p-8 bg-white rounded-xl">
              <Typography variant="h4" className="mb-8 font-bold text-gray-800 border-b pb-4">
                {steps[activeStep].label}
              </Typography>

              <form onSubmit={handleSubmit} className="space-y-6">
                {renderStepContent(activeStep)}

                <div className="flex justify-between pt-6 border-t mt-8">
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    variant="outlined"
                    className="px-6"
                  >
                    Back
                  </Button>
                  
                  {activeStep === steps.length - 1 ? (
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      className="px-8"
                    >
                      Submit Registration
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      className="px-6"
                    >
                      Continue
                    </Button>
                  )}
                </div>
              </form>
            </Paper>
          </Container>
        </div>
      </div>
    </ThemeProvider>
  );
}