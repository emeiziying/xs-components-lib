import path from 'path';

import type { Plugin } from 'vite';
import { projRoot } from '../utils/paths';

type Append = Record<'headers' | 'footers' | 'scriptSetups', string[]>;

const combineMarkdown = (code: string, headers: string[], footers: string[]) => {
  const fileTitle = code.indexOf('---\n\n');
  const frontmatterEnds = fileTitle < 0 ? 0 : fileTitle + 4;
  const firstSubheader = code.search(/\n## \w/);
  const sliceIndex = firstSubheader < 0 ? frontmatterEnds : firstSubheader;

  if (headers.length > 0) code = code.slice(0, sliceIndex) + headers.join('\n') + code.slice(sliceIndex);
  code += footers.join('\n');

  return `${code}\n`;
};

const combineScriptSetup = (codes: string[]) =>
  `\n\n<script setup>
${codes.join('\n')}
</script> \n
`;

export function MarkdownTransform(): Plugin {
  return {
    name: 'md-transform-plus',
    enforce: 'pre',
    async transform(code, id) {
      if (!id.endsWith('.md')) return;

      const componentId = path.basename(id, '.md');
      const filePath = path
        .relative(path.resolve(id, '..'), `${path.resolve(projRoot, 'example', `${componentId}/*.vue`)}`)
        .split(path.sep)
        .join('/');
      const append: Append = {
        headers: [],
        footers: [],
        scriptSetups: [
          `const demos = import.meta.glob('${
            filePath.startsWith('../') ? filePath : `./${filePath}`
          }',{ eager: true })`,
          `const path = '${filePath}'`,
        ],
      };

      return combineMarkdown(code, [combineScriptSetup(append.scriptSetups), ...append.headers], append.footers);
    },
  };
}
