import { Test, TestingModule } from '@nestjs/testing';
import { EdisubmitterController } from './edisubmitter.controller';
import { EdisubmitterService } from './edisubmitter.service';

describe('EdisubmitterController', () => {
  let controller: EdisubmitterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EdisubmitterController],
      providers: [EdisubmitterService],
    }).compile();

    controller = module.get<EdisubmitterController>(EdisubmitterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
