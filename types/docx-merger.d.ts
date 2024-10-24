// types/docx-merger.d.ts
declare module 'docx-merger' {
    export default class DocxMerger {
      constructor(options: object, files: string[]);
      save(type: string, callback: (data: Buffer) => void): void;
    }
  }
  