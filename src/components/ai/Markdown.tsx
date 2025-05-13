import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        strong: ({ children }) => <span className="font-bold text-primary">{children}</span>,
        em: ({ children }) => <span className="italic">{children}</span>,
        ul: ({ children }) => <ul className="list-disc pl-4 space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-4 space-y-1">{children}</ol>,
        li: ({ children }) => <li className="marker:text-primary">{children}</li>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
