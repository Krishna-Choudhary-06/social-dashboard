import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router';
import {
  Box, Typography, TextField, Button, Link, InputAdornment, IconButton,
  Avatar, Divider, Alert,
} from '@mui/material';
import { Visibility, VisibilityOff, AutoAwesome, Google, GitHub } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { tokens } from '@/app/theme';
import { APP_NAME, APP_TAGLINE } from '@/constants';
import { useLogin } from '../hooks/useAuthHooks';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loginMutation = useLogin();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      await loginMutation.mutateAsync(data);
    } catch {
      setError('Invalid email or password');
    }
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Logo */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <Avatar
          sx={{
            width: 56, height: 56, mb: 2,
            background: 'linear-gradient(135deg, #8083ff 0%, #c0c1ff 100%)',
          }}
        >
          <AutoAwesome sx={{ fontSize: 28 }} />
        </Avatar>
        <Typography variant="h2" fontWeight={700} letterSpacing="-0.02em">
          {APP_NAME}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {APP_TAGLINE}
        </Typography>
      </Box>

      {/* Card */}
      <Box
        sx={{
          bgcolor: (t) => t.palette.mode === 'dark' ? tokens.colors.surfaceContainerLow : undefined,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 4,
          p: { xs: 3, sm: 4 },
          backdropFilter: 'blur(20px)',
        }}
      >
        <Typography variant="h4" fontWeight={600} sx={{ mb: 0.5 }}>
          Welcome back
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Sign in to your account to continue
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            fullWidth
            label="Email"
            type="email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={{ mb: 2 }}
            autoFocus
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            sx={{ mb: 1 }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2.5 }}>
            <Link component={RouterLink} to="/forgot-password" variant="body2" underline="hover">
              Forgot?
            </Link>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isSubmitting}
            sx={{ py: 1.25, fontSize: '0.9375rem' }}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </Box>

        <Divider sx={{ my: 3 }}>
          <Typography variant="caption" color="text.secondary">OR</Typography>
        </Divider>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button fullWidth variant="outlined" startIcon={<Google />} sx={{ py: 1 }}>
            Google
          </Button>
          <Button fullWidth variant="outlined" startIcon={<GitHub />} sx={{ py: 1 }}>
            GitHub
          </Button>
        </Box>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 3 }}>
        New to {APP_NAME}?{' '}
        <Link component={RouterLink} to="/register" underline="hover" fontWeight={600}>
          Create account
        </Link>
      </Typography>
    </Box>
  );
}
