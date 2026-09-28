import './style.css';

import { setupSearch } from './search';
import { setupComments } from './comments';
import { setupBears } from './bears';

setupSearch();
setupComments();
setupBears().catch((error: unknown) => {
  console.error('Could not initialize bears:', error);
});
