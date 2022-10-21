import { render } from '@testing-library/react';

import { ItemHeader } from './ItemHeader';

it('renders according to snapshots', () => {
  expect(render(<ItemHeader>Item</ItemHeader>).container).toMatchInlineSnapshot(`
    <div>
      <header
        class="flex-col flex gap-1"
      >
        <div
          class="flex-row flex text-xs gap-1"
        />
        <h1
          class="text-lg font-bold"
        >
          Item
        </h1>
      </header>
    </div>
  `);
});
