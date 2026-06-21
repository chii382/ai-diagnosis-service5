type ProcessingListener = (pending: boolean) => void;

const listeners = new Set<ProcessingListener>();
let pendingCount = 0;

function notifyProcessingPending() {
  const pending = pendingCount > 0;
  listeners.forEach((listener) => listener(pending));
}

export function startProcessingPending() {
  pendingCount += 1;
  if (pendingCount === 1) {
    notifyProcessingPending();
  }
}

export function stopProcessingPending() {
  if (pendingCount === 0) return;
  pendingCount -= 1;
  if (pendingCount === 0) {
    notifyProcessingPending();
  }
}

export function subscribeProcessingPending(listener: ProcessingListener) {
  listeners.add(listener);
  listener(pendingCount > 0);
  return () => {
    listeners.delete(listener);
  };
}
