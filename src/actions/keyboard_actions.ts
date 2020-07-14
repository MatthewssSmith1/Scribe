export const SET_IS_CTRL_PRESSED = 'SET_IS_CTRL_PRESSED'

export function setIsCtrlPressed(isCtrlPressed: boolean) {
   return {
      type: SET_IS_CTRL_PRESSED,
      isCtrlPressed,
   }
}
