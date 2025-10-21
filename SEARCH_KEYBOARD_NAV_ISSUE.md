# Search Component Keyboard Navigation Issue

## Problem
Arrow key navigation in the Search component dropdown is not working. When search results are displayed and the user presses arrow keys, nothing happens.

## Expected Behavior
1. User types in search box → results dropdown appears
2. User presses **Arrow Down** → first result should be highlighted
3. User presses **Arrow Down** again → next result should be highlighted
4. User presses **Arrow Up** → previous result should be highlighted
5. User presses **Enter** → navigate to highlighted result
6. User presses **Escape** → close dropdown

## Current Behavior
- Search results appear correctly
- Arrow keys do nothing (no highlighting)
- Enter and Escape work as expected
- Focus remains in the input field

## Code Location
`src/lib/components/Search.svelte` - lines 71-107

## Potential Issues

### 1. **Reactive State Timing**
The handler calculates `totalResults` synchronously:
```typescript
const totalResults = todoResults.length + postResults.length;
```

If `todoResults` and `postResults` are not yet populated when the handler runs, `totalResults` will be 0 and navigation will be blocked.

### 2. **Event Handler Not Triggering**
The `onkeydown={handleKeyDown}` is attached to the input, but:
- The event might be consumed by the DaisyUI input component before reaching our handler
- The label wrapper might interfere with event bubbling

### 3. **State Update Not Triggering Re-render**
When `selectedIndex` changes:
```typescript
selectedIndex = selectedIndex < totalResults - 1 ? selectedIndex + 1 : 0;
```

The `class:active={selectedIndex === index}` binding might not be updating correctly.

### 4. **Derived State Issue**
The `allResults` derived state might not be recalculating when needed:
```typescript
let allResults = $derived([
    ...todoResults.map(todo => ({ type: 'todo' as const, data: todo, url: '/' })),
    ...postResults.map(post => ({ type: 'post' as const, data: post, url: `/blog/${post.id}` }))
]);
```

## Debug Steps Taken
1. ✅ Added `event.preventDefault()` at the top of the handler
2. ✅ Added console.log statements (but removed for clarity)
3. ❌ Keyboard navigation still not working

## Possible Solutions to Try

### Option 1: Use window-level key listener instead of input
```typescript
onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
});
```

### Option 2: Simplify to non-derived state
Instead of `$derived`, manually update `allResults` when search completes:
```typescript
let allResults = $state([]);

// In performSearch after getting results:
allResults = [
    ...todos.items.map(todo => ({ type: 'todo', data: todo, url: '/' })),
    ...posts.items.map(post => ({ type: 'post', data: post, url: `/blog/${post.id}` }))
];
```

### Option 3: Use native input with no wrapper
Remove the DaisyUI label wrapper and use a plain input with custom styling.

### Option 4: Add explicit role and aria attributes
```svelte
<input
    role="combobox"
    aria-expanded={showResults}
    aria-controls="search-results"
    aria-activedescendant={selectedIndex >= 0 ? `result-${selectedIndex}` : undefined}
    ...
/>

<ul id="search-results" role="listbox">
    <li role="option" id="result-{index}" ...>
```

## Test Case
1. Open search
2. Type "test" (should return results)
3. Press Arrow Down key
4. Check console for logs
5. Check if `selectedIndex` changes (use Vue DevTools / Svelte DevTools)
6. Check if `.active` class is applied to any menu item

## Related Files
- `/src/lib/components/Search.svelte` - Main search component
- `/src/lib/components/ui/Header.svelte` - Where search is used
- `/src/lib/utils/debounce.ts` - Debounce utility used for search
