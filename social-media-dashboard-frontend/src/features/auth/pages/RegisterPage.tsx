import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router';
import { Box, Typography, TextField, Button, Link, InputAdornment, IconButton, Avatar, Alert } from '@mui/material';
import { Visibility, VisibilityOff, AutoAwesome } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { tokens } from '@/app/theme';
import { APP_NAME } from '@/constants';
import { useRegister } from '../hooks/useAuthHooks';

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const registerMutation = useRegister();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError(null);
      await registerMutation.mutateAsync({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password
      });
    } catch {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <Box component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <Avatar sx={{ width: 56, height: 56, mb: 2, background: 'linear-gradient(135deg, #8083ff 0%, #c0c1ff 100%)' }}>
          <AutoAwesome sx={{ fontSize: 28 }} />
        </Avatar>
        <Typography variant="h2" fontWeight={700} letterSpacing="-0.02em">{APP_NAME}</Typography>
      </Box>

      <Box sx={{ bgcolor: (t) => t.palette.mode === 'dark' ? tokens.colors.surfaceContainerLow : undefined, border: '1px solid', borderColor: 'divider', borderRadius: 4, p: { xs: 3, sm: 4 }, backdropFilter: 'blur(20px)' }}>
        <Typography variant="h4" fontWeight={600} sx={{ mb: 0.5 }}>Create your account</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Start analyzing your social presence</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <TextField fullWidth label="First Name" {...register('firstName')} error={!!errors.firstName} helperText={errors.firstName?.message} sx={{ mb: 2 }} />
            <TextField fullWidth label="Last Name" {...register('lastName')} error={!!errors.lastName} helperText={errors.lastName?.message} sx={{ mb: 2 }} />
          </Box>
          <TextField fullWidth label="Email" type="email" {...register('email')} error={!!errors.email} helperText={errors.email?.message} sx={{ mb: 2 }} />
          <TextField fullWidth label="Password" type={showPassword ? 'text' : 'password'} {...register('password')} error={!!errors.password} helperText={errors.password?.message} sx={{ mb: 2 }}
            slotProps={{ input: { endAdornment: <InputAdornment position="end"><IconButton size="small" onClick={() => setShowPassword(!showPassword)} edge="end">{showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}</IconButton></InputAdornment> } }}
          />
          <TextField fullWidth label="Confirm Password" type="password" {...register('confirmPassword')} error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} sx={{ mb: 3 }} />

          <Button type="submit" fullWidth variant="contained" size="large" disabled={isSubmitting} sx={{ py: 1.25 }}>
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </Button>
        </Box>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 3 }}>
        Already have an account?{' '}
        <Link component={RouterLink} to="/login" underline="hover" fontWeight={600}>Sign in</Link>
      </Typography>
    </Box>
  );
}
