import { Test, TestingModule } from '@nestjs/testing';
import { EdisubmitterService } from './edisubmitter.service';

describe('EdisubmitterService', () => {
  let service: EdisubmitterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EdisubmitterService],
    }).compile();

    service = module.get<EdisubmitterService>(EdisubmitterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
