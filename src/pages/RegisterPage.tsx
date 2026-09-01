import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material';
import { authApi } from '../services/api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!form.fullName.trim()) {
      setError('Full name is required.');
      return;
    }

    if (!form.email.trim()) {
      setError('Email is required.');
      return;
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        fullName: form.fullName,
        email: form.email,
        username: form.username || form.email.split('@')[0],
        password: form.password
      };

      await authApi.register(payload);
      setSuccess('Registration successful. Redirecting to login...');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err: unknown) {
      let message = 'Registration failed. Please try again.';

      if (err && typeof err === 'object') {
        const axiosError = err as { response?: { data?: { message?: string } }; code?: string; message?: string };

        if (axiosError.response?.data?.message) {
          message = axiosError.response.data.message;
        } else if (axiosError.code === 'ERR_NETWORK' || axiosError.message?.toLowerCase().includes('network')) {
          message = 'The backend is not running or is unreachable. Start the Spring Boot API and confirm VITE_API_BASE_URL is correct.';
        } else if (axiosError.message) {
          message = axiosError.message;
        }
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        px: 2,
        py: 4,
        background: '#071b2b',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center'
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 1100 }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '3rem', md: '5.2rem' },
            lineHeight: 0.95,
            fontWeight: 800,
            color: '#edf2f7',
            letterSpacing: '-0.06em',
            mb: 2
          }}
        >
          Create account
        </Typography>

        <Typography
          variant="h5"
          sx={{
            fontSize: { xs: '1.2rem', md: '1.9rem' },
            fontWeight: 400,
            color: '#a8bdce',
            mb: 3
          }}
        >
          Register to access SentinelCore SecureOps.
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              width: '100%',
              maxWidth: 1100,
              background: 'rgba(46, 17, 17, 0.92)',
              color: '#fff',
              border: '1px solid rgba(248,113,113,0.3)',
              borderRadius: 2,
              '& .MuiAlert-icon': { color: '#ff6b6b' },
              '& .MuiAlert-message': { fontSize: '1.15rem', fontWeight: 500 }
            }}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
            {success}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ maxWidth: 1100, width: '100%' }}
        >
          <Stack spacing={2}>
            <TextField
              label="Full Name"
              fullWidth
              value={form.fullName}
              onChange={(e) => updateField('fullName', e.target.value)}
              variant="standard"
              InputLabelProps={{ sx: { color: '#a8bdce', fontSize: '1.2rem', mb: 1 } }}
              InputProps={{
                disableUnderline: true,
                sx: {
                  color: '#f8fafc',
                  fontSize: '1.2rem',
                  borderBottom: '1px solid rgba(148,163,184,0.65)',
                  background: 'transparent',
                  pt: 1,
                  pb: 0.5,
                  minHeight: 52
                }
              }}
            />

            <TextField
              label="Email"
              type="email"
              fullWidth
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              variant="standard"
              InputLabelProps={{ sx: { color: '#a8bdce', fontSize: '1.2rem', mb: 1 } }}
              InputProps={{
                disableUnderline: true,
                sx: {
                  color: '#f8fafc',
                  fontSize: '1.2rem',
                  borderBottom: '1px solid rgba(148,163,184,0.65)',
                  background: 'transparent',
                  pt: 1,
                  pb: 0.5,
                  minHeight: 52
                }
              }}
            />

            <TextField
              label="Username"
              fullWidth
              value={form.username}
              onChange={(e) => updateField('username', e.target.value)}
              variant="standard"
              InputLabelProps={{ sx: { color: '#a8bdce', fontSize: '1.2rem', mb: 1 } }}
              InputProps={{
                disableUnderline: true,
                sx: {
                  color: '#f8fafc',
                  fontSize: '1.2rem',
                  borderBottom: '1px solid rgba(148,163,184,0.65)',
                  background: 'transparent',
                  pt: 1,
                  pb: 0.5,
                  minHeight: 52
                }
              }}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
              variant="standard"
              InputLabelProps={{ sx: { color: '#a8bdce', fontSize: '1.2rem', mb: 1 } }}
              InputProps={{
                disableUnderline: true,
                sx: {
                  color: '#f8fafc',
                  fontSize: '1.2rem',
                  borderBottom: '1px solid rgba(148,163,184,0.65)',
                  background: 'transparent',
                  pt: 1,
                  pb: 0.5,
                  minHeight: 52
                }
              }}
            />

            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              value={form.confirmPassword}
              onChange={(e) => updateField('confirmPassword', e.target.value)}
              variant="standard"
              InputLabelProps={{ sx: { color: '#a8bdce', fontSize: '1.2rem', mb: 1 } }}
              InputProps={{
                disableUnderline: true,
                sx: {
                  color: '#f8fafc',
                  fontSize: '1.2rem',
                  borderBottom: '1px solid rgba(148,163,184,0.65)',
                  background: 'transparent',
                  pt: 1,
                  pb: 0.5,
                  minHeight: 52
                }
              }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 2,
                height: 68,
                background: '#8ae0d6',
                color: '#0b1724',
                borderRadius: 2,
                fontSize: '1.15rem',
                fontWeight: 700,
                boxShadow: 'none',
                '&:hover': { background: '#7dd8cf' }
              }}
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </Stack>
        </Box>

        <Typography variant="body1" align="center" sx={{ mt: 3, color: '#9aa9b8' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#7dd8cf', textDecoration: 'none', fontWeight: 600 }}>
            Login
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
