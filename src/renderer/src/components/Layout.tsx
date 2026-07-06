import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  BarChart,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  Brightness4,
  Brightness7,
} from '@mui/icons-material';
import { useThemeMode } from '../hooks/useThemeMode';
import logo from '../assets/logo-32x32.svg';

interface LayoutProps {
  children: ReactNode;
}

const NAV_ITEMS = [
  { label: 'Visão Geral', path: '/', icon: <DashboardIcon fontSize="small" /> },
  { label: 'Histórico', path: '/history', icon: <BarChart fontSize="small" /> },
  { label: 'Configurações', path: '/settings', icon: <SettingsIcon fontSize="small" /> },
];

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { mode, toggleMode } = useThemeMode();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  function go(path: string) {
    navigate(path);
    setDrawerOpen(false);
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky" color="default" sx={{ bgcolor: 'background.paper' }}>
        <Toolbar sx={{ gap: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              mr: isMobile ? 'auto' : 4,
            }}
            onClick={() => go('/')}
          >
            <Box
              component="img"
              src={logo}
              alt=""
              width={24}
              height={24}
              sx={{ borderRadius: '3px' }}
            />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Meu Dinheiro
            </Typography>
          </Box>

          {isMobile ? (
            <IconButton onClick={() => setDrawerOpen(true)} aria-label="Abrir menu">
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', gap: 1, flex: 1 }}>
              {NAV_ITEMS.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    onClick={() => go(item.path)}
                    startIcon={item.icon}
                    color={active ? 'primary' : 'inherit'}
                    sx={{
                      fontWeight: active ? 700 : 500,
                      bgcolor: active ? 'action.selected' : 'transparent',
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>
          )}

          <IconButton onClick={toggleMode} aria-label="Alternar tema" color="inherit">
            {mode === 'dark' ? <Brightness7 fontSize="small" /> : <Brightness4 fontSize="small" />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 240 }} role="presentation">
          <List>
            {NAV_ITEMS.map((item) => (
              <ListItemButton
                key={item.path}
                selected={location.pathname === item.path}
                onClick={() => go(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>

      <Container sx={{ mt: 4, mb: 4, flex: 1 }}>{children}</Container>
    </Box>
  );
}
