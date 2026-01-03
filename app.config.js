export default ({ config }) => ({
  ...config,
  extra: {
    ...(config.extra ?? {}),
    eas: {
      projectId: "1217eea5-49eb-46f2-806a-9afdcea2f153",
      ...(config.extra?.eas ?? {}),
    },
    SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
    SUPABASE_KEY: process.env.EXPO_PUBLIC_SUPABASE_KEY,
  },
});
