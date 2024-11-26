import { Test, TestingModule } from '@nestjs/testing';
import { TempExperienceController } from './temp-experience.controller';
import { TempExperienceService } from './temp-experience.service';

describe('TempExperienceController', () => {
  let controller: TempExperienceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TempExperienceController],
      providers: [TempExperienceService],
    }).compile();

    controller = module.get<TempExperienceController>(TempExperienceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
