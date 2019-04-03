import * as Sentry from '@sentry/browser';

const { key, enabled, user } = gon.sentry || {};

// We need to check for key presence here as we do not have a dsn for browser yet
if (enabled && key) {
  Sentry.init({ dsn: key });

  if (user.email) {
    Sentry.configureScope(scope => {
      scope.setUser(user);
    });
  }
}