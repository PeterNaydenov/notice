// Generates 'types/main.d.cts' from 'types/main.d.ts' for CommonJS consumers.
// 'dist/notice.cjs' sets 'module.exports = notice', so its types need 'export =' instead of 'export default'.
import { readFileSync, writeFileSync } from 'node:fs'

const
      source = readFileSync ( 'types/main.d.ts', 'utf8' )
    , result = source
                  .replace ( 'export default notice;', 'export = notice;' )
                  .replace ( /\n\/\/# sourceMappingURL=.*$/, '\n' )
    ;

if ( result === source )   throw new Error ( 'cts-types: "export default notice;" not found in types/main.d.ts' )
writeFileSync ( 'types/main.d.cts', result )
