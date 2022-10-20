import { VariantProps, cva, cx } from 'class-variance-authority';

import { base } from './base';

const stack = cva(['flex'], {
  variants: {
    ...base,
    gap: {
      '1': ['gap-1'],
      '2': ['gap-2'],
      '4': ['gap-4'],
      '8': ['gap-8'],
    },
    flex: {
      fill: 'flex-1',
    },
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StackElement = keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>;

export type StackProps<Element extends StackElement> = VariantProps<typeof stack> & {
  element?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
} & Omit<React.ComponentProps<Element>, 'children'>;

export function VStack<Element extends StackElement = 'div'>({
  children,
  element,
  className,
  ...props
}: StackProps<Element>) {
  let Element = element ?? 'div';
  return <Element className={cx('flex-col', className, stack(props))}>{children}</Element>;
}

export function HStack<Element extends StackElement = 'div'>({
  children,
  element,
  className,
  ...props
}: StackProps<Element>) {
  let Element = element ?? 'div';
  return <Element className={cx('flex-row', className, stack(props))}>{children}</Element>;
}
