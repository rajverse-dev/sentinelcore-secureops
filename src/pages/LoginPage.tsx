import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Card, CardContent, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { authApi } from '../services/api';
import { storage } from '../utils/storage';
import { AuthResponse } from '../types/auth';

const emailOrUsername = (value: string) => value.trim();

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!emailOrUsername(email)) {
      setError('Email or username is required.');
      return;
    }

    if (!password) {
      setError('Password is required.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        email: email.includes('@') ? email : '',
        username: email.includes('@') ? '' : email,
        password
      };

      const response = await authApi.login(payload);
      const authData = response.data as AuthResponse;
      const token = authData.token ?? authData.accessToken ?? authData.jwt ?? authData.data?.token ?? authData.data?.accessToken ?? authData.data?.jwt;

      if (!token) {
        throw new Error('Authentication token missing from server response.');
      }

      storage.setToken(token);
      const user = authData.user ?? authData.data?.user ?? null;
      if (user) storage.setUser(user);
      navigate('/dashboard');
    } catch (err: unknown) {
      let message = 'Login failed. Please try again.';

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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at top, rgba(94,234,212,0.20), transparent 35%), #07141F',
        px: 2
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 440, borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>SentinelCore</Typography>
              <Typography variant="h6" color="text.secondary">SecureOps</Typography>
            </Box>

            <Typography variant="body2" color="text.secondary">Sign in to continue to your security operations console.</Typography>

            {error && <Alert severity="error">{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={2}>
                <TextField
                  label="Email or Username"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={Boolean(error && !emailOrUsername(email))}
                />
                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={Boolean(error && !password)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end" aria-label="toggle password visibility">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <Button type="submit" variant="contained" size="large" disabled={loading}>
                  {loading ? 'Signing in...' : 'Login'}
                </Button>
              </Stack>
            </Box>

            <Typography variant="body2" align="center" color="text.secondary">
              Don’t have an account?{' '}
              <Link to="/register" style={{ color: '#5EEAD4', textDecoration: 'none' }}>Register</Link>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
