import { TranslationService } from '@/services/translation/translation.service';

export default {
  from: 'noreply@motion-impact.com',
  name: 'Motion Impact',

  templates: {
    resetPassword: {
      id: 0,
      subject: TranslationService.t('Mail.ResetPassword'),
    },
    verifyEmail: {
      id: 0,
      subject: TranslationService.t('Mail.VerifyEmail'),
    },
  },
} as const;
