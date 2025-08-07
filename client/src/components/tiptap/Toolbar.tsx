import { Editor } from '@tiptap/react';
import { FaBold, FaItalic, FaList, FaListOl, FaUnderline } from 'react-icons/fa6';
import { FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify } from 'react-icons/fa';

interface ToolbarProps {
  editor: Editor | null;
}

export default function Toolbar({ editor }: ToolbarProps) {
  if (!editor) {
    return null;
  }
  const alignments = [
    { align: 'left', icon: <FaAlignLeft /> },
    { align: 'center', icon: <FaAlignCenter /> },
    { align: 'right', icon: <FaAlignRight /> },
    { align: 'justify', icon: <FaAlignJustify /> },
  ];

  return (
    <div className="flex space-x-2 rounded bg-gray-200 p-2">
      {/* Negrita */}
      <button
        type="button"
        className={`rounded p-2 transition-colors hover:bg-gray-300 hover:text-blue-600 ${
          editor.isActive('bold') ? 'bg-gray-400 text-blue-600' : ''
        }`}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <FaBold />
      </button>

      {/* Cursiva */}
      <button
        type="button"
        className={`rounded p-2 transition-colors hover:bg-gray-300 hover:text-blue-600 ${
          editor.isActive('italic') ? 'bg-gray-400 text-blue-600' : ''
        }`}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <i>
          <FaItalic />
        </i>
      </button>

      {/* Subrayado */}
      <button
        type="button"
        className={`rounded p-2 transition-colors hover:bg-gray-300 hover:text-blue-600 ${
          editor.isActive('underline') ? 'bg-gray-400 text-blue-600' : ''
        }`}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <u>
          <FaUnderline />
        </u>
      </button>

      {/* Lista desordenada */}
      <button
        type="button"
        className={`rounded p-2 transition-colors hover:bg-gray-300 hover:text-blue-600 ${
          editor.isActive('bulletList') ? 'bg-gray-400 text-blue-600' : ''
        }`}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <FaList />
      </button>

      {/* Lista ordenada */}
      <button
        type="button"
        className={`rounded p-2 transition-colors hover:bg-gray-300 hover:text-blue-600 ${
          editor.isActive('orderedList') ? 'bg-gray-400 text-blue-600' : ''
        }`}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <FaListOl />
      </button>
      <p>|</p>
      {/* Alinear texto */}
      {alignments.map(({ align, icon }) => (
        <button
          key={align}
          type="button"
          className={`rounded p-2 transition-colors hover:bg-gray-300 hover:text-blue-600 ${
            editor.isActive('textAlign', { textAlign: align }) ? 'bg-gray-400 text-blue-600' : ''
          }`}
          onClick={() => editor.chain().focus().setTextAlign(align).run()}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}
