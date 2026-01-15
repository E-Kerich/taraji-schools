import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon,
  List, 
  Heading2, 
  Heading3,
  Heading4,
  Type,
  Link as LinkIcon,
  Image as ImageIcon,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Code,
  Minus,
  Pilcrow
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

const RichTextEditor = ({ value, onChange, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
        paragraph: {
          HTMLAttributes: {
            class: 'my-4',
          },
        },
      }),
      Underline,
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-lg my-4 max-w-full',
        },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class: 'text-red-600 hover:text-red-700 underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph', 'image'],
      }),
      Placeholder.configure({
        placeholder: 'Start writing your content here...',
      }),
      CharacterCount.configure({
        limit: null,
      }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      if (isEditing) {
        const html = editor.getHTML();
        onChange(html);
      }
    },
    editorProps: {
      attributes: {
        class: 'min-h-[400px] p-6 focus:outline-none prose prose-lg max-w-none',
        spellcheck: 'false',
      },
    },
  });

  // Reset editing state when value changes externally
  useEffect(() => {
    setIsEditing(false);
  }, [value]);

  // Update editor content when value prop changes
  useEffect(() => {
    if (editor && value !== editor.getHTML() && !isEditing) {
      editor.commands.setContent(value || '');
    }
  }, [editor, value, isEditing]);

  const handleChange = useCallback((html) => {
    onChange(html);
  }, [onChange]);

  const handleSave = () => {
    if (editor && onSave) {
      const html = editor.getHTML();
      onSave(html);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (editor && value) {
      editor.commands.setContent(value);
    }
    setIsEditing(false);
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ 
        src: url,
        alt: 'Image',
        title: 'Image'
      }).run();
      setIsEditing(true);
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl || '');
    
    if (url === null) return;
    
    if (url === '') {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().setLink({ 
        href: url,
        target: '_blank',
        rel: 'noopener noreferrer'
      }).run();
    }
    setIsEditing(true);
  };

  const toolbarButtons = [
    {
      icon: <Type className="w-4 h-4" />,
      action: () => editor.chain().focus().setParagraph().run(),
      isActive: editor.isActive('paragraph'),
      title: 'Paragraph'
    },
    {
      icon: <Heading2 className="w-4 h-4" />,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
      title: 'Heading 2'
    },
    {
      icon: <Heading3 className="w-4 h-4" />,
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive('heading', { level: 3 }),
      title: 'Heading 3'
    },
    {
      icon: <Heading4 className="w-4 h-4" />,
      action: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
      isActive: editor.isActive('heading', { level: 4 }),
      title: 'Heading 4'
    },
    { separator: true },
    {
      icon: <Bold className="w-4 h-4" />,
      action: () => {
        editor.chain().focus().toggleBold().run();
        setIsEditing(true);
      },
      isActive: editor.isActive('bold'),
      title: 'Bold'
    },
    {
      icon: <Italic className="w-4 h-4" />,
      action: () => {
        editor.chain().focus().toggleItalic().run();
        setIsEditing(true);
      },
      isActive: editor.isActive('italic'),
      title: 'Italic'
    },
    {
      icon: <UnderlineIcon className="w-4 h-4" />,
      action: () => {
        editor.chain().focus().toggleUnderline().run();
        setIsEditing(true);
      },
      isActive: editor.isActive('underline'),
      title: 'Underline'
    },
    {
      icon: <Code className="w-4 h-4" />,
      action: () => {
        editor.chain().focus().toggleCode().run();
        setIsEditing(true);
      },
      isActive: editor.isActive('code'),
      title: 'Code'
    },
    { separator: true },
    {
      icon: <List className="w-4 h-4" />,
      action: () => {
        editor.chain().focus().toggleBulletList().run();
        setIsEditing(true);
      },
      isActive: editor.isActive('bulletList'),
      title: 'Bullet List'
    },
    {
      icon: <Quote className="w-4 h-4" />,
      action: () => {
        editor.chain().focus().toggleBlockquote().run();
        setIsEditing(true);
      },
      isActive: editor.isActive('blockquote'),
      title: 'Quote'
    },
    { separator: true },
    {
      icon: <LinkIcon className="w-4 h-4" />,
      action: setLink,
      isActive: editor.isActive('link'),
      title: 'Link'
    },
    {
      icon: <ImageIcon className="w-4 h-4" />,
      action: addImage,
      isActive: false,
      title: 'Image'
    },
    { separator: true },
    {
      icon: <AlignLeft className="w-4 h-4" />,
      action: () => {
        editor.chain().focus().setTextAlign('left').run();
        setIsEditing(true);
      },
      isActive: editor.isActive({ textAlign: 'left' }),
      title: 'Align Left'
    },
    {
      icon: <AlignCenter className="w-4 h-4" />,
      action: () => {
        editor.chain().focus().setTextAlign('center').run();
        setIsEditing(true);
      },
      isActive: editor.isActive({ textAlign: 'center' }),
      title: 'Align Center'
    },
    {
      icon: <AlignRight className="w-4 h-4" />,
      action: () => {
        editor.chain().focus().setTextAlign('right').run();
        setIsEditing(true);
      },
      isActive: editor.isActive({ textAlign: 'right' }),
      title: 'Align Right'
    },
    { separator: true },
    {
      icon: <Undo className="w-4 h-4" />,
      action: () => {
        editor.chain().focus().undo().run();
        setIsEditing(true);
      },
      isActive: false,
      disabled: !editor.can().undo(),
      title: 'Undo'
    },
    {
      icon: <Redo className="w-4 h-4" />,
      action: () => {
        editor.chain().focus().redo().run();
        setIsEditing(true);
      },
      isActive: false,
      disabled: !editor.can().redo(),
      title: 'Redo'
    }
  ];

  if (!editor) {
    return (
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <div className="min-h-[400px] p-6 bg-gray-50 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-4 border-b border-gray-200 bg-gray-50">
        {toolbarButtons.map((item, index) => {
          if (item.separator) {
            return (
              <div key={`sep-${index}`} className="w-px h-6 bg-gray-300 mx-1" />
            );
          }

          return (
            <button
              key={index}
              onClick={item.action}
              disabled={item.disabled}
              className={`p-2 rounded transition-all duration-150 ${
                item.isActive
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              } ${item.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
              title={item.title}
              type="button"
            >
              {item.icon}
            </button>
          );
        })}
      </div>

      {/* Editor Content */}
      <div 
        className="bg-white focus-within:ring-2 focus-within:ring-red-500 focus-within:border-transparent transition-all"
        onClick={() => setIsEditing(true)}
      >
        <EditorContent 
          editor={editor} 
        />
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{editor.storage.characterCount?.characters() || 0}</span> characters
            <span className="mx-2">•</span>
            <span className="font-medium">{editor.storage.characterCount?.words() || 0}</span> words
          </div>
          
          {isEditing && (
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <span className="text-xs text-red-600 font-medium">Editing</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {isEditing && (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                type="button"
              >
                Save Changes
              </button>
            </>
          )}
          
          <button
            onClick={() => {
              editor.chain().focus().clearContent().run();
              setIsEditing(true);
            }}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
            type="button"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Help Text */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Tip: Use headings (H2, H3, H4) for structure, and Paragraph for normal text. Press Enter to create new paragraphs.
        </p>
      </div>
    </div>
  );
};

export default RichTextEditor;