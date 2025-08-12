import { ApiClient } from '../apiClient';
import { endpoints } from '../endpoints';
import { expectSchema, expectStatus, timed, expectUnder } from '../validators';
import { AuthResponseSchema } from '../schemas';

export class AuthService {
  constructor(private client: ApiClient) {}

  async login(username: string, password: string) {
    const { result: res, ms } = await timed(() =>
      this.client.context.post(endpoints.auth, {
        data: { username, password, captcha: {} },
      })
    );
    await expectStatus(res, 200);
    await expectUnder(ms, 3000, 'Auth');
    const json = await expectSchema(res, AuthResponseSchema);
    return json.token;
  }
}
