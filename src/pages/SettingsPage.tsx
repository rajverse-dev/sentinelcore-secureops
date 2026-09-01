import { Card, CardContent, Grid, Stack, Typography, ToggleButton, ToggleButtonGroup, FormControlLabel, Switch, Button, Divider } from '@mui/material';
import { useTheme } from '../context/ThemeContext';
import PageHeader from '../components/PageHeader';

type ThemeName = 'sentinel' | 'midnight' | 'emerald' | 'crimson' | 'ocean';

const themePresets: Record<ThemeName, { label: string; preview: string }> = {
  sentinel: { label: 'Sentinel (Teal)', preview: '#5EEAD4' },
  midnight: { label: 'Midnight (Purple)', preview: '#8B5CF6' },
  emerald: { label: 'Emerald (Green)', preview: '#10B981' },
  crimson: { label: 'Crimson (Red)', preview: '#EF4444' },
  ocean: { label: 'Ocean (Cyan)', preview: '#0EA5E9' }
};

export default function SettingsPage() {
  const { themeName, themeMode, setThemeName, setThemeMode } = useTheme();

  return (
    <>
      <PageHeader title="Settings & Customization" subtitle="Personalize your dashboard experience" />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Display Mode</Typography>
              <Stack spacing={2}>
                <ToggleButtonGroup 
                  value={themeMode} 
                  exclusive 
                  onChange={(_, value) => value && setThemeMode(value as 'light' | 'dark')}
                  fullWidth
                >
                  <ToggleButton value="light">☀️ Light</ToggleButton>
                  <ToggleButton value="dark">🌙 Dark</ToggleButton>
                </ToggleButtonGroup>
                <Typography variant="body2" color="text.secondary">Choose between light and dark theme for comfortable viewing in any environment.</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Dashboard Preferences</Typography>
              <Stack spacing={1.5}>
                <FormControlLabel control={<Switch defaultChecked />} label="Auto-refresh metrics every 30s" />
                <FormControlLabel control={<Switch defaultChecked />} label="Show notifications in real-time" />
                <FormControlLabel control={<Switch />} label="Compact view mode" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>Color Themes</Typography>
          <Grid container spacing={2}>
            {Object.entries(themePresets).map(([key, preset]) => (
              <Grid item xs={12} sm={6} md={4} key={key}>
                <Card 
                  onClick={() => setThemeName(key as ThemeName)}
                  sx={{
                    cursor: 'pointer',
                    border: themeName === key ? '2px solid' : '2px solid transparent',
                    borderColor: themeName === key ? preset.preview : 'transparent',
                    transition: 'all 0.3s ease',
                    '&:hover': { transform: 'translateY(-4px)' }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Stack alignItems="center" spacing={1}>
                      <Stack direction="row" spacing={1}>
                        {[...Array(3)].map((_, i) => (
                          <div 
                            key={i} 
                            style={{
                              width: 24,
                              height: 24,
                              backgroundColor: preset.preview,
                              borderRadius: 4,
                              opacity: 1 - i * 0.2
                            }}
                          />
                        ))}
                      </Stack>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{preset.label}</Typography>
                      {themeName === key && <Typography variant="caption" color="primary">✓ Active</Typography>}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Notification Settings</Typography>
          <Stack spacing={1.5}>
            <FormControlLabel control={<Switch defaultChecked />} label="Critical Alerts - Desktop notification" />
            <FormControlLabel control={<Switch defaultChecked />} label="High Priority Alerts - Sound alert" />
            <FormControlLabel control={<Switch defaultChecked />} label="Incident Updates - Email notification" />
            <FormControlLabel control={<Switch />} label="Daily Security Digest" />
          </Stack>
        </CardContent>
      </Card>

      <Divider sx={{ my: 4 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>About SentinelCore</Typography>
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">Version</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>1.0.0</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">Last Updated</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>2026-09-01</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">Environment</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Production</Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Quick Actions</Typography>
              <Stack spacing={1.5}>
                <Button variant="contained">Export Dashboard Config</Button>
                <Button variant="outlined">Reset to Defaults</Button>
                <Button variant="outlined" color="error">Clear All Cache</Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
