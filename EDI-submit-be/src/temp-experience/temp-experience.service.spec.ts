import { Test, TestingModule } from '@nestjs/testing';
import { TempExperienceService } from './temp-experience.service';

describe('TempExperienceService', () => {
  let service: TempExperienceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TempExperienceService],
    }).compile();

    service = module.get<TempExperienceService>(TempExperienceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
