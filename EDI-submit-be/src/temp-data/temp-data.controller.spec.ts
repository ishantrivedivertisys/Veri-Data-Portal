import { Test, TestingModule } from '@nestjs/testing';
import { TempDataController } from './temp-data.controller';
import { TempDataService } from './temp-data.service';

describe('TempDataController', () => {
  let controller: TempDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TempDataController],
      providers: [TempDataService],
    }).compile();

    controller = module.get<TempDataController>(TempDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
