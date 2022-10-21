import { VariantProps, cva } from 'class-variance-authority';

const spacer = cva([], {
  variants: {
    size: {
      fill: ['flex-1'],
    },
  },
  defaultVariants: {
    size: 'fill',
  },
});

export type SpacerProps = VariantProps<typeof spacer>;

export const Spacer: React.FC<SpacerProps> = (props) => {
  return <div className={spacer(props)} />;
};
