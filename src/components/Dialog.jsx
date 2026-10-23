import {useLayoutEffect, useRef} from 'react';

// Native dialogs provide focus trapping, Escape behavior, and an accessible modal top layer.
export default function Dialog({id, mode, active, revision, onClose, children, ...attributes}) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const dialog = ref.current;
    if (active) {
      if (!dialog.open) dialog.showModal();
      dialog.scrollTop = 0;
      dialog.querySelector(id === 'terminal-dialog' ? 'input' : '#panel-title')?.focus({preventScroll: true});
    } else if (dialog.open) dialog.close();
  }, [active, id, revision]);
  function backdrop(event) {
    if (event.target !== ref.current || id === 'quick-view' || id === 'mobile-choice') return;
    const rect = ref.current.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose(mode);
  }
  return <dialog {...attributes} id={id} data-mode={mode} ref={ref}
    onCancel={event => {event.preventDefault(); onClose(mode);}}
    onClose={() => {if (!ref.current.open) onClose(mode);}} onClick={backdrop}>{children}</dialog>;
}
