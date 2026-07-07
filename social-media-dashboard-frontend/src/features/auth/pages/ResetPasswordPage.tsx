import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router';
import { Box, Typography, TextField, Button, Link, Avatar, Alert, InputAdornment, IconButton } from '@mui/material';
import { AutoAwesome, Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { tokens } from '@/app/theme';
import { APP_NAME } from '@/constants';

const schema = z.object({
  password: z.string().min(8, 'Min 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (_data: FormData) => {
    // await authApi.resetPassword({ token: searchParams.get('token'), password: data.password });
    navigate('/login');
  };

  return (
    <Box component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <Avatar sx={{ width: 56, height: 56, mb: 2, background: 'linear-gradient(135deg, #8083ff 0%, #c0c1ff 100%)' }}><AutoAwesome sx={{ fontSize: 28 }} /></Avatar>
        <Typography variant="h2" fontWeight={700}>{APP_NAME}</Typography>
      </Box>

      <Box sx={{ bgcolor: (t) => t.palette.mode === 'dark' ? tokens.colors.surfaceContainerLow : undefined, border: '1px solid', borderColor: 'divider', borderRadius: 4, p: { xs: 3, sm: 4 } }}>
        <Typography variant="h4" fontWeight={600} sx={{ mb: 3 }}>Set New Password</Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField fullWidth label="New Password" type={showPassword ? 'text' : 'password'} {...register('password')} error={!!errors.password} helperText={errors.password?.message} sx={{ mb: 2 }}
            slotProps={{ input: { endAdornment: <InputAdornment position="end"><IconButton size="small" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}</IconButton></InputAdornment> } }}
          />
          <TextField fullWidth label="Confirm Password" type="password" {...register('confirmPassword')} error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} sx={{ mb: 3 }} />
          <Button type="submit" fullWidth variant="contained" size="large" disabled={isSubmitting}>
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </Button>
        </Box>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 3 }}>
        <Link component={RouterLink} to="/login" underline="hover" fontWeight={600}>Back to Sign In</Link>
      </Typography>
    </Box>
  );
}
