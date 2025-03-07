export { default as Application } from './containers/Application';
export { getBrandImage } from './components/branding/BrandImage';
export { default as I18nModule } from './modules/i18n';
export { default as TenantModule } from './modules/tenant';
export { default as AuthModule } from './modules/auth';
export { default as AuthReducer } from './modules/auth/reducer.js'; // Export auth reducer to be used in Login
export { default as AboutModule } from './modules/about';

// TODO: resolve styling by maybe creating a shared styles library?

// require('asab_webui_components/styles/index.scss'); // Not working in the lib env
// import "asab_webui_components/styles/index.scss"; // Not working in the lib env
