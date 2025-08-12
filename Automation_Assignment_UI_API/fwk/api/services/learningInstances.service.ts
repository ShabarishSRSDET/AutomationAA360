import { ApiClient } from '../apiClient';
import { endpoints } from '../endpoints';
import { expectSchema, expectStatus, timed, expectUnder } from '../validators';
import { LearningInstanceSchema } from '../schemas';

export class LearningInstancesService {
  constructor(private client: ApiClient, private token: string) {}

  private auth() {
    return { 'X-authorization': this.token };
  }

  async create(payload: unknown) {
    const { result: res, ms } = await timed(() =>
      this.client.context.post(endpoints.learningInstances, {
        data: payload,
        headers: this.auth(),
      })
    );
    await expectStatus(res, [200, 201]);
    await expectUnder(ms, 7000, 'Create learning instance'); 
    return expectSchema(res, LearningInstanceSchema);
  }

  async get(id: string | number) {
    const { result: res, ms } = await timed(() =>
      this.client.context.get(endpoints.learningInstance(String(id)), {
        headers: this.auth(),
      })
    );
    await expectStatus(res, 200);
    await expectUnder(ms, 4000, 'Get learning instance');
    return expectSchema(res, LearningInstanceSchema);
  }
}
