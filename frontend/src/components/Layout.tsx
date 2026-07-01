import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Button, Box } from '@mui/material';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ cursor: 'pointer', mr: 4 }} onClick={() => navigate('/')}>
            Money Manager
          </Typography>
          <Button
            color="inherit"
            onClick={() => navigate('/')}
            sx={{ fontWeight: location.pathname === '/' ? 'bold' : 'normal' }}
          >
            Contas
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/history')}
            sx={{ fontWeight: location.pathname === '/history' ? 'bold' : 'normal' }}
          >
            Histórico de Contas
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/settings')}
            sx={{ fontWeight: location.pathname === '/settings' ? 'bold' : 'normal' }}
          >
            Configurações
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4, mb: 4, flex: 1 }}>{children}</Container>
    </Box>
  );
}
