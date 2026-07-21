import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { NotificationFactory } from 'test/factories/make-notification';
import { StudentFactory } from 'test/factories/make-student';

describe('Create Notification (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;
  let notificationFactory: NotificationFactory;
  let studentFactory: StudentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule], // DatabaseModule é necessário para usar o prisma dentro do teste (é utilizado pelo StudentFactory)
      providers: [NotificationFactory, StudentFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    studentFactory = moduleRef.get(StudentFactory);
    notificationFactory = moduleRef.get(NotificationFactory);
    jwt = moduleRef.get(JwtService);
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test('[PATCH] /notifications/:notificationId/read', async () => {
    const user = await studentFactory.makePrismaStudent({ name: 'John Doe' });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const notification = await notificationFactory.makePrismaNotification({
      recipientId: user.id,
    });

    const notificationId = notification.id.toString();

    const response = await request(app.getHttpServer())
      .patch(`/notifications/${notificationId}/read`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toEqual(204);

    const notificationOnDatabase = await prisma.notification.findFirst({
      where: {
        recipientId: user.id.toString(),
      },
    });

    expect(notificationOnDatabase?.readAt).not.toBeNull();
  });
});
