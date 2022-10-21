import { render } from '@testing-library/react';

import { Spacer } from './Spacer';

it('renders according to snapshots', () => {
  expect(render(<Spacer />).container).toMatchInlineSnapshot(`
    <div>
      <div
        class="flex-1"
      />
    </div>
  `);
});
