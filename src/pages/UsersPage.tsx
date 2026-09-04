import React from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Alert,
  AlertTitle,
  Avatar,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import AddIcon from '@mui/icons-material/Add';
import PageHeader from '../components/PageHeader';
import { useTheme } from '../context/ThemeContext';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Analyst' | 'Viewer';
  status: 'active' | 'inactive';
  lastLogin: string;
  joinDate: string;
}

export default function UsersPage() {
  const { colors } = useTheme();

  const users: User[] = [
    {
      id: 'U001',
      name: 'Operations Admin',
      email: 'admin@sentinelcore.local',
      role: 'Admin',
      status: 'active',
      lastLogin: '2026-09-01 09:15',
      joinDate: '2026-01-15',
    },
    {
      id: 'U002',
      name: 'Security Analyst',
      email: 'analyst@sentinelcore.local',
      role: 'Analyst',
      status: 'active',
      lastLogin: '2026-09-01 14:42',
      joinDate: '2026-02-20',
    },
    {
      id: 'U003',
      name: 'Monitoring Viewer',
      email: 'viewer@sentinelcore.local',
      role: 'Viewer',
      status: 'active',
      lastLogin: '2026-08-31 16:30',
      joinDate: '2026-03-10',
    },
    {
      id: 'U004',
      name: 'Incident Response',
      email: 'ir-team@sentinelcore.local',
      role: 'Analyst',
      status: 'inactive',
      lastLogin: '2026-08-25 11:20',
      joinDate: '2026-04-05',
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return '#EF4444';
      case 'Analyst':
        return '#7C3AED';
      case 'Viewer':
        return '#22D3EE';
      default:
        return '#94A3B8';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10B981';
      case 'inactive':
        return '#94A3B8';
      default:
        return '#94A3B8';
    }
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <PageHeader
        title="User Management"
        subtitle="Manage team members and access permissions"
      />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3}>
          {/* Key Metrics */}
          <Grid container spacing={3} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: '#0B1020', borderColor: '#263244', border: '1px solid' }}>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Total Users
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: '#7C3AED' }}
                  >
                    4
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: '#0B1020', borderColor: '#263244', border: '1px solid' }}>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Active Users
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: '#10B981' }}
                  >
                    3
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: '#0B1020', borderColor: '#263244', border: '1px solid' }}>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Admins
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: '#EF4444' }}
                  >
                    1
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: '#0B1020', borderColor: '#263244', border: '1px solid' }}>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Analysts
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: '#7C3AED' }}
                  >
                    2
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Action Bar */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                background: '#7C3AED',
                color: '#F8FAFC',
                fontWeight: 600,
                '&:hover': {
                  background: '#6D28D9',
                },
              }}
            >
              Add User
            </Button>
          </Box>

          {/* Info Alert */}
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            <AlertTitle>User Management</AlertTitle>
            User management will be connected to the authentication service. Control team
            member access, roles, and permissions through this interface.
          </Alert>

          {/* Users Table */}
          <Card sx={{ bgcolor: '#0B1020', borderColor: '#263244', border: '1px solid' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#101827', borderBottom: '1px solid #263244' }}>
                    <TableCell sx={{ color: '#94A3B8', fontWeight: 600 }}>
                      User
                    </TableCell>
                    <TableCell sx={{ color: '#94A3B8', fontWeight: 600 }}>
                      Email
                    </TableCell>
                    <TableCell sx={{ color: '#94A3B8', fontWeight: 600 }}>
                      Role
                    </TableCell>
                    <TableCell sx={{ color: '#94A3B8', fontWeight: 600 }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ color: '#94A3B8', fontWeight: 600 }}>
                      Last Login
                    </TableCell>
                    <TableCell sx={{ color: '#94A3B8', fontWeight: 600 }}>
                      Joined
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow
                      key={user.id}
                      sx={{
                        borderBottom: '1px solid #263244',
                        '&:hover': { bgcolor: 'rgba(124, 58, 237, 0.05)' },
                      }}
                    >
                      <TableCell>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={2}
                          sx={{ color: '#F8FAFC' }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: '#7C3AED',
                              color: '#F8FAFC',
                              width: 36,
                              height: 36,
                              fontSize: '0.875rem',
                              fontWeight: 600,
                            }}
                          >
                            {getInitials(user.name)}
                          </Avatar>
                          <Typography sx={{ fontWeight: 500 }}>
                            {user.name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ color: '#94A3B8' }}>
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.role}
                          size="small"
                          sx={{
                            bgcolor: `${getRoleColor(user.role)}20`,
                            color: getRoleColor(user.role),
                            fontWeight: 600,
                            fontSize: '0.75rem',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            user.status === 'active' ? 'Active' : 'Inactive'
                          }
                          size="small"
                          sx={{
                            bgcolor: `${getStatusColor(user.status)}20`,
                            color: getStatusColor(user.status),
                            fontWeight: 600,
                            fontSize: '0.75rem',
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: '#F8FAFC' }}>
                        {user.lastLogin}
                      </TableCell>
                      <TableCell sx={{ color: '#94A3B8' }}>
                        {user.joinDate}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          {/* Roles Info */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: '#0B1020', borderColor: '#263244', border: '1px solid' }}>
                <CardContent>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: '#EF4444',
                      mb: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: '#EF4444',
                      }}
                    />
                    Admin
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Full access to all systems and configurations. Can manage users and
                    modify settings.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: '#0B1020', borderColor: '#263244', border: '1px solid' }}>
                <CardContent>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: '#7C3AED',
                      mb: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: '#7C3AED',
                      }}
                    />
                    Analyst
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Access to monitoring, alerts, and reports. Can investigate incidents
                    and update ticket statuses.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: '#0B1020', borderColor: '#263244', border: '1px solid' }}>
                <CardContent>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: '#22D3EE',
                      mb: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: '#22D3EE',
                      }}
                    />
                    Viewer
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Read-only access to dashboards and reports. Cannot modify any
                    settings or configurations.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
