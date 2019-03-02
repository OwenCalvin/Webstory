export interface ILoggedResponse {
  authenticated: boolean;
  user: boolean;
  userId: string;
  oneTapPrompt: boolean;
  status: string;
}
