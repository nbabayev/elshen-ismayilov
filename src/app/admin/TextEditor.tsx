// components/TiptapEditor.tsx
"use client";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
// import TextAlign from "@tiptap/extension-text-align";
import StarterKit from "@tiptap/starter-kit";

interface TiptapEditorProps {
  content?: string;
  onChange?: (html: string) => void;
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      //   TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: content || "<p>Yazmağa başla...</p>",
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <div className="border rounded-md p-4 prose max-w-none prose-headings:text-white-900 prose-p:text-white prose-strong:text-white">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const btnBase =
    "px-3 py-1.5 rounded-md text-sm font-medium border transition-colors";
  const btnActive = "bg-blue-600 text-white border-blue-600";
  const btnInactive =
    "bg-white text-gray-700 border-gray-300 hover:bg-gray-100";

  return (
    <div className="flex gap-2 mb-3 pb-3 border-b border-gray-200">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`${btnBase} ${
          editor.isActive("bold") ? btnActive : btnInactive
        }`}
      >
        B
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`${btnBase} ${
          editor.isActive("italic") ? btnActive : btnInactive
        }`}
      >
        I
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${btnBase} ${
          editor.isActive("bulletList") ? btnActive : btnInactive
        }`}
      >
        • List
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`${btnBase} ${
          editor.isActive("heading", { level: 2 }) ? btnActive : btnInactive
        }`}
      >
        H2
      </button>
    </div>
  );
}
