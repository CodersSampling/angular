/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {DocEntry} from '@angular/compiler-cli/src/ngtsc/docs';
import {ClassEntry, DirectiveEntry, EntryType, MemberTags, PipeEntry, PropertyEntry} from '@angular/compiler-cli/src/ngtsc/docs/src/entities';
import {runInEachFileSystem} from '@angular/compiler-cli/src/ngtsc/file_system/testing';
import {loadStandardTestFiles} from '@angular/compiler-cli/src/ngtsc/testing';

import {NgtscTestEnvironment} from '../env';

const testFiles = loadStandardTestFiles({fakeCore: true, fakeCommon: true});

runInEachFileSystem(os => {
  let env!: NgtscTestEnvironment;

  describe('ngtsc pipe docs extraction', () => {
    beforeEach(() => {
      env = NgtscTestEnvironment.setup(testFiles);
      env.tsconfig();
    });

    it('should extract standalone pipe info', () => {
      env.write('test.ts', `
        import {Pipe} from '@angular/core';
        @Pipe({
          standalone: true,
          name: 'shorten',
        })
        export class ShortenPipe {
          transform(value: string): string { return ''; }
        }
      `);

      const docs: DocEntry[] = env.driveDocsExtraction();

      expect(docs.length).toBe(1);
      expect(docs[0].entryType).toBe(EntryType.Pipe);

      const directiveEntry = docs[0] as PipeEntry;
      expect(directiveEntry.isStandalone).toBe(true);
      expect(directiveEntry.name).toBe('ShortenPipe');
      expect(directiveEntry.pipeName).toBe('shorten');
    });

    it('should extract NgModule pipe info', () => {
      env.write('test.ts', `
        import {Pipe, NgModule} from '@angular/core';
        @Pipe({name: 'shorten'})
        export class ShortenPipe {
          transform(value: string): string { return ''; }
        }

        @NgModule({declarations: [ShortenPipe]})
        export class PipeModule { }
      `);

      const docs: DocEntry[] = env.driveDocsExtraction();

      expect(docs.length).toBe(2);
      expect(docs[0].entryType).toBe(EntryType.Pipe);

      const directiveEntry = docs[0] as PipeEntry;
      expect(directiveEntry.isStandalone).toBe(false);
      expect(directiveEntry.name).toBe('ShortenPipe');
      expect(directiveEntry.pipeName).toBe('shorten');
    });
  });
});
