import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Alert, 
  Box, 
  Button, 
  Card, 
  Checkbox, 
  FormControlLabel, 
  IconButton, 
  InputAdornment, 
  Stack, 
  TextField, 
  Typography,
  CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff, Shield } from '@mui/icons-material';
import { authApi } from '../services/api';
import { storage } from '../utils/storage';
import { AuthResponse } from '../types/auth';

const emailOrUsername = (value: string) => value.trim();

// Animated background particles component
const AnimatedBackground = () => {
  return (
    <Box sx={{ position: 'absolute', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Main gradient background */}
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #0B1020 0%, #111827 50%, #0B1020 100%)',
          zIndex: 0
        }}
      />

      {/* Animated gradient glow */}
      <Box
        sx={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 20s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translate(0, 0)' },
            '50%': { transform: 'translate(30px, -30px)' }
          }
        }}
      />

      {/* Secondary glow */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '-30%',
          left: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 25s ease-in-out infinite reverse',
          '@keyframes float': {
            '0%, 100%': { transform: 'translate(0, 0)' },
            '50%': { transform: 'translate(-30px, 30px)' }
          }
        }}
      />

      {/* Animated network nodes */}
      <svg
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: 0.15,
          zIndex: 1
        }}
        viewBox="0 0 500 500"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Animated connecting lines */}
        <defs>
          <style>{`
            @keyframes dash {
              to {
                stroke-dashoffset: 0;
              }
            }
            .network-line {
              stroke: #22D3EE;
              stroke-width: 1;
              stroke-dasharray: 10;
              stroke-dashoffset: 10;
              animation: dash 20s linear infinite;
            }
            @keyframes pulse {
              0%, 100% { r: 3; opacity: 0.6; }
              50% { r: 5; opacity: 1; }
            }
            .network-node {
              fill: #7C3AED;
              animation: pulse 3s ease-in-out infinite;
            }
          `}</style>
        </defs>
        {/* Network nodes */}
        <circle cx="100" cy="100" r="3" className="network-node" />
        <circle cx="400" cy="150" r="3" className="network-node" style={{ animationDelay: '0.5s' }} />
        <circle cx="250" cy="350" r="3" className="network-node" style={{ animationDelay: '1s' }} />
        <circle cx="450" cy="400" r="3" className="network-node" style={{ animationDelay: '1.5s' }} />
        
        {/* Connecting lines */}
        <line x1="100" y1="100" x2="400" y2="150" className="network-line" />
        <line x1="400" y1="150" x2="250" y2="350" className="network-line" style={{ animationDelay: '2s' }} />
        <line x1="250" y1="350" x2="450" y2="400" className="network-line" style={{ animationDelay: '4s' }} />
        <line x1="100" y1="100" x2="250" y2="350" className="network-line" style={{ animationDelay: '3s' }} />
      </svg>
    </Box>
  );
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Redirect already-authenticated users away from the login page
  useEffect(() => {
    if (storage.getToken()) {
      navigate('/dashboard', { replace: true });
      return;
    }

    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, [navigate]);

  const validateForm = (): boolean => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');

    if (!emailOrUsername(email)) {
      setEmailError('Email or username is required');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!validateForm()) {
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

      // Save email if remember me is checked
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      navigate('/dashboard');
    } catch (err: unknown) {
      let message = 'Unable to connect to the authentication service. Please try again.';

      if (err && typeof err === 'object') {
        const axiosError = err as { response?: { data?: { message?: string } }; code?: string; message?: string };

        if (axiosError.response?.data?.message) {
          message = axiosError.response.data.message;
        } else if (axiosError.code === 'ERR_NETWORK' || axiosError.message?.toLowerCase().includes('network')) {
          message = 'Unable to connect to the authentication service. Please try again.';
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
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Left Side - Branding Section */}
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 4,
          position: 'relative',
          zIndex: 2,
          background: 'linear-gradient(135deg, rgba(11, 16, 32, 0.8) 0%, rgba(17, 24, 39, 0.8) 100%)'
        }}
      >
        {/* Shield Icon with animation */}
        <Box
          sx={{
            mb: 4,
            animation: 'float 6s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-20px)' }
            }
          }}
        >
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 40px rgba(124, 58, 237, 0.3)',
              position: 'relative'
            }}
          >
            <Shield sx={{ fontSize: 60, color: '#F8FAFC' }} />
            {/* Pulsing ring */}
            <Box
              sx={{
                position: 'absolute',
                width: 140,
                height: 140,
                borderRadius: '50%',
                border: '2px solid',
                borderColor: '#7C3AED',
                opacity: 0.3,
                animation: 'pulse-ring 2s ease-out infinite',
                '@keyframes pulse-ring': {
                  '0%': { transform: 'scale(1)', opacity: 0.8 },
                  '100%': { transform: 'scale(1.4)', opacity: 0 }
                }
              }}
            />
          </Box>
        </Box>

        {/* Branding Text */}
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            color: '#F8FAFC',
            mb: 1,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #7C3AED 0%, #22D3EE 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          SentinelCore
        </Typography>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: '#A7B0C0',
            mb: 3,
            textAlign: 'center'
          }}
        >
          SecureOps
        </Typography>

        {/* Tagline */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: '#22D3EE',
            mb: 2,
            textAlign: 'center',
            letterSpacing: '2px'
          }}
        >
          Secure. Monitor. Respond.
        </Typography>

        {/* Description */}
        <Typography
          variant="body1"
          sx={{
            color: '#A7B0C0',
            mb: 4,
            textAlign: 'center',
            maxWidth: 350,
            lineHeight: 1.6
          }}
        >
          Enterprise infrastructure security and real-time monitoring.
        </Typography>

        {/* Feature Highlights */}
        <Stack spacing={2} sx={{ width: '100%', maxWidth: 350 }}>
          {[
            'Real-time Infrastructure Monitoring',
            'Intelligent Security Operations',
            'Enterprise Cloud Protection'
          ].map((feature, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                borderRadius: 2,
                background: 'rgba(124, 58, 237, 0.1)',
                border: '1px solid rgba(124, 58, 237, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(124, 58, 237, 0.15)',
                  borderColor: 'rgba(124, 58, 237, 0.4)',
                  transform: 'translateX(8px)'
                }
              }}
            >
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #22C55E 0%, #10B981 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '14px',
                  fontWeight: 700
                }}
              >
                ✓
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: '#F8FAFC',
                  fontWeight: 500
                }}
              >
                {feature}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Right Side - Login Form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: { xs: 2, md: 4 },
          position: 'relative',
          zIndex: 2
        }}
      >
        <Card
          sx={{
            width: '100%',
            maxWidth: 450,
            background: '#172033',
            border: '1px solid #2A3548',
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}
        >
          <Box sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={3}>
              {/* Header */}
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    color: '#F8FAFC',
                    mb: 1
                  }}
                >
                  Welcome Back
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#A7B0C0'
                  }}
                >
                  Sign in to your Security Operations Console
                </Typography>
              </Box>

              {/* Error Alert */}
              {error && (
                <Alert
                  severity="error"
                  sx={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid #EF4444',
                    color: '#FECACA',
                    '& .MuiAlert-icon': {
                      color: '#EF4444'
                    }
                  }}
                >
                  {error}
                </Alert>
              )}

              {/* Login Form */}
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Stack spacing={2.5}>
                  {/* Email/Username Field */}
                  <Box>
                    <TextField
                      fullWidth
                      label="Email or Username"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError('');
                      }}
                      error={!!emailError}
                      helperText={emailError}
                      disabled={loading}
                      autoFocus
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: '#F8FAFC',
                          background: '#0B1020',
                          borderRadius: 1.5,
                          '& fieldset': {
                            borderColor: '#2A3548',
                            transition: 'all 0.3s ease'
                          },
                          '&:hover fieldset': {
                            borderColor: '#3D4A63'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#7C3AED',
                            boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.1)'
                          }
                        },
                        '& .MuiOutlinedInput-input': {
                          '&:-webkit-autofill': {
                            WebkitBoxShadow: '0 0 0 1000px #0B1020 inset'
                          }
                        },
                        '& .MuiInputBase-input::placeholder': {
                          color: '#6B7280',
                          opacity: 1
                        }
                      }}
                    />
                  </Box>

                  {/* Password Field */}
                  <Box>
                    <TextField
                      fullWidth
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError('');
                      }}
                      error={!!passwordError}
                      helperText={passwordError}
                      disabled={loading}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword((prev) => !prev)}
                              edge="end"
                              aria-label="toggle password visibility"
                              disabled={loading}
                              sx={{
                                color: '#A7B0C0',
                                '&:hover': {
                                  color: '#7C3AED'
                                },
                                transition: 'color 0.2s ease'
                              }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: '#F8FAFC',
                          background: '#0B1020',
                          borderRadius: 1.5,
                          '& fieldset': {
                            borderColor: '#2A3548',
                            transition: 'all 0.3s ease'
                          },
                          '&:hover fieldset': {
                            borderColor: '#3D4A63'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#7C3AED',
                            boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.1)'
                          }
                        }
                      }}
                    />
                  </Box>

                  {/* Remember Me Checkbox */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          disabled={loading}
                          sx={{
                            color: '#2A3548',
                            '&.Mui-checked': {
                              color: '#7C3AED'
                            },
                            transition: 'color 0.2s ease'
                          }}
                        />
                      }
                      label={
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#A7B0C0',
                            fontWeight: 500
                          }}
                        >
                          Remember me
                        </Typography>
                      }
                    />
                    <Link
                      to="/forgot-password"
                      style={{
                        textDecoration: 'none',
                        color: '#7C3AED',
                        fontSize: '14px',
                        fontWeight: 500,
                        transition: 'color 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.color = '#22D3EE';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.color = '#7C3AED';
                      }}
                    >
                      Forgot?
                    </Link>
                  </Box>

                  {/* Login Button */}
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{
                      background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
                      color: '#F8FAFC',
                      fontWeight: 600,
                      fontSize: '16px',
                      py: 1.5,
                      borderRadius: 1.5,
                      textTransform: 'none',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      '&:hover:not(:disabled)': {
                        background: 'linear-gradient(135deg, #6D28D9 0%, #4338CA 100%)',
                        boxShadow: '0 8px 24px rgba(124, 58, 237, 0.4)',
                        transform: 'translateY(-2px)'
                      },
                      '&:active:not(:disabled)': {
                        transform: 'translateY(0)'
                      },
                      '&:disabled': {
                        background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
                        opacity: 0.7,
                        cursor: 'not-allowed'
                      }
                    }}
                  >
                    {loading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={20} sx={{ color: '#F8FAFC' }} />
                        <span>Signing in...</span>
                      </Box>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </Stack>
              </Box>

              {/* Divider */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  my: 1
                }}
              >
                <Box sx={{ flex: 1, height: '1px', background: '#2A3548' }} />
                <Typography variant="caption" sx={{ color: '#6B7280' }}>
                  OR
                </Typography>
                <Box sx={{ flex: 1, height: '1px', background: '#2A3548' }} />
              </Box>

              {/* Register Link */}
              <Typography
                variant="body2"
                align="center"
                sx={{
                  color: '#A7B0C0'
                }}
              >
                Don't have an account?{' '}
                <Link
                  to="/register"
                  style={{
                    color: '#7C3AED',
                    textDecoration: 'none',
                    fontWeight: 600,
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = '#22D3EE';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = '#7C3AED';
                  }}
                >
                  Create Account
                </Link>
              </Typography>
            </Stack>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
