export const endpoints = {
  auth: '/v2/authentication',
  learningInstances: '/cognitive/v3/learninginstances',
  learningInstance: (id: string | number) => `/cognitive/v3/learninginstances/${id}`,
};
