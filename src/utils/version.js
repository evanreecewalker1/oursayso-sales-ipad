// Version utilities for Oursayso Portfolio App
import packageJson from '../../package.json';

export const VERSION_INFO = {
  version: packageJson.version,
  buildTimestamp: process.env.REACT_APP_BUILD_TIMESTAMP || new Date().toISOString(),
  buildNumber: process.env.REACT_APP_BUILD_NUMBER || '1',
  gitCommit: process.env.REACT_APP_GIT_COMMIT || 'unknown',
  environment: process.env.NODE_ENV || 'development'
};

export const getVersionString = () => {
  return `v${VERSION_INFO.version}`;
};

export const getBuildString = () => {
  const buildDate = new Date(VERSION_INFO.buildTimestamp);
  const formattedDate = buildDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  });
  const formattedTime = buildDate.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  return `Build ${formattedDate} ${formattedTime}`;
};

export const getFullVersionString = () => {
  return `${getVersionString()} • ${getBuildString()}`;
};

export const isProduction = () => {
  return VERSION_INFO.environment === 'production';
};

export const getVersionForCacheBusting = () => {
  return `${VERSION_INFO.version}-${VERSION_INFO.buildNumber}`;
};

// For debugging
export const getVersionDebugInfo = () => {
  return {
    ...VERSION_INFO,
    versionString: getVersionString(),
    buildString: getBuildString(),
    fullVersionString: getFullVersionString()
  };
};