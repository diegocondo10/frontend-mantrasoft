// components/CKEditorWrapper.tsx
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  // Advanced plugins
  Alignment,
  Bold,
  ClassicEditor,
  Essentials,
  Font,
  Heading,
  Italic,
  Link,
  List,
  Paragraph,
  Undo,
} from 'ckeditor5';

const CKEditorWrapper = () => {
  return (
    <CKEditor
      editor={ClassicEditor}
      config={{
        style: {},
        toolbar: {
          items: [
            'undo',
            'redo',
            '|',
            'heading',
            '|',
            'bold',
            'italic',
            'fontSize',
            'fontFamily',
            'fontColor',
            '|',
            'alignment:left',
            'alignment:center',
            'alignment:right',
            'alignment:justify',
            '|',
            'bulletedList',
            'numberedList',
            '|',
            'link',
            'blockQuote',
            'insertTable',
            '|',
            'imageUpload',
            'mediaEmbed',
          ],
        },
        heading: {
          options: [
            { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
            { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
            { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
            { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
          ],
        },
        fontFamily: {
          options: ['default', 'Ubuntu, Arial, sans-serif', 'Ubuntu Mono, Courier New, Courier, monospace'],
        },
        alignment: {
          options: ['left', 'center', 'right', 'justify'],
        },
        image: {
          toolbar: ['imageTextAlternative', 'imageStyle:inline', 'imageStyle:block', 'imageStyle:side'],
        },
        table: {
          contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
        },
        plugins: [
          // Basic plugins
          Essentials,
          Heading,
          Bold,
          Italic,
          Undo,
          Paragraph,
          Alignment,
          Link,
          List,
          Font,
          // Advanced plugins
          //   Mention,
          //   BlockQuote,
          //   Table,
          //   ImageUpload,
          //   MediaEmbed,
        ],

        initialData: '<p>Hola desde CKEditor 5 en React!</p>',
        language: {
          ui: 'es',
          content: 'es',
        },
      }}
    />
  );
};

export default CKEditorWrapper;
