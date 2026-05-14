export type AnimationType =
  | 'create' | 'delete' | 'traverse' | 'compare'
  | 'swap' | 'pointer' | 'push' | 'pop' | 'idle'
  | 'highlight' | 'sorted' | 'pivot' | 'merge' | 'visited';

export interface Step {
  lineNumber: number;
  purposeText: string;
  visualState: ArrayVisualState | null;
  animationType: AnimationType;
  highlightIndices?: number[];
  sortedIndices?: number[];
  pivotIndex?: number;
  compareIndices?: number[];
  swapIndices?: number[];
  complexity?: { time: string; space: string };
  extraLabel?: string;
}

export interface ArrayVisualState {
  values: number[];
  highlightIndices: number[];
  sortedIndices: number[];
  compareIndices: number[];
  swapIndices: number[];
  pivotIndex: number | null;
  pointers?: { label: string; index: number; color: string }[];
}

export type TopicId =
  | 'bubble-sort' | 'selection-sort' | 'insertion-sort'
  | 'merge-sort' | 'quick-sort'
  | 'linear-search' | 'binary-search'
  | 'linked-list-insert' | 'linked-list-delete' | 'linked-list-reverse'
  | 'stack-ops' | 'queue-ops'
  | 'bst-insert' | 'bst-search' | 'bst-traversal'
  | 'lcs' | 'knapsack' | 'fibonacci-dp'
  | 'kmp' | 'brute-force-pattern';

export type Language = 'cpp' | 'python' | 'java';

export interface TopicMeta {
  id: TopicId;
  label: string;
  category: string;
  complexity: { time: string; space: string };
  description: string;
}

export interface VisualizerState {
  topic: TopicId;
  language: Language;
  steps: Step[];
  currentStep: number;
  isPlaying: boolean;
  speed: number; // ms per step
  customInput: number[];
  showQuiz: boolean;
}
