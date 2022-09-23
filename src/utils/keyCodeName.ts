export function keyCodeName(keyCode: 'Alt' | 'Control' | 'Meta' | 'Shift') {
  const isMac = /macintosh|mac os x/i.test(navigator.userAgent)
  return {
    Alt: isMac ? '⌥' : 'Alt',
    Control: isMac ? '^' : 'Ctrl',
    Meta: isMac ? '⌘' : 'Windows',
    Shift: isMac ? '⇧' : 'Shift',
  }[keyCode]
}