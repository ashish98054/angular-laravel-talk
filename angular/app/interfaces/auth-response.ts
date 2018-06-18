import { AuthUserInterface } from './auth-user';
import { AuthTokenInterface } from './auth-token';

export interface AuthResponseInterface {
  token: AuthTokenInterface;
  user: AuthUserInterface;
}
