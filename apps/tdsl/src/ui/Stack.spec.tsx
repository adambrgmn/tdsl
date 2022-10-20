import { render } from '@testing-library/react';

import { HStack, VStack } from './Stack';

describe('<HStack />', () => {
  it('renders according to snapshots', () => {
    expect(render(<HStack />).container).toMatchInlineSnapshot(`
      <div>
        <div
          class="flex-row flex"
        />
      </div>
    `);
  });
});

describe('<VStack />', () => {
  it('renders according to snapshots', () => {
    expect(render(<VStack />).container).toMatchInlineSnapshot(`
      <div>
        <div
          class="flex-col flex"
        />
      </div>
    `);
  });
});
