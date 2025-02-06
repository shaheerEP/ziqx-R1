import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

export default function ChatBox({ messages, loading }) {
  // Custom renderer for code blocks
  const CodeBlock = ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
  
    return !inline ? (
      <div className="relative my-4">
        {/* Header with language and copy button */}
        <div className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-t-md border border-b-0 border-gray-200">
          <span className="text-sm font-mono text-gray-600">{language}</span>
          <button
            onClick={() => navigator.clipboard.writeText(String(children))}
            className="text-gray-500 hover:text-gray-700 text-sm flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy
          </button>
        </div>
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          PreTag="div"
          className="rounded-b-md !mt-0"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    ) : (
      <code className="bg-gray-100 rounded px-1 py-0.5 font-mono text-sm" {...props}>
        {children}
      </code>
    );
  };

  const formatMessage = (text) => {
    const parts = text.split(/(<think>|<\/think>)/);
    
    return parts.map((part, index) => {
      if (part === '<think>' || part === '</think>') return null;
      const isThinkContent = index > 0 && parts[index - 1] === '<think>';
      
      return (
        <span key={index} className={isThinkContent ? 'text-gray-500' : ''}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              code: CodeBlock,
              p: ({ children }) => (
                <span className="block mb-4 leading-relaxed">{children}</span>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-inherit">{children}</strong>
              ),
              em: ({ children }) => (
                <span className="italic">{children}</span>
              ),
              h1: ({ children }) => (
                <span className="block text-2xl font-bold my-4">{children}</span>
              ),
              h2: ({ children }) => (
                <span className="block text-xl font-bold my-3">{children}</span>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-bold my-2 text-gray-800">{children}</h3>
              ),
              // Enhanced list rendering
              ul: ({ children }) => (
                <span className="block space-y-2 my-3 ml-4">{children}</span>
              ),
              ol: ({ children }) => (
                <span className="block space-y-2 my-3 ml-4">
                  {React.Children.map(children, (child, i) => 
                    React.cloneElement(child, { index: i + 1 })
                  )}
                </span>
              ),
              li: ({ children, index }) => (
                <span className="block flex items-start">
                  {index ? (
                    <span className="mr-2 font-bold">{index}.</span>
                  ) : (
                    <span className="mr-2">•</span>
                  )}
                  <span className="flex-1">{children}</span>
                </span>
              ),
              blockquote: ({ children }) => (
                <span className="block border-l-4 border-gray-300 pl-4 my-3 italic">
                  {children}
                </span>
              ),
            }}
          >
            {part}
          </ReactMarkdown>
        </span>
      );
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`
              max-w-[85%] rounded-xl p-4 
              ${message.sender === 'user'
                ? 'bg-blue-600 text-white'
                : message.sender === 'bot-think'
                  ? 'bg-gray-100 text-gray-500 border border-gray-200 shadow-sm mt-2'
                  : 'bg-white border border-gray-200 shadow-sm'
              }
            `}
          >
            {formatMessage(message.text)}
            {loading && index === messages.length - 1 && message.sender !== 'user' && (
              <div className="flex space-x-2 items-center pt-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}