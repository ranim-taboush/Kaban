import React from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import Link from 'next/link';
import { Dashboard, List } from '@mui/icons-material';

export default function HomePage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 8 }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Kanban Todo App
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Choose your experience
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap'}}>
          <Paper elevation={2}
            sx={{ p: 4, textAlign: 'center', borderRadius: 3, minWidth: 280, width: { xs: '100%',  sm: 300,  }, flexShrink: 0,
              '&:hover': { elevation: 4, transform: 'translateY(-4px)', transition: 'all 0.3s ease'}
            }}>
            <Dashboard sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Kanban Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Full-featured task management with drag & drop, pagination, and React Query
            </Typography>
            <Button component={Link}
              href="/kanban" variant="contained" size="large" fullWidth>
              Open Kanban
            </Button>
          </Paper>

          <Paper elevation={2}
            sx={{ p: 4, textAlign: 'center', borderRadius: 3, width: { xs: '100%',  sm: 300,  }, flexShrink: 0, minWidth: 280,
              '&:hover': { elevation: 4, transform: 'translateY(-4px)', transition: 'all 0.3s ease' }
            }}>
            <List sx={{ fontSize: 64, color: 'secondary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              jQuery Dynamic List
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Simple dynamic list with jQuery animations and error handling
            </Typography>
            <Button component={Link}
              href="/jquery" variant="contained" size="large" fullWidth color="secondary">
              Open jQuery Demo
            </Button>
          </Paper>
        </Box>

        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Built with Next.js, Material UI, React Query, Zustand, and react-beautiful-dnd
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}