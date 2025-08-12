import { test, expect } from '@playwright/test';
import 'dotenv/config';
import { ApiClient } from '../../fwk/api/apiClient';
import { AuthService } from '../../fwk/api/services/auth.service';
import { LearningInstancesService } from '../../fwk/api/services/learningInstances.service';
import payloadFixture from '../fixtures/learningInstance.payload.json';

let client: ApiClient;
let li: LearningInstancesService;

test.describe('Use Case 3: Learning Instance API Flow (API Automation) @AA360', () => {
  test.beforeAll(async () => {
    await test.step('Create API client', async () => {
      client = new ApiClient(process.env.BASE_URL!);
      await client.init();
      console.log('API Client created for', process.env.BASE_URL);
    });

    await test.step('Authenticate and init service', async () => {
      const token = await new AuthService(client).login(
        process.env.DEFAULT_USER!,
        process.env.DEFAULT_PASS!
      );
      console.log('[AUTH] Token received:', token ? '***TOKEN***' : 'No token');
      li = new LearningInstancesService(client, token);
    });
  });

  test('[API]-create a Learning Instance and validate Instance Created', async () => {
    const uniqueName = `${(payloadFixture as any).name}-${Date.now()}`;
    const payload = { ...(payloadFixture as any), name: uniqueName };

    let created: any;
    await test.step('Create Learning Instance', async () => {
      created = await li.create(payload);
      console.log(`[CREATE] name: "${created.name}", description: "${created.description}"`);
      expect(created.name).toBe(uniqueName);
      expect(created.description).toBe(payloadFixture.description);
    });

    await test.step('Fetch Learning Instance by id (if available)', async () => {
      if (created?.id) {
        const fetched = await li.get(created.id);
        console.log(`[FETCH] name: "${fetched.name}", description: "${fetched.description}"`);
        expect(fetched.name).toBe(uniqueName);
        expect(fetched.description).toBe(payloadFixture.description);
      } else {
        console.warn('[WARN] No id returned in create response, skipping GET validation.');
      }
    });
  });

  test.afterAll(async () => {
    await test.step('Dispose API client', async () => {
      await client?.dispose();
      console.log('[DONE] API client disposed.');
    });
  });
});
