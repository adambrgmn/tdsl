import { render } from '@testing-library/react';

import { Page } from './Page';

it('renders according to snapshots', () => {
  expect(render(<Page>Item</Page>).container).toMatchInlineSnapshot(`
    <div>
      <div
        class="grid grid-cols-[1fr,2fr,2fr] gap-4 p-2 place-items-stretch h-screen"
      >
        Item
      </div>
    </div>
  `);
});
