import * as Sentry from "@sentry/node";
import { ENV } from "./config/env.js";
Sentry.init({
    dsn: ENV.SENTRY_DSN,
    // Setting this option to true will send default PII data to Sentry.
    // For example, automatic IP address collection on events
    sendDefaultPii: true,
    tracesSampleRate: 1.0,
    profileSessionSampleRate: 1.0,
    environment: ENV.NODE_ENV,
    includeLocalVariables: true
});
