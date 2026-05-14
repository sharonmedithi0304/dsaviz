import type { Step, TopicId, ArrayVisualState } from '../types';

function makeState(
  values: number[],
  highlight: number[] = [],
  sorted: number[] = [],
  compare: number[] = [],
  swap: number[] = [],
  pivot: number | null = null,
  pointers?: { label: string; index: number; color: string }[]
): ArrayVisualState {
  return { values: [...values], highlightIndices: highlight, sortedIndices: sorted, compareIndices: compare, swapIndices: swap, pivotIndex: pivot, pointers };
}

function step(
  lineNumber: number,
  purposeText: string,
  state: ArrayVisualState | null,
  animationType: Step['animationType'] = 'idle',
  complexity?: { time: string; space: string }
): Step {
  return { lineNumber, purposeText, visualState: state, animationType, complexity };
}

// ─── BUBBLE SORT ────────────────────────────────────────────────────────────

export function bubbleSortSteps(arr: number[]): Step[] {
  const steps: Step[] = [];
  const a = [...arr];
  const n = a.length;
  const sorted: number[] = [];

  steps.push(step(1, '#include <iostream> — Imports the standard I/O library so we can use cout to print output. Without this line, the compiler would not recognize cout and the program would fail to compile.', makeState(a), 'idle'));
  steps.push(step(2, 'using namespace std; — Allows us to write cout instead of std::cout. This is a convenience shortcut that avoids typing the namespace prefix every time we use standard library features.', makeState(a), 'idle'));
  steps.push(step(3, 'void bubbleSort(int arr[], int n) — We declare the bubbleSort function. It receives the array and its size n. The word "void" means this function returns nothing — it sorts in place, modifying the original array.', makeState(a), 'idle', { time: 'O(n²)', space: 'O(1)' }));
  steps.push(step(4, 'int i, j; — We declare loop counter variables. i tracks the outer pass (how many passes we\'ve done), and j tracks the inner comparison pointer that walks through the unsorted portion.', makeState(a), 'idle'));
  steps.push(step(5, 'for (int i = 0; i < n-1; i++) — The outer loop runs n-1 times. After each pass, the largest unsorted element "bubbles up" to its final position. We need at most n-1 passes to fully sort n elements.', makeState(a), 'idle'));

  for (let i = 0; i < n - 1; i++) {
    steps.push(step(5, `Outer loop pass ${i + 1} of ${n - 1}. After this pass, the ${i + 1} largest element(s) will be in their final sorted positions at the right end of the array. The sorted region grows by one each pass.`,
      makeState(a, [i], [...sorted]), 'traverse', { time: 'O(n²)', space: 'O(1)' }));

    steps.push(step(6, `for (int j = 0; j < n-i-1; j++) — The inner loop only walks through the UNSORTED portion (indices 0 to ${n - i - 2}). We skip the already-sorted right side. This avoids unnecessary comparisons.`,
      makeState(a, [], [...sorted]), 'idle'));

    for (let j = 0; j < n - i - 1; j++) {
      steps.push(step(7, `Comparing arr[${j}]=${a[j]} and arr[${j + 1}]=${a[j + 1]}. We check if the LEFT element is greater than the RIGHT element. If so, they are in the wrong order and must be swapped. This is the core of bubble sort.`,
        makeState(a, [], [...sorted], [j, j + 1]), 'compare'));

      steps.push(step(8, `if (arr[j] > arr[j+1]) — ${a[j]} ${a[j] > a[j + 1] ? '>' : '≤'} ${a[j + 1]} — ${a[j] > a[j + 1] ? 'YES! The left element is larger. A swap is needed to move the bigger value to the right.' : 'No swap needed. The elements are already in correct relative order. We move on.'}`,
        makeState(a, [], [...sorted], [j, j + 1]), 'compare'));

      if (a[j] > a[j + 1]) {
        steps.push(step(9, `Swapping arr[${j}]=${a[j]} with arr[${j + 1}]=${a[j + 1]}. We use a classic three-step swap: save one value in temp, overwrite it, then restore from temp. After this, the larger value has moved one position to the right.`,
          makeState(a, [], [...sorted], [], [j, j + 1]), 'swap'));
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        steps.push(step(9, `Swap complete! arr[${j}] is now ${a[j]} and arr[${j + 1}] is now ${a[j + 1]}. The larger value has moved right, one step closer to its final sorted position.`,
          makeState(a, [], [...sorted], [], [j, j + 1]), 'swap'));
      }
    }

    sorted.unshift(n - 1 - i);
    steps.push(step(5, `Pass ${i + 1} complete. Element ${a[n - 1 - i]} has bubbled up to its correct final position at index ${n - 1 - i}. The green region at the right is now fully sorted and will never be touched again.`,
      makeState(a, [], [...sorted]), 'sorted'));
  }

  sorted.unshift(0);
  steps.push(step(10, 'Sorting complete! All n-1 passes are done. The array is now fully sorted in ascending order. Every element has found its correct position. Time complexity: O(n²) — we compared roughly n²/2 pairs total.',
    makeState(a, [], Array.from({ length: n }, (_, i) => i)), 'sorted', { time: 'O(n²)', space: 'O(1)' }));

  return steps;
}

// ─── SELECTION SORT ─────────────────────────────────────────────────────────

export function selectionSortSteps(arr: number[]): Step[] {
  const steps: Step[] = [];
  const a = [...arr];
  const n = a.length;

  steps.push(step(1, 'void selectionSort(int arr[], int n) — Selection sort works by repeatedly finding the MINIMUM element from the unsorted part and moving it to the front. Unlike bubble sort, it makes at most n-1 swaps total — ideal when writes are expensive.', makeState(a), 'idle', { time: 'O(n²)', space: 'O(1)' }));

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    steps.push(step(3, `Outer loop: i=${i}. We assume arr[${i}]=${a[i]} is the minimum so far. We\'ll scan everything from index ${i + 1} to ${n - 1} to see if anything is smaller. The sorted portion is indices 0 to ${i - 1}.`,
      makeState(a, [i], Array.from({ length: i }, (_, k) => k)), 'traverse'));

    steps.push(step(4, `int minIdx = ${i}. We record index ${i} as our current "minimum found" position. If we find anything smaller during the scan, we\'ll update this index.`,
      makeState(a, [minIdx], Array.from({ length: i }, (_, k) => k)), 'pointer'));

    for (let j = i + 1; j < n; j++) {
      steps.push(step(5, `Comparing arr[${j}]=${a[j]} with current minimum arr[${minIdx}]=${a[minIdx]}. Is ${a[j]} < ${a[minIdx]}? ${a[j] < a[minIdx] ? 'YES! Found a new minimum!' : 'No. Current minimum remains unchanged.'}`,
        makeState(a, [minIdx, j], Array.from({ length: i }, (_, k) => k), [j, minIdx]), 'compare'));

      if (a[j] < a[minIdx]) {
        minIdx = j;
        steps.push(step(6, `New minimum found at index ${j} with value ${a[minIdx]}! We update minIdx = ${j}. This is now the smallest element we\'ve seen in the unsorted portion so far.`,
          makeState(a, [minIdx], Array.from({ length: i }, (_, k) => k)), 'highlight'));
      }
    }

    if (minIdx !== i) {
      steps.push(step(7, `Scan complete. Minimum is ${a[minIdx]} at index ${minIdx}. Swapping with arr[${i}]=${a[i]} to place the minimum at the start of the unsorted region.`,
        makeState(a, [], Array.from({ length: i }, (_, k) => k), [], [i, minIdx]), 'swap'));
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
    } else {
      steps.push(step(7, `The minimum ${a[i]} is already at index ${i} — no swap needed! The element is already in its correct position.`,
        makeState(a, [i], Array.from({ length: i }, (_, k) => k)), 'idle'));
    }

    steps.push(step(3, `arr[${i}]=${a[i]} is now permanently placed. The sorted region (green) grows to include index ${i}. We never touch these elements again.`,
      makeState(a, [], Array.from({ length: i + 1 }, (_, k) => k)), 'sorted'));
  }

  steps.push(step(8, 'Selection sort complete! Each element was selected and placed exactly once. Total swaps: at most n-1. This makes it useful when swap cost is high, despite its O(n²) comparison count.',
    makeState(a, [], Array.from({ length: n }, (_, i) => i)), 'sorted', { time: 'O(n²)', space: 'O(1)' }));

  return steps;
}

// ─── INSERTION SORT ─────────────────────────────────────────────────────────

export function insertionSortSteps(arr: number[]): Step[] {
  const steps: Step[] = [];
  const a = [...arr];
  const n = a.length;

  steps.push(step(1, 'void insertionSort(int arr[], int n) — Insertion sort builds the sorted array one element at a time. Think of sorting playing cards: you pick up one card and insert it in the right place among the already-sorted cards in your hand.', makeState(a), 'idle', { time: 'O(n²)', space: 'O(1)' }));
  steps.push(step(2, 'The first element arr[0] is trivially sorted. We start from index 1 — each element is picked up and inserted into its correct position among the elements to its left.', makeState(a, [0], [0]), 'sorted'));

  for (let i = 1; i < n; i++) {
    const key = a[i];
    steps.push(step(3, `Picking up arr[${i}]=${key} as our "key". This is the card we\'re about to insert into the sorted left portion (indices 0 to ${i - 1}). We save it as key=${key} so we don\'t lose it during shifting.`,
      makeState(a, [i], Array.from({ length: i }, (_, k) => k)), 'traverse'));

    let j = i - 1;
    steps.push(step(4, `Starting inner comparison from j=${j}. We\'ll scan left through the sorted portion, shifting elements right to make room for key=${key}.`,
      makeState(a, [i, j], Array.from({ length: i }, (_, k) => k)), 'pointer'));

    let shifted = false;
    while (j >= 0 && a[j] > key) {
      shifted = true;
      steps.push(step(5, `arr[${j}]=${a[j]} > key=${key}. Shift arr[${j}] one position RIGHT to arr[${j + 1}]. We\'re making space for the key to slide into its correct sorted position.`,
        makeState(a, [j, j + 1], Array.from({ length: i }, (_, k) => k), [j]), 'compare'));
      a[j + 1] = a[j];
      a[j] = key; // visually show key at current gap
      steps.push(step(5, `Shifted! arr[${j + 1}]=${a[j + 1]}. The key value ${key} conceptually sits at index ${j} now, ready to move further left if needed.`,
        makeState(a, [j], Array.from({ length: i }, (_, k) => k)), 'pointer'));
      j--;
    }

    a[j + 1] = key;
    steps.push(step(6, `${shifted ? `Found the right position at index ${j + 1}.` : `arr[${j}]=${a[j]} ≤ key=${key}, so no shifting needed.`} Inserting key=${key} at index ${j + 1}. It is now in its correct sorted position.`,
      makeState(a, [j + 1], Array.from({ length: i + 1 }, (_, k) => k)), 'sorted'));
  }

  steps.push(step(7, 'Insertion sort complete! Excellent for nearly-sorted data (O(n) best case) and small arrays. Each element was inserted exactly once into the growing sorted left portion.',
    makeState(a, [], Array.from({ length: n }, (_, i) => i)), 'sorted', { time: 'O(n²)', space: 'O(1)' }));

  return steps;
}

// ─── MERGE SORT ─────────────────────────────────────────────────────────────

export function mergeSortSteps(arr: number[]): Step[] {
  const steps: Step[] = [];
  const a = [...arr];
  const n = a.length;

  steps.push(step(1, 'void mergeSort(int arr[], int l, int r) — Merge Sort uses the divide-and-conquer strategy. It splits the array in half recursively until single elements remain, then merges them back in sorted order. Guaranteed O(n log n) always.', makeState(a), 'idle', { time: 'O(n log n)', space: 'O(n)' }));

  function mergeSteps(arr: number[], l: number, r: number): void {
    if (l >= r) return;

    const m = Math.floor((l + r) / 2);
    steps.push(step(3, `Dividing array[${l}..${r}] at midpoint ${m}. Left half: indices ${l}..${m}, Right half: indices ${m + 1}..${r}. We recursively sort both halves before merging them.`,
      makeState(a, [], [], Array.from({ length: r - l + 1 }, (_, k) => l + k)), 'traverse'));

    mergeSteps(arr, l, m);
    mergeSteps(arr, m + 1, r);

    // Merge
    const left = arr.slice(l, m + 1);
    const right = arr.slice(m + 1, r + 1);
    steps.push(step(7, `Merging subarrays: [${left.join(',')}] and [${right.join(',')}]. Both halves are sorted. We compare their front elements repeatedly and pick the smaller one — like merging two sorted card piles.`,
      makeState(a, Array.from({ length: r - l + 1 }, (_, k) => l + k), []), 'merge'));

    let i = 0, j = 0, k = l;
    while (i < left.length && j < right.length) {
      steps.push(step(9, `Comparing left[${i}]=${left[i]} vs right[${j}]=${right[j]}. ${left[i] <= right[j] ? `${left[i]} is smaller — pick from left half.` : `${right[j]} is smaller — pick from right half.`}`,
        makeState(a, [l + i, m + 1 + j], [], [k]), 'compare'));
      if (left[i] <= right[j]) { arr[k++] = left[i++]; }
      else { arr[k++] = right[j++]; }
      steps.push(step(10, `Placed ${arr[k - 1]} at index ${k - 1}. The merged portion grows. We advance the pointer of whichever half we picked from.`,
        makeState([...arr], [], Array.from({ length: k - l }, (_, idx) => l + idx)), 'sorted'));
    }
    while (i < left.length) { arr[k++] = left[i++]; }
    while (j < right.length) { arr[k++] = right[j++]; }
    for (let x = l; x <= r; x++) a[x] = arr[x];

    steps.push(step(11, `Merge complete for range [${l}..${r}]: [${a.slice(l, r + 1).join(', ')}]. This subarray is now fully sorted. It will be used as a sorted half in the next merge up the recursion chain.`,
      makeState(a, [], Array.from({ length: r - l + 1 }, (_, k) => l + k)), 'sorted'));
  }

  mergeSteps(a, 0, n - 1);

  steps.push(step(12, 'Merge Sort complete! The divide-and-conquer approach guaranteed O(n log n) in all cases. The array is sorted. Merge Sort is stable and predictable — used in Java\'s Arrays.sort() for objects.',
    makeState(a, [], Array.from({ length: n }, (_, i) => i)), 'sorted', { time: 'O(n log n)', space: 'O(n)' }));

  return steps;
}

// ─── QUICK SORT ─────────────────────────────────────────────────────────────

export function quickSortSteps(arr: number[]): Step[] {
  const steps: Step[] = [];
  const a = [...arr];
  const n = a.length;

  steps.push(step(1, 'void quickSort(int arr[], int low, int high) — Quick Sort picks a pivot element and partitions the array so all elements smaller than pivot go left and all larger go right. Then it recursively sorts both sides. Average O(n log n).', makeState(a), 'idle', { time: 'O(n log n) avg', space: 'O(log n)' }));

  function partition(arr: number[], low: number, high: number): number {
    const pivotVal = arr[high];
    steps.push(step(3, `Partition called on arr[${low}..${high}]. Pivot = arr[${high}] = ${pivotVal} (last element). We\'ll rearrange so everything < ${pivotVal} is left of pivot, everything > ${pivotVal} is right.`,
      makeState(a, [], [], [], [], high), 'pivot'));

    let i = low - 1;
    steps.push(step(4, `int i = ${low - 1}. This is the "boundary pointer" — it tracks the rightmost position of elements smaller than pivot. Elements from low to i will be ≤ pivot after partitioning.`,
      makeState(a, [], [], [], [], high), 'pointer'));

    for (let j = low; j < high; j++) {
      steps.push(step(6, `Checking arr[${j}]=${arr[j]} against pivot ${pivotVal}. ${arr[j] <= pivotVal ? `${arr[j]} ≤ ${pivotVal} — it belongs in the LEFT partition. We\'ll expand the left region.` : `${arr[j]} > ${pivotVal} — it stays in RIGHT partition. No action.`}`,
        makeState(a, [j], [], [j, high], [], high), 'compare'));

      if (arr[j] <= pivotVal) {
        i++;
        if (i !== j) {
          steps.push(step(7, `Swapping arr[${i}]=${arr[i]} and arr[${j}]=${arr[j]}. This moves the small element (${arr[j]}) into the left partition and the larger element to the right. Left boundary i advances to ${i}.`,
            makeState(a, [], [], [], [i, j], high), 'swap'));
          [arr[i], arr[j]] = [arr[j], arr[i]];
          for (let x = 0; x < n; x++) a[x] = arr[x];
        }
      }
    }

    steps.push(step(9, `Place pivot at its FINAL position by swapping arr[${i + 1}]=${arr[i + 1]} with pivot arr[${high}]=${arr[high]}. After this, pivot ${pivotVal} is at index ${i + 1} — PERMANENTLY in sorted order!`,
      makeState(a, [], [i + 1], [], [i + 1, high], high), 'swap'));
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    for (let x = 0; x < n; x++) a[x] = arr[x];

    steps.push(step(9, `Pivot ${pivotVal} is now at index ${i + 1} — its final correct position. All elements to its left are ≤ ${pivotVal}, all to its right are > ${pivotVal}. This position is locked forever.`,
      makeState(a, [], [i + 1], [], [], i + 1), 'sorted'));

    return i + 1;
  }

  function quickSort(arr: number[], low: number, high: number): void {
    if (low < high) {
      const pi = partition(arr, low, high);
      quickSort(arr, low, pi - 1);
      quickSort(arr, pi + 1, high);
    }
  }

  quickSort(a, 0, n - 1);

  steps.push(step(10, 'Quick Sort complete! The pivot-based partitioning sorted the array in-place. In practice, Quick Sort outperforms Merge Sort due to better cache locality. Average O(n log n), worst case O(n²) with bad pivot choice.',
    makeState(a, [], Array.from({ length: n }, (_, i) => i)), 'sorted', { time: 'O(n log n) avg', space: 'O(log n)' }));

  return steps;
}

// ─── LINEAR SEARCH ──────────────────────────────────────────────────────────

export function linearSearchSteps(arr: number[]): Step[] {
  const steps: Step[] = [];
  const a = [...arr];
  const target = a[Math.floor(a.length / 2) + 1] ?? a[0];

  steps.push(step(1, `int linearSearch(int arr[], int n, int target) — Linear Search checks every element one by one from left to right. No sorting required. We\'re looking for target = ${target}.`, makeState(a), 'idle', { time: 'O(n)', space: 'O(1)' }));

  for (let i = 0; i < a.length; i++) {
    steps.push(step(4, `Checking arr[${i}] = ${a[i]}. Is it equal to target ${target}? ${a[i] === target ? 'YES! Found it!' : `No, ${a[i]} ≠ ${target}. Move to next element.`}`,
      makeState(a, [i], [], [i]), 'compare'));

    if (a[i] === target) {
      steps.push(step(5, `Target ${target} found at index ${i}! Returning ${i}. Linear search found the element after checking ${i + 1} element(s). Best case O(1) (first element), worst case O(n) (last or not found).`,
        makeState(a, [i], [i]), 'visited', { time: 'O(n)', space: 'O(1)' }));
      break;
    }
  }

  return steps;
}

// ─── BINARY SEARCH ──────────────────────────────────────────────────────────

export function binarySearchSteps(arr: number[]): Step[] {
  const steps: Step[] = [];
  const a = [...arr].sort((x, y) => x - y);
  const target = a[Math.floor(a.length / 2)];

  steps.push(step(1, `int binarySearch(int arr[], int n, int target) — Binary Search requires a SORTED array. It eliminates HALF the remaining elements each step. Target = ${target}. This gives O(log n) time — far faster than linear search.`, makeState(a), 'idle', { time: 'O(log n)', space: 'O(1)' }));
  steps.push(step(2, 'int left = 0, right = n-1; — We define the search range with two pointers. Left starts at 0 (array start) and right starts at n-1 (array end). The search happens only between these two boundaries.',
    makeState(a, [], [], [], [], null, [{ label: 'L', index: 0, color: '#3B82F6' }, { label: 'R', index: a.length - 1, color: '#EF4444' }]), 'pointer'));

  let left = 0, right = a.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    steps.push(step(4, `mid = (${left} + ${right}) / 2 = ${mid}. We examine the MIDDLE element arr[mid] = ${a[mid]}. By checking the middle, we can eliminate the entire left or right half with one comparison.`,
      makeState(a, [mid], [], [], [], null, [
        { label: 'L', index: left, color: '#3B82F6' },
        { label: 'M', index: mid, color: '#F59E0B' },
        { label: 'R', index: right, color: '#EF4444' }
      ]), 'compare'));

    if (a[mid] === target) {
      steps.push(step(5, `arr[${mid}] = ${a[mid]} = target ${target}. FOUND! Binary search located the target in O(log n) time. Each step halved the search space. If n = 1 million, this takes at most ~20 steps!`,
        makeState(a, [], [mid]), 'sorted', { time: 'O(log n)', space: 'O(1)' }));
      break;
    } else if (a[mid] < target) {
      steps.push(step(7, `${a[mid]} < ${target}. Target must be in the RIGHT half. Move left = mid+1 = ${mid + 1}. The entire left portion including arr[${mid}] is ELIMINATED — we never look there again.`,
        makeState(a, Array.from({ length: mid - left + 1 }, (_, k) => left + k), [], [], [], null, [
          { label: 'L', index: mid + 1, color: '#3B82F6' },
          { label: 'R', index: right, color: '#EF4444' }
        ]), 'traverse'));
      left = mid + 1;
    } else {
      steps.push(step(9, `${a[mid]} > ${target}. Target must be in the LEFT half. Move right = mid-1 = ${mid - 1}. The entire right portion is ELIMINATED. The search space just halved again.`,
        makeState(a, Array.from({ length: right - mid + 1 }, (_, k) => mid + k), [], [], [], null, [
          { label: 'L', index: left, color: '#3B82F6' },
          { label: 'R', index: mid - 1, color: '#EF4444' }
        ]), 'traverse'));
      right = mid - 1;
    }
  }

  return steps;
}

// ─── KMP PATTERN MATCHING ────────────────────────────────────────────────────

export function kmpSteps(_arr: number[]): Step[] {
  const text = 'ABABCABAB';
  const pattern = 'ABAB';
  const steps: Step[] = [];
  const n = text.length;
  const m = pattern.length;

  // Build failure function
  const lps = new Array(m).fill(0);
  let len = 0, i = 1;
  while (i < m) {
    if (pattern[i] === pattern[len]) { lps[len] = i; len++; i++; }
    else if (len > 0) { len = lps[len - 1]; }
    else { lps[i] = 0; i++; }
  }

  const textArr = text.split('').map((_, i) => i);
  steps.push(step(1, `KMP Pattern Matching — searching for pattern "${pattern}" in text "${text}". KMP avoids re-examining characters by using a failure function (LPS array) that tells us how far to shift the pattern on mismatch.`,
    makeState(textArr.map((_, i) => i), [], [], [], []), 'idle', { time: 'O(n+m)', space: 'O(m)' }));
  steps.push(step(2, `LPS (Longest Proper Prefix Suffix) array for "${pattern}": [${lps.join(', ')}]. This preprocessing step runs in O(m) and enables O(1) jumps on mismatch instead of backtracking to start.`,
    makeState(textArr.map((_, i) => i), [], [], []), 'pointer'));

  let j = 0;
  i = 0;
  while (i < n) {
    steps.push(step(6, `Comparing text[${i}]='${text[i]}' with pattern[${j}]='${pattern[j]}'. ${text[i] === pattern[j] ? 'MATCH! Both characters are the same. Advance both pointers.' : 'MISMATCH! Use LPS to skip redundant comparisons.'}`,
      makeState(textArr.map((_, k) => k), [i], [], [i, j + n]), 'compare'));

    if (text[i] === pattern[j]) {
      i++; j++;
      if (j === m) {
        steps.push(step(8, `Pattern "${pattern}" found at index ${i - j}! All ${m} characters matched. KMP never moved the text pointer backward — this is the key advantage over brute force.`,
          makeState(textArr.map((_, k) => k), [], Array.from({ length: m }, (_, k) => i - j + k)), 'sorted'));
        j = lps[j - 1];
      }
    } else {
      if (j !== 0) {
        steps.push(step(10, `Mismatch at pattern[${j}]. Using LPS: jump j back to ${lps[j - 1]} instead of 0. We already know the first ${lps[j - 1]} characters matched — no need to re-check them!`,
          makeState(textArr.map((_, k) => k), [i], [], []), 'pointer'));
        j = lps[j - 1];
      } else {
        i++;
      }
    }
  }

  return steps;
}

// ─── MAIN DISPATCH ───────────────────────────────────────────────────────────

export function generateSteps(topic: TopicId, arr: number[]): Step[] {
  const safeArr = arr.length > 0 ? arr : [64, 34, 25, 12, 22, 11, 90];
  switch (topic) {
    case 'bubble-sort': return bubbleSortSteps(safeArr);
    case 'selection-sort': return selectionSortSteps(safeArr);
    case 'insertion-sort': return insertionSortSteps(safeArr);
    case 'merge-sort': return mergeSortSteps(safeArr);
    case 'quick-sort': return quickSortSteps(safeArr);
    case 'linear-search': return linearSearchSteps(safeArr);
    case 'binary-search': return binarySearchSteps(safeArr);
    case 'kmp': return kmpSteps(safeArr);
    default: return bubbleSortSteps(safeArr);
  }
}
