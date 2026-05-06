'use client';

import React, { useEffect, useRef } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
// @ts-ignore
import Header from '@editorjs/header';
// @ts-ignore
import List from '@editorjs/list';
// @ts-ignore
import ImageTool from '@editorjs/image';
// @ts-ignore
import Quote from '@editorjs/quote';
// @ts-ignore
import Code from '@editorjs/code';
// @ts-ignore
import Delimiter from '@editorjs/delimiter';
// @ts-ignore
import InlineCode from '@editorjs/inline-code';
// @ts-ignore
import Table from '@editorjs/table';

interface EditorProps {
  data?: OutputData;
  onChange: (data: OutputData) => void;
}

class SimpleEmbedTool {
  private data: any;
  private wrapper: HTMLDivElement;

  static get toolbox() {
    return {
      title: 'Embed',
      icon: '<svg width="17" height="14" viewBox="0 0 17 14" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 11.5L1 7l4.5-4.5M11.5 2.5L16 7l-4.5 4.5M10 1L7 13" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    };
  }

  constructor({ data }: { data: any }) {
    this.data = data || {};
    this.wrapper = document.createElement('div');
  }

  render() {
    this.wrapper.className = 'space-y-3';
    const input = document.createElement('input');
    input.type = 'url';
    input.placeholder = 'Paste YouTube/Vimeo/CodePen embed URL...';
    input.value = this.data?.embed || this.data?.source || '';
    input.className = 'w-full px-4 py-3 rounded-xl border border-slate-300 bg-transparent outline-none text-slate-800';

    const hint = document.createElement('p');
    hint.className = 'text-xs text-slate-500';
    hint.innerText = 'Supported now: YouTube, Vimeo, CodePen, Google Maps, Figma, Loom, or direct iframe URLs.';

    const note = document.createElement('p');
    note.className = 'text-xs text-slate-500';
    note.innerText = 'Auto-converts common share URLs (YouTube watch/shorts, Loom share, Figma file/proto). For Maps, use Google Maps "Embed a map" link for best results.';

    const status = document.createElement('p');
    status.className = 'text-xs font-medium';

    const validateEmbedUrl = (value: string) => {
      if (!value) {
        status.className = 'text-xs font-medium text-slate-500';
        status.innerText = 'Paste a URL to validate embed support.';
        return;
      }
      try {
        const parsed = new URL(value);
        const host = parsed.hostname.toLowerCase();
        const isSupported =
          host.includes('youtube.com') ||
          host.includes('youtu.be') ||
          host.includes('vimeo.com') ||
          host.includes('codepen.io') ||
          host.includes('loom.com') ||
          host.includes('figma.com') ||
          (host.includes('google.com') && parsed.pathname.startsWith('/maps/embed'));

        if (isSupported) {
          status.className = 'text-xs font-medium text-emerald-600';
          status.innerText = 'Looks good. This URL should embed correctly.';
        } else {
          status.className = 'text-xs font-medium text-amber-600';
          status.innerText = 'This URL may not embed. Prefer YouTube, Vimeo, CodePen, Loom, Figma, or Google Maps embed links.';
        }
      } catch {
        status.className = 'text-xs font-medium text-red-500';
        status.innerText = 'Invalid URL format. Please paste a complete URL.';
      }
    };

    validateEmbedUrl(input.value || '');
    input.addEventListener('input', () => validateEmbedUrl(input.value));

    this.wrapper.appendChild(input);
    this.wrapper.appendChild(hint);
    this.wrapper.appendChild(note);
    this.wrapper.appendChild(status);
    return this.wrapper;
  }

  save(blockContent: HTMLDivElement) {
    const input = blockContent.querySelector('input');
    const rawUrl = (input as HTMLInputElement)?.value?.trim() || '';

    const normalizeEmbedUrl = (value: string) => {
      if (!value) return '';
      try {
        const parsed = new URL(value);
        const host = parsed.hostname.toLowerCase();

        if (host.includes('youtu.be')) {
          const id = parsed.pathname.replace('/', '').trim();
          if (id) return `https://www.youtube-nocookie.com/embed/${id}`;
        }

        if (host.includes('youtube.com')) {
          if (parsed.pathname.startsWith('/watch')) {
            const id = parsed.searchParams.get('v');
            if (id) return `https://www.youtube-nocookie.com/embed/${id}`;
          }

          if (parsed.pathname.startsWith('/shorts/')) {
            const id = parsed.pathname.split('/shorts/')[1]?.split('/')[0];
            if (id) return `https://www.youtube-nocookie.com/embed/${id}`;
          }

          if (parsed.pathname.startsWith('/embed/')) {
            const id = parsed.pathname.split('/embed/')[1]?.split('/')[0];
            if (id) return `https://www.youtube-nocookie.com/embed/${id}`;
          }
        }

        if (host.includes('loom.com')) {
          if (parsed.pathname.startsWith('/share/')) {
            const id = parsed.pathname.split('/share/')[1]?.split('/')[0];
            if (id) return `https://www.loom.com/embed/${id}`;
          }
          if (parsed.pathname.startsWith('/embed/')) {
            return value;
          }
        }

        if (host.includes('figma.com')) {
          if (parsed.pathname.startsWith('/embed')) {
            return value;
          }
          if (parsed.pathname.startsWith('/file/') || parsed.pathname.startsWith('/proto/')) {
            return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(value)}`;
          }
        }

        if (host.includes('google.com') && parsed.pathname.startsWith('/maps/embed')) {
          return value;
        }
      } catch {
        return value;
      }
      return value;
    };

    const url = normalizeEmbedUrl(rawUrl);
    return {
      embed: url,
      source: url,
      service: 'custom',
      caption: '',
    };
  }
}

const Editor: React.FC<EditorProps> = ({ data, onChange }) => {
  const ejInstance = useRef<EditorJS | null>(null);
  const isReadyRef = useRef(false);
  const TableTool: any = (Table as any)?.default || Table;

  useEffect(() => {
    if (!ejInstance.current) {
      const editor = new EditorJS({
        holder: 'editorjs',
        data: data || { blocks: [] },
        placeholder: 'Write something extraordinary...',
        tools: {
          header: {
            class: Header,
            inlineToolbar: true,
            config: {
              placeholder: 'Enter a heading',
              levels: [2, 3, 4],
              defaultLevel: 2,
            },
          },
          list: {
            class: List,
            inlineToolbar: true,
          },
          image: {
            class: ImageTool,
            config: {
              endpoints: {
                byFile: '/api/blogs/upload-image',
              },
            },
          },
          quote: {
            class: Quote,
            inlineToolbar: true,
            config: {
              quotePlaceholder: 'Enter a quote',
              captionPlaceholder: "Quote's author",
            },
          },
          code: Code,
          delimiter: Delimiter,
          inlineCode: InlineCode,
          table: {
            class: TableTool,
            inlineToolbar: true,
            config: {
              rows: 2,
              cols: 3,
            },
          },
          embed: {
            class: SimpleEmbedTool,
          },
        },
        onChange: async (api) => {
          const content = await api.saver.save();
          onChange(content);
        },
        onReady: () => {
          isReadyRef.current = true;
        },
      });
      ejInstance.current = editor;
    }

    return () => {
      if (ejInstance.current && ejInstance.current.destroy) {
        if (isReadyRef.current) {
          try {
            ejInstance.current.destroy();
          } catch (e) {
            console.error('Editor cleanup error:', e);
          }
          ejInstance.current = null;
          isReadyRef.current = false;
        } else {
          ejInstance.current.isReady
            .then(() => {
              if (ejInstance.current) {
                try {
                  ejInstance.current.destroy();
                } catch (e) {
                  // Ignore if already destroyed
                }
                ejInstance.current = null;
                isReadyRef.current = false;
              }
            })
            .catch((err) => console.error('Editor cleanup error:', err));
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative group/editor">
      <div
        id="editorjs"
        className="prose prose-lg prose-slate dark:prose-invert max-w-none min-h-[600px] focus:outline-none text-slate-800 dark:text-slate-100 cursor-text"
      />

      <div className="absolute top-0 right-0 pointer-events-none opacity-0 group-hover/editor:opacity-30 transition-opacity">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-bl-2xl">
          Editor.js Engine v3
        </span>
      </div>
    </div>
  );
};

export default Editor;