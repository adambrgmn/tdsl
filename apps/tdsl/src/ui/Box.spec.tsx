import { render } from '@testing-library/react';

import { Box } from './Box';

it('renders according to snapshot', () => {
  let { container } = render(<Box element="section" rounded="normal" />);
  expect(container).toMatchInlineSnapshot(`
    <div>
      <section
        class="rounded"
      />
    </div>
  `);
});
