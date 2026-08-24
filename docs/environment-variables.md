# Environment Variables

*Note: Never commit secrets. This file serves as documentation for required variables.*

## AdSense (Optional/Feature Flagged)
- `PUBLIC_ADSENSE_ENABLED=false`
- `PUBLIC_ADSENSE_CLIENT_ID=` (leave blank in dev unless testing)
- `PUBLIC_ADSENSE_TEST_MODE=true`

## Future Integrations
To be determined as Cloudflare D1, Workers, or specific analytics providers are added.

## Deployment Configuration
Ensure preview deployments do not expose production secrets or feature flags inappropriately.
