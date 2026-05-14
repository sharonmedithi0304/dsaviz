import type { TopicMeta, TopicId } from '../types';

export const TOPICS: TopicMeta[] = [
  { id: 'bubble-sort', label: 'Bubble Sort', category: 'Sorting', complexity: { time: 'O(n²)', space: 'O(1)' }, description: 'Compare adjacent pairs, bubble largest to end each pass.' },
  { id: 'selection-sort', label: 'Selection Sort', category: 'Sorting', complexity: { time: 'O(n²)', space: 'O(1)' }, description: 'Find minimum each pass, place at front of unsorted region.' },
  { id: 'insertion-sort', label: 'Insertion Sort', category: 'Sorting', complexity: { time: 'O(n²)', space: 'O(1)' }, description: 'Insert each element into correct position in sorted left half.' },
  { id: 'merge-sort', label: 'Merge Sort', category: 'Sorting', complexity: { time: 'O(n log n)', space: 'O(n)' }, description: 'Divide into halves, sort recursively, merge back sorted.' },
  { id: 'quick-sort', label: 'Quick Sort', category: 'Sorting', complexity: { time: 'O(n log n)', space: 'O(log n)' }, description: 'Pivot-based partitioning, recursively sort both sides.' },
  { id: 'linear-search', label: 'Linear Search', category: 'Searching', complexity: { time: 'O(n)', space: 'O(1)' }, description: 'Scan every element left to right until target found.' },
  { id: 'binary-search', label: 'Binary Search', category: 'Searching', complexity: { time: 'O(log n)', space: 'O(1)' }, description: 'Eliminate half the search space each step on sorted array.' },
  { id: 'kmp', label: 'KMP Matching', category: 'Pattern Matching', complexity: { time: 'O(n+m)', space: 'O(m)' }, description: 'Use failure function to skip redundant comparisons on mismatch.' },
];

export const TOPIC_CATEGORIES = [...new Set(TOPICS.map(t => t.category))];

export const TOPIC_CODES: Partial<Record<TopicId, string>> = {
  'bubble-sort': `#include <iostream>
using namespace std;

void bubbleSort(int arr[], int n) {
    int i, j;
    for (i = 0; i < n - 1; i++) {
        for (j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // swap arr[j] and arr[j+1]
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(arr) / sizeof(arr[0]);
    bubbleSort(arr, n);
    cout << "Sorted array: ";
    for (int i = 0; i < n; i++)
        cout << arr[i] << " ";
    return 0;
}`,

  'selection-sort': `#include <iostream>
using namespace std;

void selectionSort(int arr[], int n) {
    int i, j, minIdx;
    for (i = 0; i < n - 1; i++) {
        minIdx = i;
        for (j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx])
                minIdx = j;
        }
        if (minIdx != i) {
            int temp = arr[minIdx];
            arr[minIdx] = arr[i];
            arr[i] = temp;
        }
    }
}

int main() {
    int arr[] = {64, 25, 12, 22, 11};
    int n = sizeof(arr) / sizeof(arr[0]);
    selectionSort(arr, n);
    cout << "Sorted array: ";
    for (int i = 0; i < n; i++)
        cout << arr[i] << " ";
    return 0;
}`,

  'insertion-sort': `#include <iostream>
using namespace std;

void insertionSort(int arr[], int n) {
    int i, key, j;
    for (i = 1; i < n; i++) {
        key = arr[i];
        j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}

int main() {
    int arr[] = {12, 11, 13, 5, 6};
    int n = sizeof(arr) / sizeof(arr[0]);
    insertionSort(arr, n);
    cout << "Sorted array: ";
    for (int i = 0; i < n; i++)
        cout << arr[i] << " ";
    return 0;
}`,

  'merge-sort': `#include <iostream>
using namespace std;

void merge(int arr[], int l, int m, int r) {
    int n1 = m - l + 1, n2 = r - m;
    int L[n1], R[n2];
    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}

void mergeSort(int arr[], int l, int r) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    merge(arr, l, m, r);
}

int main() {
    int arr[] = {38, 27, 43, 3, 9, 82, 10};
    int n = sizeof(arr) / sizeof(arr[0]);
    mergeSort(arr, 0, n - 1);
    return 0;
}`,

  'quick-sort': `#include <iostream>
using namespace std;

int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return i + 1;
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

int main() {
    int arr[] = {10, 7, 8, 9, 1, 5};
    int n = sizeof(arr) / sizeof(arr[0]);
    quickSort(arr, 0, n - 1);
    return 0;
}`,

  'linear-search': `#include <iostream>
using namespace std;

int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target)
            return i;
    }
    return -1;
}

int main() {
    int arr[] = {2, 3, 4, 10, 40};
    int n = sizeof(arr) / sizeof(arr[0]);
    int target = 10;
    int result = linearSearch(arr, n, target);
    if (result != -1)
        cout << "Found at index " << result;
    else
        cout << "Not found";
    return 0;
}`,

  'binary-search': `#include <iostream>
using namespace std;

int binarySearch(int arr[], int n, int target) {
    int left = 0, right = n - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target)
            return mid;
        else if (arr[mid] < target)
            left = mid + 1;
        else
            right = mid - 1;
    }
    return -1;
}

int main() {
    int arr[] = {2, 3, 4, 10, 40};
    int n = sizeof(arr) / sizeof(arr[0]);
    int target = 10;
    int result = binarySearch(arr, n, target);
    cout << "Element at index: " << result;
    return 0;
}`,

  'kmp': `#include <iostream>
#include <vector>
using namespace std;

vector<int> computeLPS(string pattern) {
    int m = pattern.length();
    vector<int> lps(m, 0);
    int len = 0, i = 1;
    while (i < m) {
        if (pattern[i] == pattern[len])
            lps[i++] = ++len;
        else if (len != 0)
            len = lps[len - 1];
        else
            lps[i++] = 0;
    }
    return lps;
}

void KMPSearch(string text, string pattern) {
    int n = text.length(), m = pattern.length();
    vector<int> lps = computeLPS(pattern);
    int i = 0, j = 0;
    while (i < n) {
        if (text[i] == pattern[j]) { i++; j++; }
        if (j == m) {
            cout << "Pattern at index " << i - j;
            j = lps[j - 1];
        } else if (i < n && pattern[j] != text[i]) {
            if (j != 0) j = lps[j - 1];
            else i++;
        }
    }
}

int main() {
    KMPSearch("ABABCABAB", "ABAB");
    return 0;
}`,
};
