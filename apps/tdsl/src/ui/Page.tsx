import { VariantProps, cva } from 'class-variance-authority';

export const Page: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="grid grid-cols-[1fr,2fr,2fr] gap-4 p-2 place-items-stretch h-screen">{children}</div>;
};

const pageSection = cva(['p-4', 'rounded-md', 'flex', 'flex-col'], {
  variants: {
    level: {
      primary: ['bg-gray-100'],
      secondary: ['bg-gray-200'],
      item: ['bg-gray-300'],
      danger: ['bg-red-200'],
    },
  },
});

export type PageSectionProps = VariantProps<typeof pageSection> & {
  children: React.ReactNode;
  element: keyof JSX.IntrinsicElements;
};

export const PageSection: React.FC<PageSectionProps> = ({ level, element: Element, children }) => {
  return <Element className={pageSection({ level })}>{children}</Element>;
};
