import install from './defInstall';

export * from './components';
export * from './hooks';
export * from './utils';

export default install;

// import type { App } from 'vue';

// import IButton from './components/button';

// const components = { IButton };
// /**
//  * 组件注册
//  * @param {App} app Vue 对象
//  * @returns {Void}
//  */
// const install = function (app: App) {
//   Object.entries(components).forEach(([key, value]) => {
//     app.component(key, value);
//   });
// };

// export { IButton };

// export default {
//   install,
// };
