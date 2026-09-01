import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  InputAdornment,
  LinearProgress,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { Visibility, VisibilityOff, Shield, CheckCircle, Info } from '@mui/icons-material';
import { authApi } from '../services/api';
import { RegisterRequest } from '../types/auth';

// Validation utilities
const validators = {
  fullName: (name: string): string | null => {
    if (!name.trim()) return 'Full name is required';
    if (name.trim().length < 2) return 'Full name must be at least 2 characters';
    if (!/^[a-zA-Z\s'-]+$/.test(name)) return 'Full name can only contain letters, spaces, hyphens, and apostrophes';
    return null;
  },

  email: (email: string): string | null => {
    if (!email.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return null;
  },

  username: (username: string): string | null => {
    if (!username.trim()) return 'Username is required';
    if (username.length < 4) return 'Username must be at least 4 characters';
    if (username.length > 20) return 'Username must not exceed 20 characters';
    if (/\s/.test(username)) return 'Username cannot contain spaces';
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) return 'Username can only contain letters, numbers, underscores, and hyphens';
    return null;
  },

  password: (password: string) => {
    return {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };
  },

  confirmPassword: (password: string, confirmPassword: string): string | null => {
    if (!confirmPassword) return 'Please confirm your password';
    if (password !== confirmPassword) return 'Passwords do not match';
    return null;
  }
};

// Calculate password strength
const calculatePasswordStrength = (requirements: ReturnType<typeof validators.password>) => {
  const checks = Object.values(requirements).filter(v => v).length;
  if (checks < 2) return { level: 'weak', percentage: 20, color: '#EF4444' };
  if (checks < 4) return { level: 'medium', percentage: 60, color: '#F59E0B' };
  if (checks < 5) return { level: 'strong', percentage: 80, color: '#3B82F6' };
  return { level: 'very strong', percentage: 100, color: '#22C55E' };
};

// Animated background component
const AnimatedBackground = () => {
  return (
    <Box sx={{ position: 'absolute', width: '100%', height: '100%', overflow: 'hidden' }}>
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #0B1020 0%, #111827 50%, #0B1020 100%)',
          zIndex: 0
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.12) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 20s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translate(0, 0)' },
            '50%': { transform: 'translate(30px, -30px)' }
          }
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-30%',
          left: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 25s ease-in-out infinite reverse',
          '@keyframes float': {
            '0%, 100%': { transform: 'translate(0, 0)' },
            '50%': { transform: 'translate(-30px, 30px)' }
          }
        }}
      />
    </Box>
  );
};

// Password requirements checklist component
const PasswordRequirements = ({ requirements }: { requirements: ReturnType<typeof validators.password> }) => {
  const items = [
    { label: 'At least 8 characters', met: requirements.minLength },
    { label: 'One uppercase letter (A-Z)', met: requirements.hasUppercase },
    { label: 'One lowercase letter (a-z)', met: requirements.hasLowercase },
    { label: 'One number (0-9)', met: requirements.hasNumber },
    { label: 'One special character (!@#$%^&*...)', met: requirements.hasSpecial }
  ];

  return (
    <Box sx={{ mt: 1.5, p: 2, background: '#0B1020', borderRadius: 1.5, border: '1px solid #2A3548' }}>
      <Typography variant="caption" sx={{ color: '#A7B0C0', display: 'block', mb: 1, fontWeight: 600 }}>
        Password requirements:
      </Typography>
      <Stack spacing={0.75}>
        {items.map((item, idx) => (
          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: '3px',
                background: item.met ? '#22C55E' : '#2A3548',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                color: item.met ? '#F8FAFC' : '#6B7280',
                fontSize: '10px',
                fontWeight: 'bold'
              }}
            >
              {item.met ? '✓' : '○'}
            </Box>
            <Typography
              variant="caption"
              sx={{
                color: item.met ? '#22C55E' : '#A7B0C0',
                transition: 'color 0.3s ease',
                fontWeight: 500
              }}
            >
              {item.label}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [fieldErrors, setFieldErrors] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    terms: ''
  });

  const [fieldTouched, setFieldTouched] = useState({
    fullName: false,
    email: false,
    username: false,
    password: false,
    confirmPassword: false
  });

  const passwordRequirements = validators.password(form.password);
  const passwordStrength = calculatePasswordStrength(passwordRequirements);
  const allRequirementsMet = Object.values(passwordRequirements).every(v => v);

  // Real-time validation
  const validateField = (field: keyof typeof form) => {
    let error = '';

    if (field === 'fullName') {
      error = validators.fullName(form.fullName) || '';
    } else if (field === 'email') {
      error = validators.email(form.email) || '';
    } else if (field === 'username') {
      error = validators.username(form.username) || '';
    } else if (field === 'password') {
      // Only show error if password has content
      if (form.password && !allRequirementsMet) {
        error = 'Password does not meet all requirements';
      }
    } else if (field === 'confirmPassword') {
      error = validators.confirmPassword(form.password, form.confirmPassword) || '';
    }

    setFieldErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  };

  const handleFieldChange = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (fieldTouched[field]) {
      validateField(field);
    }
  };

  const handleFieldBlur = (field: keyof typeof form) => {
    setFieldTouched(prev => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = { ...fieldErrors, terms: '' };

    // Validate all fields
    const fullNameError = validators.fullName(form.fullName);
    if (fullNameError) {
      newErrors.fullName = fullNameError;
      isValid = false;
    }

    const emailError = validators.email(form.email);
    if (emailError) {
      newErrors.email = emailError;
      isValid = false;
    }

    const usernameError = validators.username(form.username);
    if (usernameError) {
      newErrors.username = usernameError;
      isValid = false;
    }

    if (!allRequirementsMet) {
      newErrors.password = 'Password does not meet all requirements';
      isValid = false;
    }

    const confirmError = validators.confirmPassword(form.password, form.confirmPassword);
    if (confirmError) {
      newErrors.confirmPassword = confirmError;
      isValid = false;
    }

    if (!acceptTerms) {
      newErrors.terms = 'Please accept the Terms of Service and Privacy Policy';
      isValid = false;
    }

    setFieldErrors(newErrors);
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
      const payload: RegisterRequest = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        username: form.username.trim() || form.email.split('@')[0],
        password: form.password
      };

      await authApi.register(payload);
      setSuccess('Account created successfully!');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: unknown) {
      let message = 'Registration service is currently unavailable. Please try again later.';

      if (err && typeof err === 'object') {
        const axiosError = err as {
          response?: { data?: { message?: string } };
          code?: string;
          message?: string;
        };

        if (axiosError.response?.data?.message) {
          message = axiosError.response.data.message;
        } else if (
          axiosError.code === 'ERR_NETWORK' ||
          axiosError.message?.toLowerCase().includes('network')
        ) {
          message = 'Registration service is currently unavailable. Please try again later.';
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

      {/* Left Side - Branding Section (Desktop Only) */}
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
        {/* Shield Icon */}
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
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 40px rgba(79, 70, 229, 0.3)',
              position: 'relative'
            }}
          >
            <Shield sx={{ fontSize: 50, color: '#F8FAFC' }} />
          </Box>
        </Box>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: '#F8FAFC',
            mb: 1,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #4F46E5 0%, #22D3EE 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Join SentinelCore
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: '#A7B0C0',
            mb: 3,
            textAlign: 'center',
            maxWidth: 320,
            lineHeight: 1.6
          }}
        >
          Create your enterprise security operations account today.
        </Typography>

        {/* Security Message */}
        <Box
          sx={{
            p: 2.5,
            borderRadius: 2,
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            display: 'flex',
            gap: 2,
            alignItems: 'flex-start'
          }}
        >
          <CheckCircle sx={{ color: '#22C55E', flexShrink: 0 }} />
          <Typography variant="body2" sx={{ color: '#A7B0C0' }}>
            Your account will be protected with enterprise-grade security.
          </Typography>
        </Box>
      </Box>

      {/* Right Side - Registration Form */}
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
            maxWidth: 480,
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
                  Create Account
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#A7B0C0'
                  }}
                >
                  Register for SentinelCore SecureOps
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

              {/* Success Alert */}
              {success && (
                <Alert
                  severity="success"
                  sx={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid #22C55E',
                    color: '#BFEF45',
                    '& .MuiAlert-icon': {
                      color: '#22C55E'
                    }
                  }}
                >
                  {success}
                </Alert>
              )}

              {/* Registration Form */}
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Stack spacing={2.5}>
                  {/* Full Name Field */}
                  <Box>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={form.fullName}
                      onChange={(e) => handleFieldChange('fullName', e.target.value)}
                      onBlur={() => handleFieldBlur('fullName')}
                      error={fieldTouched.fullName && !!fieldErrors.fullName}
                      helperText={fieldTouched.fullName ? fieldErrors.fullName : ''}
                      disabled={loading}
                      placeholder="John Doe"
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

                  {/* Email Field */}
                  <Box>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={form.email}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      onBlur={() => handleFieldBlur('email')}
                      error={fieldTouched.email && !!fieldErrors.email}
                      helperText={fieldTouched.email ? fieldErrors.email : ''}
                      disabled={loading}
                      placeholder="you@example.com"
                      InputProps={{
                        endAdornment: fieldTouched.email && !fieldErrors.email && form.email ? (
                          <InputAdornment position="end">
                            <CheckCircle sx={{ color: '#22C55E', fontSize: 20 }} />
                          </InputAdornment>
                        ) : null
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

                  {/* Username Field */}
                  <Box>
                    <TextField
                      fullWidth
                      label="Username"
                      value={form.username}
                      onChange={(e) => handleFieldChange('username', e.target.value)}
                      onBlur={() => handleFieldBlur('username')}
                      error={fieldTouched.username && !!fieldErrors.username}
                      helperText={fieldTouched.username ? fieldErrors.username : ''}
                      disabled={loading}
                      placeholder="johndoe_2024"
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

                  {/* Password Field */}
                  <Box>
                    <TextField
                      fullWidth
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) => handleFieldChange('password', e.target.value)}
                      onBlur={() => handleFieldBlur('password')}
                      error={fieldTouched.password && !!fieldErrors.password}
                      helperText={fieldTouched.password ? fieldErrors.password : ''}
                      disabled={loading}
                      placeholder="••••••••"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
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

                    {/* Password Strength Meter */}
                    {form.password && (
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="caption" sx={{ color: '#A7B0C0', fontWeight: 600 }}>
                            Password Strength
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: passwordStrength.color,
                              fontWeight: 600,
                              textTransform: 'capitalize'
                            }}
                          >
                            {passwordStrength.level}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={passwordStrength.percentage}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            background: '#1B2435',
                            '& .MuiLinearProgress-bar': {
                              background: passwordStrength.color,
                              transition: 'all 0.3s ease',
                              borderRadius: 3
                            }
                          }}
                        />
                      </Box>
                    )}

                    {/* Password Requirements */}
                    {form.password && (
                      <PasswordRequirements requirements={passwordRequirements} />
                    )}
                  </Box>

                  {/* Confirm Password Field */}
                  <Box>
                    <TextField
                      fullWidth
                      label="Confirm Password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={form.confirmPassword}
                      onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                      onBlur={() => handleFieldBlur('confirmPassword')}
                      error={fieldTouched.confirmPassword && !!fieldErrors.confirmPassword}
                      helperText={fieldTouched.confirmPassword ? fieldErrors.confirmPassword : ''}
                      disabled={loading}
                      placeholder="••••••••"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {fieldTouched.confirmPassword && form.confirmPassword && !fieldErrors.confirmPassword ? (
                              <CheckCircle sx={{ color: '#22C55E', fontSize: 20 }} />
                            ) : (
                              <IconButton
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                edge="end"
                                aria-label="toggle confirm password visibility"
                                disabled={loading}
                                sx={{
                                  color: '#A7B0C0',
                                  '&:hover': {
                                    color: '#7C3AED'
                                  },
                                  transition: 'color 0.2s ease'
                                }}
                              >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            )}
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

                  {/* Terms Checkbox */}
                  <Box>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={acceptTerms}
                          onChange={(e) => {
                            setAcceptTerms(e.target.checked);
                            if (e.target.checked) {
                              setFieldErrors(prev => ({ ...prev, terms: '' }));
                            }
                          }}
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
                        <Typography variant="body2" sx={{ color: '#A7B0C0' }}>
                          I agree to the{' '}
                          <Box
                            component="span"
                            sx={{
                              color: '#7C3AED',
                              cursor: 'pointer',
                              fontWeight: 600,
                              '&:hover': { color: '#22D3EE' }
                            }}
                          >
                            Terms of Service
                          </Box>
                          {' '}and{' '}
                          <Box
                            component="span"
                            sx={{
                              color: '#7C3AED',
                              cursor: 'pointer',
                              fontWeight: 600,
                              '&:hover': { color: '#22D3EE' }
                            }}
                          >
                            Privacy Policy
                          </Box>
                        </Typography>
                      }
                    />
                    {fieldErrors.terms && (
                      <Typography variant="caption" sx={{ color: '#EF4444', display: 'block', mt: 0.5 }}>
                        {fieldErrors.terms}
                      </Typography>
                    )}
                  </Box>

                  {/* Register Button */}
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
                        <span>Creating Account...</span>
                      </Box>
                    ) : (
                      'Register'
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

              {/* Login Link */}
              <Typography
                variant="body2"
                align="center"
                sx={{
                  color: '#A7B0C0'
                }}
              >
                Already have an account?{' '}
                <Link
                  to="/login"
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
                  Login
                </Link>
              </Typography>
            </Stack>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
