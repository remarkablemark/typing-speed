import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './components/App';
import { TypingTestApp } from './components/TypingTestApp';

const container = document.getElementById('root') as HTMLDivElement;
const root = createRoot(container);

root.render(
  <StrictMode>
    <App>
      <TypingTestApp />
    </App>
  </StrictMode>,
);
