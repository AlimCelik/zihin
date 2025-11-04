// Bu dosya, TypeScript'e "import { ReactComponent ... } from ....svg" komutunun
// ne anlama geldiğini öğretir.
declare module '*.svg' {
  import * as React from 'react';
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;
  const src: string;
  export default src;
}