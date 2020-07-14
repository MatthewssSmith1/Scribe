export const SET_IS_DRAGGING = 'SET_IS_DRAGGING'
export const TOGGLE_COLLAPSED = 'TOGGLE_COLLAPSED'
export const RESIZE = 'RESIZE'

export function setIsDragging(isDragging: boolean) {
   return {
      type: SET_IS_DRAGGING,
      isDragging,
   }
}

export function toggleCollapsed() {
   return {
      type: TOGGLE_COLLAPSED,
   }
}

export function resize(newWidth: number) {
   return {
      type: RESIZE,
      newWidth,
   }
}
