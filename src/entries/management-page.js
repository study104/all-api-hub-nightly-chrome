import { O as getJsxRuntime, k as getReactDOM } from '../vendor/react-dom-and-shared-icons.js';
import '../shared/ui-components.js';
import { t as CheckinManagerApp } from './management-app.js';

const reactDOM = getReactDOM();
const jsxRuntime = getJsxRuntime();
reactDOM
  .createRoot(document.getElementById('root'))
  .render(jsxRuntime.jsx(CheckinManagerApp, { surface: 'page' }));
