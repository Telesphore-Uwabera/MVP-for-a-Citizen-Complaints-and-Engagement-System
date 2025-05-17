import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  MenuItem,
  Alert,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  COMPLAINT_CATEGORIES,
  PROVINCES,
  COMPLAINT_PRIORITY,
  COMPLAINT_PRIORITY_LABELS,
} from '../constants/rwanda';
import { SelectChangeEvent } from '@mui/material/Select';
import { Province, District } from '../types/location';

const validationSchema = yup.object({
  title: yup
    .string()
    .required('Title is required')
    .min(5, 'Title should be at least 5 characters'),
  category: yup
    .string()
    .required('Category is required'),
  description: yup
    .string()
    .required('Description is required')
    .min(20, 'Description should be at least 20 characters'),
  priority: yup
    .number()
    .required('Priority is required')
    .min(1, 'Priority must be between 1 and 5')
    .max(5, 'Priority must be between 1 and 5'),
  // Optional fields
  name: yup
    .string()
    .min(2, 'Name should be at least 2 characters'),
  email: yup
    .string()
    .email('Enter a valid email'),
  phoneNumber: yup
    .string()
    .matches(/^[0-9+]+$/, 'Phone number can only contain numbers and +'),
  nationalId: yup
    .string()
    .matches(/^[0-9]+$/, 'National ID can only contain numbers'),
  // Location fields
  province: yup
    .string()
    .required('Province is required'),
  district: yup
    .string()
    .required('District is required'),
  sector: yup
    .string()
    .required('Sector is required'),
});

const ComplaintForm: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');

  const formik = useFormik({
    initialValues: {
      title: '',
      category: '',
      description: '',
      priority: COMPLAINT_PRIORITY.MEDIUM,
      name: '',
      email: '',
      phoneNumber: '',
      nationalId: '',
      province: '',
      district: '',
      sector: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        // TODO: Implement actual complaint submission
        console.log('Complaint submission:', values);
        navigate('/dashboard');
      } catch (err) {
        setError('Failed to submit complaint. Please try again.');
      }
    },
  });

  const handleProvinceChange = (event: SelectChangeEvent) => {
    const provinceId = event.target.value;
    setSelectedProvince(provinceId);
    setSelectedDistrict('');
    formik.setFieldValue('province', provinceId);
    formik.setFieldValue('district', '');
    formik.setFieldValue('sector', '');
  };

  const handleDistrictChange = (event: SelectChangeEvent) => {
    const districtId = event.target.value;
    setSelectedDistrict(districtId);
    formik.setFieldValue('district', districtId);
    formik.setFieldValue('sector', '');
  };

  const selectedProvinceData = PROVINCES.find((p: Province) => p.id === selectedProvince);
  const selectedDistrictData = selectedProvinceData?.districts.find((d: District) => d.id === selectedDistrict);

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography component="h1" variant="h4" gutterBottom>
            Submit a New Complaint
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              {/* Required Fields */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="title"
                  name="title"
                  label="Complaint Title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={formik.touched.category && Boolean(formik.errors.category)}>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    id="category"
                    name="category"
                    value={formik.values.category}
                    label="Category"
                    onChange={formik.handleChange}
                  >
                    {COMPLAINT_CATEGORIES.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.category && formik.errors.category && (
                    <FormHelperText>{formik.errors.category}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={formik.touched.priority && Boolean(formik.errors.priority)}>
                  <InputLabel id="priority-label">Priority</InputLabel>
                  <Select
                    labelId="priority-label"
                    id="priority"
                    name="priority"
                    value={formik.values.priority}
                    label="Priority"
                    onChange={formik.handleChange}
                  >
                    {Object.entries(COMPLAINT_PRIORITY_LABELS).map(([value, label]) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.priority && formik.errors.priority && (
                    <FormHelperText>{formik.errors.priority}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label="Description"
                  multiline
                  rows={4}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                />
              </Grid>

              {/* Location Fields */}
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth error={formik.touched.province && Boolean(formik.errors.province)}>
                  <InputLabel id="province-label">Province</InputLabel>
                  <Select
                    labelId="province-label"
                    id="province"
                    name="province"
                    value={formik.values.province}
                    label="Province"
                    onChange={handleProvinceChange}
                  >
                    {PROVINCES.map((province) => (
                      <MenuItem key={province.id} value={province.id}>
                        {province.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.province && formik.errors.province && (
                    <FormHelperText>{formik.errors.province}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth error={formik.touched.district && Boolean(formik.errors.district)}>
                  <InputLabel id="district-label">District</InputLabel>
                  <Select
                    labelId="district-label"
                    id="district"
                    name="district"
                    value={formik.values.district}
                    label="District"
                    onChange={handleDistrictChange}
                    disabled={!selectedProvince}
                  >
                    {selectedProvinceData?.districts.map((district) => (
                      <MenuItem key={district.id} value={district.id}>
                        {district.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.district && formik.errors.district && (
                    <FormHelperText>{formik.errors.district}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth error={formik.touched.sector && Boolean(formik.errors.sector)}>
                  <InputLabel id="sector-label">Sector</InputLabel>
                  <Select
                    labelId="sector-label"
                    id="sector"
                    name="sector"
                    value={formik.values.sector}
                    label="Sector"
                    onChange={formik.handleChange}
                    disabled={!selectedDistrict}
                  >
                    {selectedDistrictData?.sectors.map((sector: string) => (
                      <MenuItem key={sector} value={sector}>
                        {sector}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.sector && formik.errors.sector && (
                    <FormHelperText>{formik.errors.sector}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Optional Fields */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Optional Information
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Your Name (Optional)"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email Address (Optional)"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="phoneNumber"
                  name="phoneNumber"
                  label="Phone Number (Optional)"
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                  helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="nationalId"
                  name="nationalId"
                  label="National ID (Optional)"
                  value={formik.values.nationalId}
                  onChange={formik.handleChange}
                  error={formik.touched.nationalId && Boolean(formik.errors.nationalId)}
                  helperText={formik.touched.nationalId && formik.errors.nationalId}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/dashboard')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Submit Complaint
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ComplaintForm; 