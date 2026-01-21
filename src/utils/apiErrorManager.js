const errorFlags = {
  err401: false,
  err403: false,
  err500: false,
  errOther: false,
  errNetwork: false,
  errUnknown: false,
};

export const shouldShowError = (key) => !errorFlags[key];
export const markErrorShown = (key) => {
  errorFlags[key] = true;
};

export let isLoggingOut = false;
export const startLogout = () => {
  isLoggingOut = true;
};

export const resetAllErrors = () => {
  Object.keys(errorFlags).forEach((key) => {
    errorFlags[key] = false;
  });
  isLoggingOut = false;
};
