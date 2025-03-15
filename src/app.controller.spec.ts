import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('root', () => {
    it('should return hello message', () => {
      const result = 'Hello World!';
      jest.spyOn(appService, 'getHello').mockImplementation(() => result);
      expect(appController.getHello()).toBe(result);
    });
  });

  describe('health', () => {
    it('should return health status', () => {
      const healthCheck = appController.healthCheck();
      expect(healthCheck).toHaveProperty('status', 'ok');
      expect(healthCheck).toHaveProperty('timestamp');
      expect(new Date(healthCheck.timestamp)).toBeInstanceOf(Date);
    });
  });
});
