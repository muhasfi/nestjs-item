import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { setupApp } from '../src/setup-app';

describe('Auth Controller (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // setupApp(app)
    await app.init();
  });

  it('handler register', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'rafid',
        email: 'rafid1@test.com',
        password: 'rafid',
      })
      .expect(201)
      .then(({ body }: request.Response) => {
        expect(body.id).toBeDefined();
        expect(body.name).toBe('rafid');
        expect(body.email).toBe('rafid1@test.com');
      });
  });

  it('logged in after register', async () => {
    const email = 'rafid3@test.com';

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'rafid',
        email: email,
        password: 'rafid',
      })
      .expect(201);

    const cookie = response.get('Set-Cookie');
    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(email);
  });
});
