import { createEffect, createSignal, onCleanup, onMount } from 'solid-js';

function getFullscreenElement() {
  return (
    document.fullscreenElement || // Standard property
    (document as any).webkitFullscreenElement || // Safari/Opera support
    (document as any).mozFullscreenElement // Firefox support
  );
}

export const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = createSignal(Boolean(document.fullscreenElement));

  const toggleFullscreen = (fullscreen) => {
    if (fullscreen) {
      document.documentElement.requestFullscreen();
      return;
    }

    document.exitFullscreen();
  };

  onMount(() => {
    const fullscreenChangeListener = () => {
      if (getFullscreenElement()) {
        setIsFullscreen(true);

        return;
      }

      setIsFullscreen(false);
    };

    document.addEventListener('fullscreenchange', fullscreenChangeListener);

    onCleanup(() => document.removeEventListener('fullscreenchange', fullscreenChangeListener));
  });

  createEffect(() => {
    const pressF11Listener = (event: KeyboardEvent) => {
      if (event.key !== 'F11') return;

      event.preventDefault();

      if (isFullscreen()) {
        toggleFullscreen(false);

        return;
      }

      toggleFullscreen(true);
    };

    document.addEventListener('keydown', pressF11Listener);

    onCleanup(() => document.removeEventListener('keydown', pressF11Listener));
  });

  return { isFullscreen, toggleFullscreen };
};
