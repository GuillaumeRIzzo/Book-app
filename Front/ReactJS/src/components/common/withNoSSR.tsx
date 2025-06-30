// src/components/common/withNoSSR.tsx
import dynamic from 'next/dynamic';

export function withNoSSR<P>(Component: React.ComponentType<P>) {
  return dynamic(() => Promise.resolve(Component), {
    ssr: false,
  });
}
