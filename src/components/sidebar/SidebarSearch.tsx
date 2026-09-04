import React, { useState, useMemo } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Stack,
  Collapse,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { NavLink } from 'react-router-dom';

interface NavigationItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  keywords?: string[];
}

interface SidebarSearchProps {
  navigationItems: NavigationItem[];
  isCollapsed: boolean;
  onItemClick?: () => void;
}

export default function SidebarSearch({
  navigationItems,
  isCollapsed,
  onItemClick,
}: SidebarSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return navigationItems.filter((item) => {
      const matchLabel = item.label.toLowerCase().includes(query);
      const matchKeywords = item.keywords?.some((kw) => kw.toLowerCase().includes(query));
      return matchLabel || matchKeywords;
    });
  }, [searchQuery, navigationItems]);

  const handleItemClick = () => {
    setSearchQuery('');
    setIsOpen(false);
    onItemClick?.();
  };

  if (isCollapsed) {
    return null;
  }

  return (
    <Box sx={{ p: 2, pb: 1 }}>
      <TextField
        fullWidth
        size="small"
        placeholder="Search navigation..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setIsOpen(true);
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: '#7C3AED', fontSize: '1rem' }} />
            </InputAdornment>
          ),
          endAdornment: searchQuery && (
            <InputAdornment position="end">
              <CloseIcon
                onClick={() => {
                  setSearchQuery('');
                  setIsOpen(false);
                }}
                sx={{
                  fontSize: '1rem',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease',
                  '&:hover': {
                    color: '#7C3AED',
                  },
                }}
              />
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            background: '#1B2435',
            border: '1px solid #263244',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: '#7C3AED',
            },
            '&.Mui-focused': {
              borderColor: '#7C3AED',
              boxShadow: '0 0 12px rgba(124, 58, 237, 0.15)',
            },
            '& input::placeholder': {
              color: '#94A3B8',
              opacity: 0.7,
            },
          },
          '& .MuiOutlinedInput-input': {
            fontSize: '0.9rem',
            color: '#F8FAFC',
            py: 1,
          },
        }}
      />

      <Collapse in={isOpen && searchQuery.length > 0}>
        <Box
          sx={{
            mt: 1,
            background: '#1B2435',
            borderRadius: 2,
            border: '1px solid #263244',
            maxHeight: 300,
            overflow: 'auto',
          }}
        >
          {filteredItems.length > 0 ? (
            <List sx={{ p: 0 }}>
              {filteredItems.map((item, index) => (
                <ListItem key={item.to} disablePadding>
                  <ListItemButton
                    component={NavLink}
                    to={item.to}
                    onClick={handleItemClick}
                    sx={{
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: 'rgba(124, 58, 237, 0.1)',
                      },
                      borderBottom:
                        index < filteredItems.length - 1 ? '1px solid #263244' : 'none',
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, color: '#7C3AED' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        variant: 'body2',
                        sx: { fontWeight: 600 },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          ) : (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                No results found
              </Typography>
            </Box>
          )}
        </Box>
      </Collapse>
    </Box>
  );
}
