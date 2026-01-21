import { useMemo, MouseEvent } from 'react';

interface HighlightViewProps {
    text: string;
    highlightIndex: number;
    highlightLength?: number;
    onJump?: (index: number) => void;
}

export const HighlightView = ({ text, highlightIndex, highlightLength = 0, onJump }: HighlightViewProps) => {
    // Memoize parts to avoid re-splitting every frame if possible, 
    // but highlighting changes frequently, so simple slice is efficient enough for MVP.

    const { before, current, after } = useMemo(() => {
        if (highlightIndex < 0 || highlightIndex >= text.length) {
            return { before: text, current: '', after: '' };
        }

        // Safety check just in case
        const effectiveLength = highlightLength > 0 ? highlightLength : 0;

        // If length is 0 (browser didn't provide), try to guess next word boundary?
        // Let's implement robust fallback: find next whitespace.
        let end = highlightIndex + effectiveLength;
        if (effectiveLength === 0) {
            const nextSpace = text.indexOf(' ', highlightIndex);
            end = nextSpace === -1 ? text.length : nextSpace;
        }

        const before = text.slice(0, highlightIndex);
        const current = text.slice(highlightIndex, end);
        const after = text.slice(end);

        return { before, current, after };
    }, [text, highlightIndex, highlightLength]);

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
        if (!onJump) return;

        // Use standard Selection API to find where user clicked
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        const node = range.startContainer;
        const offset = range.startOffset;

        // Determine which span was clicked (or text node inside span)
        // We need to map this back to original text index

        // Very naive mapping: check text content of the node
        // Better: look at parents
        let clickedSpan = node.parentElement;
        if (!clickedSpan) return;

        // If clicked directly on div (margin/padding), startContainer might be the div
        if (node.nodeType === Node.ELEMENT_NODE && node === e.currentTarget) {
            // Clicked on container, hard to guess index. Ignore.
            return;
        }

        // Check if we are in one of our specific spans
        const spans = e.currentTarget.querySelectorAll('span');
        let baseIndex = 0;

        if (clickedSpan === spans[0]) { // Before
            baseIndex = 0;
        } else if (clickedSpan === spans[1]) { // Current
            baseIndex = before.length;
        } else if (clickedSpan === spans[2]) { // After
            baseIndex = before.length + current.length;
        } else {
            // Fallback for nested text nodes or if structure subtle changes
            // If node is text node, parent is span.
            if (node.textContent === before) baseIndex = 0;
            else if (node.textContent === current) baseIndex = before.length;
            else if (node.textContent === after) baseIndex = before.length + current.length;
        }

        const exactIndex = baseIndex + offset;
        onJump(exactIndex);
    };

    return (
        <div
            onClick={handleClick}
            className="w-full h-full overflow-y-auto outline-none border-none text-lg md:text-xl lg:text-2xl leading-relaxed font-sans text-soft-black dark:text-off-white cursor-text"
        >
            <span className="opacity-60 hover:opacity-100 transition-opacity">{before}</span>
            <span className="bg-yellow-300 text-soft-black rounded px-0.5 font-medium transition-colors duration-100 dark:bg-yellow-500">
                {current}
            </span>
            <span className="opacity-60 hover:opacity-100 transition-opacity">{after}</span>
        </div>
    );
};
