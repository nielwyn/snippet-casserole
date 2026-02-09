import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { BottomSheetContent, BottomSheetHeader, Overlay, Sheet } from "./style";

interface BottomSheetProps {
  title?: string;
  isOpen: boolean;
  isFullHeight?: boolean;
  customButtonIcon?: string;
  hideCloseButton?: boolean;
  onClickCustomButton?: () => void;
  onClose: () => void;
  children: React.ReactNode;
}

export default function BottomSheet({
  title,
  isOpen,
  isFullHeight,
  customButtonIcon,
  hideCloseButton,
  onClickCustomButton,
  onClose,
  children,
}: BottomSheetProps) {
  const [showSheet, setShowSheet] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const dragOffset = useRef<number>(0);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    onClose()
  };

  const handleCustomButtonClick = () => {
    onClickCustomButton && onClickCustomButton()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  };

  const dragStart = (clientY: number) => {
    setIsDragging(true);
    startY.current = clientY;
  };

  const dragMove = (clientY: number) => {
    if (!isDragging || !sheetRef.current) return;

    const deltaY = clientY - startY.current;
    const newOffset = Math.max(0, deltaY);

    dragOffset.current = newOffset
    sheetRef.current.style.transform = `translateY(${newOffset}px)`;
    sheetRef.current.style.animation = "none";
  };

  const dragEnd = () => {
    if (!isDragging || !sheetRef.current) return;

    setIsDragging(false)
    if (dragOffset.current > 100) {
      onClose()
    } else {
      sheetRef.current.style.transform = 'translateY(0px)'
      dragOffset.current = 0
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    dragStart(e.clientY)
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    dragStart(e.touches[0].clientY)
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => dragMove(e.clientY)
    const handleMouseUp = () => dragEnd()
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      dragMove(e.touches[0].clientY);
    };
    const handleTouchEnd = () => dragEnd()

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, dragOffset]);

  useEffect(() => {
    clearCloseTimeout()
    if (isOpen && sheetRef.current) {
      sheetRef.current.style.animation = "slideUp 0.3s forwards";
      sheetRef.current.style.transform = "translateY(0px)"
      setShowSheet(true);
    }

    if (!isOpen && sheetRef.current) {
      sheetRef.current.style.animation = "slideDown 0.3s forwards";
      sheetRef.current.style.transform = `translateY(100%)`;

      closeTimeoutRef.current = setTimeout(() => {
        setShowSheet(false)
        closeTimeoutRef.current = null;
      }, 300);
    }
  }, [isOpen, sheetRef.current, closeTimeoutRef.current]);

  return (
    <>
      <Overlay
        role="button"
        isOpen={isOpen}
        showSheet={showSheet}
        onClick={handleOverlayClick}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      />
      <Sheet
        ref={sheetRef}
        role="dialog"
        dragOffset={dragOffset.current}
        isFullHeight={isFullHeight}
        showSheet={showSheet}
        isDragging={isDragging}
        onKeyDown={handleKeyDown}
      >
        <>
          <BottomSheetHeader
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <Box width="var(--spatial-9)" height="var(--spatial-9)">
              <WillRender when={Boolean(customButtonIcon)}>
                <IconButton
                  radius="4"
                  size="3"
                  variant="secondary"
                  onClick={handleCustomButtonClick}
                >
                  <Icon icon={customButtonIcon as any} />
                </IconButton>
              </WillRender>
            </Box>
            <Text size="6" weight="bold">
              {title}
            </Text>
            <Box width="var(--spatial-9)" height="var(--spatial-9)">
              <WillRender when={!hideCloseButton}>
                <IconButton
                  radius="4"
                  size="3"
                  variant="secondary"
                  onClick={onClose}
                >
                  <Icon icon="x-mark" />
                </IconButton>
              </WillRender>
            </Box>
          </BottomSheetHeader>
          <BottomSheetContent>{children}</BottomSheetContent>
        </>
      </Sheet>
    </>
  )
}

