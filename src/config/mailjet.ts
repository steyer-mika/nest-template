import { LangService } from '@/services/lang/lang.service';

export default {
  from: 'noreply@nest-template.com',
  name: 'Nest Template',

  templates: {
    resetPassword: {
      id: 0,
      subject: LangService.t('Mail.ResetPassword'),
    },
    verifyEmail: {
      id: 0,
      subject: LangService.t('Mail.VerifyEmail'),
    },
  },
} as const;
