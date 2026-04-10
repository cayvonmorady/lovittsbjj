let timerCounter = 0;

function createTimerLabel(label: string): string {
  timerCounter += 1;
  return `${label} [${timerCounter}]`;
}

export function startTimer(label: string): string {
  const timerLabel = createTimerLabel(label);
  console.time(timerLabel);
  return timerLabel;
}

export function endTimer(timerLabel: string): void {
  console.timeEnd(timerLabel);
}

export async function timeAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
  const timerLabel = startTimer(label);
  try {
    return await fn();
  } finally {
    endTimer(timerLabel);
  }
}

export function timeSync<T>(label: string, fn: () => T): T {
  const timerLabel = startTimer(label);
  try {
    return fn();
  } finally {
    endTimer(timerLabel);
  }
}
