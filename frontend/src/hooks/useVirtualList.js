import { useState, useEffect, useCallback, useRef } from 'react';
export function useVirtualList(items, { itemHeight, overscan = 3, containerHeight = 0 }) {
    const containerRef = useRef(null);
    const [scrollTop, setScrollTop] = useState(0);
    const [clientHeight, setClientHeight] = useState(containerHeight);
    useEffect(() => {
        if (!containerRef.current)
            return;
        const resizeObserver = new ResizeObserver((entries) => {
            const [entry] = entries;
            if (entry) {
                setClientHeight(entry.contentRect.height);
            }
        });
        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);
    const totalHeight = items.length * itemHeight;
    const getVirtualItems = useCallback(() => {
        if (!clientHeight)
            return [];
        const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
        const endIndex = Math.min(items.length, Math.ceil((scrollTop + clientHeight) / itemHeight) + overscan);
        const virtualItems = [];
        for (let i = startIndex; i < endIndex; i++) {
            virtualItems.push({
                index: i,
                start: i * itemHeight
            });
        }
        return virtualItems;
    }, [scrollTop, clientHeight, itemHeight, items.length, overscan]);
    const scrollTo = useCallback((index) => {
        if (!containerRef.current)
            return;
        const top = index * itemHeight;
        containerRef.current.scrollTop = top;
    }, [itemHeight]);
    const handleScroll = useCallback((event) => {
        const target = event.target;
        setScrollTop(target.scrollTop);
    }, []);
    useEffect(() => {
        const container = containerRef.current;
        if (!container)
            return;
        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);
    const virtualItems = getVirtualItems();
    const visibleItems = virtualItems.map((virtual) => items[virtual.index]);
    return {
        virtualItems,
        totalHeight,
        containerRef,
        scrollTo,
        visibleItems
    };
}
// Example usage:
/*
interface ListItem {
  id: string;
  content: string;
}

function VirtualizedList({ items }: { items: ListItem[] }) {
  const {
    virtualItems,
    totalHeight,
    containerRef,
    visibleItems
  } = useVirtualList(items, {
    itemHeight: 50,
    overscan: 5,
    containerHeight: 400
  });

  return (
    <div
      ref={containerRef}
      style={{
        height: '400px',
        overflow: 'auto'
      }}
    >
      <div
        style={{
          height: `${totalHeight}px`,
          width: '100%',
          position: 'relative'
        }}
      >
        {virtualItems.map((virtualItem, index) => (
          <div
            key={visibleItems[index].id}
            style={{
              position: 'absolute',
              top: 0,
              transform: `translateY(${virtualItem.start}px)`,
              width: '100%',
              height: `${50}px`
            }}
          >
            {visibleItems[index].content}
          </div>
        ))}
      </div>
    </div>
  );
}
*/ 
