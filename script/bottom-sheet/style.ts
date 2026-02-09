import styled from "styled-components";

export const Overlay = styled.div <{
  showSheet?: boolean;
  isOpen: boolean;
}>`
  display: ${(p) => p.showSheet ? "block" : "none"};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--overlay-black40-40);
  z-index: 999;
  user-select: none;
  pointer-events: ${(p) => p.isOpen ? "auto" : "none"};
  animation: ${(p) => {
    if (p.isOpen) return "fadeInOverlay 0.3s forwards";
    return "fadeOutOverlay 0.3s forwards"
  }};

  @keyframes fadeInOverlay {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeOutOverlay {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;

export const Sheet = styled.div <{
  dragOffset: number
  showSheet?: boolean;
  isFullHeight?: boolean;
  isDragging: boolean;
}>`
  display: ${(p) => p.showSheet ? "block" : "none"};
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--materials-thick);
  box-shadow: var(--shadow-blur-lg);
  backdrop-filter: blur(50px);
  border-radius: var(--radius-8) var(--radius-8) 0 0;
  height: ${p => p.isFullHeight ? "90vh" : "auto"};
  min-height: "200px";
  max-height: 90vh;
  z-index: 999;
  outline: none;
  animation: slideUp 0.3s forwards;
  transform: translateY(100%);
  transition: ${(p) => {
    if (p.isDragging) return "none";
    return "transform 0.3s ease";
  }};
  @keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0%); }
  }
  @keyframes slideDown {
    from { transform: translateY(${p => p.dragOffset}px); }
    to { transform: translateY(100%); }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    padding: 1px 1px 0px 1px;
    border-radius: inherit;
    background: linear-gradient(
      157deg,
      rgba(255, 255, 255, 0.40) 2.12%,
      rgba(255, 255, 255, 0.00) 39%,
      rgba(255, 255, 255, 0.00) 54.33%,
      rgba(255, 255, 255, 0.10) 93.02%
    );
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    z-index: -1;
  }
`

export const BottomSheetHeader = styled.div`
  position: relative;
  padding: var(--spatial-5);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;

  &:active {
    cursor: grabbing;
  }
`

export const BottomSheetContent = styled.div`
  overflow-y: auto;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;
