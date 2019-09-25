import { SocialModule } from './social.module';

describe('AdminModule', () => {
  let socialModule: SocialModule;

  beforeEach(() => {
    socialModule = new SocialModule();
  });

  it('should create an instance', () => {
    expect(socialModule).toBeTruthy();
  });
});
