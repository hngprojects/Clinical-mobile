import { useApiMutation } from '@/shared/api/hooks';

import { authApi } from '../api/auth.api';

export function useForgotPassword() {
  return useApiMutation(authApi.forgotPassword);
}
