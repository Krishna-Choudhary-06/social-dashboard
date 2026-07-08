import { RouterProvider } from 'react-router';
import { AppProviders } from '@/app/providers';
import { router } from '@/app/router';
import { WebSocketManager } from '@/components/WebSocketManager';

function App() {
  return (
    <AppProviders>
      <WebSocketManager />
      <RouterProvider router={router} />
    </AppProviders>
  );
}

export default App;
