import { TranslationService } from '@/services/translation/translation.service';

export default {
  from: 'noreply@nest-template.com',
  name: 'Nest Template',

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
