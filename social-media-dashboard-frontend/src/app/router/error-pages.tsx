import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router';
import { Block, SearchOff, ReportProblem, WifiOff, Construction } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface ErrorPageProps {
  code: number | string;
  title: string;
  description: string;
  icon: React.ReactNode;
  showHomeButton?: boolean;
}

function ErrorPage({ code, title, description, icon, showHomeButton = true }: ErrorPageProps) {
  const navigate = useNavigate();

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 3,
        p: 4,
        textAlign: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Box sx={{ opacity: 0.3, mb: -1 }}>{icon}</Box>
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: '4rem', md: '6rem' },
          fontWeight: 800,
          background: 'linear-gradient(135deg, #8083ff 0%, #c0c1ff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1,
        }}
      >
        {code}
      </Typography>
      <Typography variant="h3">{title}</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 480 }}>
        {description}
      </Typography>
      {showHomeButton && (
        <Button variant="contained" size="large" onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </Button>
      )}
    </Box>
  );
}

export function NotFoundPage() {
  return (
    <ErrorPage
      code={404}
      title="Page Not Found"
      description="The page you're looking for doesn't exist or has been moved."
      icon={<SearchOff sx={{ fontSize: 80 }} />}
    />
  );
}

export function ForbiddenPage() {
  return (
    <ErrorPage
      code={403}
      title="Access Denied"
      description="You don't have permission to access this resource. Contact your workspace admin."
      icon={<Block sx={{ fontSize: 80 }} />}
    />
  );
}

export function ServerErrorPage() {
  return (
    <ErrorPage
      code={500}
      title="Server Error"
      description="Something went wrong on our end. Please try again later."
      icon={<ReportProblem sx={{ fontSize: 80 }} />}
    />
  );
}

export function OfflinePage() {
  return (
    <ErrorPage
      code="Offline"
      title="No Connection"
      description="You appear to be offline. Check your internet connection and try again."
      icon={<WifiOff sx={{ fontSize: 80 }} />}
      showHomeButton={false}
    />
  );
}

export function MaintenancePage() {
  return (
    <ErrorPage
      code="503"
      title="Under Maintenance"
      description="We're performing scheduled maintenance. We'll be back shortly."
      icon={<Construction sx={{ fontSize: 80 }} />}
      showHomeButton={false}
    />
  );
}
