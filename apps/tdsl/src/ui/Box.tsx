import { VariantProps, cva, cx } from 'class-variance-authority';

export const base = {
  items: {
    stretch: ['items-stretch'],
  },
  padding: {
    '2': ['p-2'],
  },
  rounded: {
    normal: ['rounded'],
  },
  text: {
    xs: ['text-xs'],
    sm: ['text-sm'],
  },
  color: {
    'blue-500': ['text-blue-500'],
    'gray-400': ['text-gray-400'],
    'gray-500': ['text-gray-500'],
  },
  'hover-color': {
    'blue-500': ['hover:text-blue-500'],
    'red-500': ['hover:text-red-500'],
  },
  background: {
    white: ['bg-white'],
  },
  'hover-background': {
    'gray-50': ['hover:bg-gray-50'],
    'gray-200': ['hover:bg-gray-200'],
  },
  tracking: {
    wider: ['tracking-wider'],
  },
};

const box = cva([], { variants: base });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BoxElement = keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>;

export type BoxProps<Element extends BoxElement> = Omit<React.ComponentProps<Element>, 'children'> &
  VariantProps<typeof box> & {
    element?: keyof JSX.IntrinsicElements;
    children?: React.ReactNode;
  };

export function Box<Element extends BoxElement = 'div'>({ element, className, children, ...props }: BoxProps<Element>) {
  let Element = element ?? 'div';
  <Element className={cx(className, box(props))}>{children}</Element>;
}
