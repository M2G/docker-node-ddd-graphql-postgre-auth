export default ({ config }: any) => {
  const defaultResponse = (success = true) => ({
    date: new Date(),
    success,
    version: config.version
  });

  const Success = (data: any) => ({ ...defaultResponse(true), data });

  const Fail = (data: any) => ({
    ...defaultResponse(false),
    error: data
  });

  return {
    Fail,
    Success
  };
};
