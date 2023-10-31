import type { UUID } from 'crypto';

export type UserType = {
  id: UUID;
  name: string;
  email: string;
  password: string;
};
