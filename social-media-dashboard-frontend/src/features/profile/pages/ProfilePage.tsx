import { Grid, Box, TextField, Button, Avatar, Typography, Divider } from '@mui/material';
import { CameraAlt, Save } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '@/components/layout/PageHeader';
import { GlassCard } from '@/components/cards/GlassCard';
import { useProfile } from '../hooks/useProfile';
import { useAuthStore } from '@/store/auth.store';

const profileSchema = z.object({ firstName: z.string().min(1), lastName: z.string().min(1), email: z.string().email(), bio: z.string().optional() });
const passwordSchema = z.object({ currentPassword: z.string().min(6), newPassword: z.string().min(8), confirmPassword: z.string() }).refine((d) => d.newPassword === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

export default function ProfilePage() {
  const { updateProfile, updatePassword } = useProfile();
  const user = useAuthStore((state) => state.user);

  const profileForm = useForm({ 
    resolver: zodResolver(profileSchema), 
    defaultValues: { 
      firstName: user?.firstName || 'Alex', 
      lastName: user?.lastName || 'Rivera', 
      email: user?.email || 'alex@insightai.com', 
      bio: '' 
    } 
  });
  const passwordForm = useForm({ resolver: zodResolver(passwordSchema) });

  return (
    <Box>
      <PageHeader title="Profile" subtitle="Manage your personal profile and account settings." />
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={4}>
          <GlassCard>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 2 }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar sx={{ width: 96, height: 96, fontSize: '2rem', bgcolor: 'primary.dark' }}>
                  {user ? `${user.firstName[0]}${user.lastName[0]}` : 'AR'}
                </Avatar>
                <Box sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: 'primary.main', borderRadius: '50%', p: 0.5, cursor: 'pointer' }}><CameraAlt sx={{ fontSize: 16, color: 'primary.contrastText' }} /></Box>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={600}>{user ? `${user.firstName} ${user.lastName}` : 'Alex Rivera'}</Typography>
                <Typography variant="body2" color="text.secondary">{user?.email || 'alex@insightai.com'}</Typography>
                <Typography variant="caption" color="primary.main" sx={{ mt: 0.5, display: 'block' }}>Pro Plan</Typography>
              </Box>
            </Box>
          </GlassCard>
        </Grid>
        <Grid item xs={12} md={8}>
          <GlassCard title="Personal Information">
            <Box component="form" onSubmit={profileForm.handleSubmit((d) => updateProfile.mutate(d))} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField fullWidth label="First Name" {...profileForm.register('firstName')} error={!!profileForm.formState.errors.firstName} />
                <TextField fullWidth label="Last Name" {...profileForm.register('lastName')} error={!!profileForm.formState.errors.lastName} />
              </Box>
              <TextField fullWidth label="Email" {...profileForm.register('email')} />
              <TextField fullWidth label="Bio" multiline rows={3} {...profileForm.register('bio')} />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit" variant="contained" startIcon={<Save />} disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </Box>
          </GlassCard>
          <GlassCard title="Change Password" sx={{ mt: 2.5 }}>
            <Box component="form" onSubmit={passwordForm.handleSubmit((d) => updatePassword.mutate(d))} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField fullWidth label="Current Password" type="password" {...passwordForm.register('currentPassword')} error={!!passwordForm.formState.errors.currentPassword} helperText={passwordForm.formState.errors.currentPassword?.message} />
              <TextField fullWidth label="New Password" type="password" {...passwordForm.register('newPassword')} error={!!passwordForm.formState.errors.newPassword} helperText={passwordForm.formState.errors.newPassword?.message} />
              <TextField fullWidth label="Confirm Password" type="password" {...passwordForm.register('confirmPassword')} error={!!passwordForm.formState.errors.confirmPassword} helperText={passwordForm.formState.errors.confirmPassword?.message} />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit" variant="contained" disabled={updatePassword.isPending}>
                  {updatePassword.isPending ? 'Updating...' : 'Update Password'}
                </Button>
              </Box>
            </Box>
          </GlassCard>
        </Grid>
      </Grid>
    </Box>
  );
}
