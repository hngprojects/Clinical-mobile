import { useApiMutation } from '@/shared/api/hooks';

import { authApi } from '../api/auth.api';

export function useRegister() {
  return useApiMutation(authApi.register);
}
