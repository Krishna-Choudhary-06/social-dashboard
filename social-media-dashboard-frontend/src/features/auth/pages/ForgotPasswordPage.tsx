import { useState } from 'react';
import { Link as RouterLink } from 'react-router';
import { Box, Typography, TextField, Button, Link, Avatar, Alert } from '@mui/material';
import { AutoAwesome } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { tokens } from '@/app/theme';
import { APP_NAME } from '@/constants';

const schema = z.object({ email: z.string().email('Enter a valid email') });
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (_data: FormData) => {
    // await authApi.forgotPassword(data);
    setSent(true);
  };

  return (
    <Box component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <Avatar sx={{ width: 56, height: 56, mb: 2, background: 'linear-gradient(135deg, #8083ff 0%, #c0c1ff 100%)' }}>
          <AutoAwesome sx={{ fontSize: 28 }} />
        </Avatar>
        <Typography variant="h2" fontWeight={700}>{APP_NAME}</Typography>
      </Box>

      <Box sx={{ bgcolor: (t) => t.palette.mode === 'dark' ? tokens.colors.surfaceContainerLow : undefined, border: '1px solid', borderColor: 'divider', borderRadius: 4, p: { xs: 3, sm: 4 } }}>
        <Typography variant="h4" fontWeight={600} sx={{ mb: 0.5 }}>Reset Password</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>We'll send you a link to reset your password</Typography>

        {sent ? (
          <Alert severity="success">Check your email for a reset link.</Alert>
        ) : (
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField fullWidth label="Email" type="email" {...register('email')} error={!!errors.email} helperText={errors.email?.message} sx={{ mb: 3 }} autoFocus />
            <Button type="submit" fullWidth variant="contained" size="large" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </Box>
        )}
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 3 }}>
        <Link component={RouterLink} to="/login" underline="hover" fontWeight={600}>Back to Sign In</Link>
      </Typography>
    </Box>
  );
}
