import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Stack,
  TextField,
  InputAdornment,
  Box,
  Typography,
  Chip,
  Paper,
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { assetData } from '../data/mockData';

interface SearchResult {
  id: string;
  name: string;
  type: string;
  ip: string;
  status: string;
}

interface AssetSearchBarProps {
  onAssetSelect?: (asset: SearchResult) => void;
}

export default function AssetSearchBar({ onAssetSelect }: AssetSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const open = Boolean(anchorEl && searchQuery.length > 0);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const filterAssets = (): SearchResult[] => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return assetData
      .filter(
        (asset) =>
          asset.id.toLowerCase().includes(query) ||
          asset.name.toLowerCase().includes(query) ||
          asset.ip.toLowerCase().includes(query) ||
          asset.type.toLowerCase().includes(query)
      )
      .slice(0, 8)
      .map((asset) => ({
        id: asset.id,
        name: asset.name,
        type: asset.type,
        ip: asset.ip,
        status: asset.status,
      }));
  };

  const results = filterAssets();

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Critical':
        return '#EF4444';
      case 'Warning':
        return '#F59E0B';
      case 'Healthy':
        return '#22C55E';
      default:
        return '#7C3AED';
    }
  };

  return (
    <>
      <Card sx={{ background: '#151C2C', border: '1px solid #334155', borderRadius: 2 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search assets by ID, name, IP, or type..."
            value={searchQuery}
            onChange={handleSearchChange}
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#7C3AED' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#F8FAFC',
                background: '#0B1020',
                border: '1px solid #334155',
                '& fieldset': {
                  borderColor: '#334155',
                },
                '&:hover fieldset': {
                  borderColor: '#7C3AED',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#7C3AED',
                  boxShadow: '0 0 12px rgba(124, 58, 237, 0.2)',
                },
              },
              '& .MuiOutlinedInput-input::placeholder': {
                color: '#A7B0C0',
                opacity: 0.7,
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Search Results Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            background: '#151C2C',
            border: '1px solid #334155',
            borderRadius: 2,
            boxShadow: '0px 20px 60px rgba(0, 0, 0, 0.5)',
            minWidth: 300,
            maxWidth: 500,
          },
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {results.length > 0 ? (
            <List sx={{ p: 0 }}>
              {results.map((result, index) => (
                <ListItem
                  disablePadding
                  key={result.id}
                  sx={{
                    borderBottom: index < results.length - 1 ? '1px solid #334155' : 'none',
                  }}
                >
                  <ListItemButton
                    onClick={() => {
                      onAssetSelect?.(result);
                      setSearchQuery('');
                      handleClose();
                    }}
                    sx={{
                      py: 1.5,
                      px: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(124, 58, 237, 0.1)',
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Stack spacing={0.5}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                              {result.name}
                            </Typography>
                            <Chip
                              label={result.type}
                              size="small"
                              variant="outlined"
                              sx={{
                                height: 18,
                                fontSize: '0.65rem',
                                borderColor: '#334155',
                                color: '#A7B0C0',
                              }}
                            />
                          </Stack>
                        </Stack>
                      }
                      secondary={
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            {result.id}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#7C3AED' }}>
                            {result.ip}
                          </Typography>
                          <Chip
                            label={result.status}
                            size="small"
                            sx={{
                              background: getStatusColor(result.status),
                              color: '#FFFFFF',
                              fontWeight: 600,
                              fontSize: '0.65rem',
                              height: 18,
                              ml: 'auto',
                            }}
                          />
                        </Stack>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          ) : (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography color="text.secondary" variant="caption">
                No assets found matching "{searchQuery}"
              </Typography>
            </Box>
          )}
        </CardContent>
      </Popover>
    </>
  );
}
