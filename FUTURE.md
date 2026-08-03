# @lpm.dev/neo.colors - Future Enhancements

## Potential Features & Improvements

### 1. Template Literal Support
**Status**: Not implemented
**Priority**: Medium
**Effort**: Low

Add tagged template literal support like chalk:
```typescript
import colors from '@lpm.dev/neo.colors'

console.log(colors`{red Error:} Something went wrong`)
console.log(colors`{green.bold Success!} Build completed`)
```

**Benefits**:
- More convenient syntax
- Better readability for complex strings
- Closer parity with chalk

**Considerations**:
- Adds ~50 LOC
- Slightly increases bundle size
- Need to parse template strings

---

### 2. Gradient Support
**Status**: Not implemented
**Priority**: Low
**Effort**: Medium

Add gradient text coloring:
```typescript
colors.gradient('Hello World', '#ff0000', '#0000ff')
// → Each character transitions from red to blue

colors.gradient.rainbow('Hello World')
// → Rainbow gradient
```

**Benefits**:
- Eye-catching terminal output
- Useful for headers/banners
- Differentiator from chalk

**Considerations**:
- Adds ~100-150 LOC
- Requires color interpolation
- May not work well on all terminals

---

### 3. Color Themes/Presets
**Status**: Not implemented
**Priority**: Medium
**Effort**: Low

Pre-defined color schemes:
```typescript
import { themes } from '@lpm.dev/neo.colors'

const colors = themes.dracula
console.log(colors.primary('Text'))   // Dracula purple
console.log(colors.success('Text'))   // Dracula green

// Custom themes
const myTheme = createTheme({
  primary: '#ff6b6b',
  success: '#51cf66',
  warning: '#ffd43b',
  error: '#ff6b6b',
})
```

**Benefits**:
- Consistent color schemes
- Easy branding
- Semantic color names

**Considerations**:
- Adds ~100 LOC
- Need to define good default themes
- Bundle size impact

---

### 4. Browser Support
**Status**: Not implemented
**Priority**: Low
**Effort**: High

Make it work in browser environments:
```typescript
// Automatically detect environment
import colors from '@lpm.dev/neo.colors'

// In Node: uses ANSI codes
// In browser: uses CSS styles via console.log
console.log(colors.red('Error!'))
```

**Benefits**:
- Universal package
- Works in browser devtools
- Useful for isomorphic apps

**Considerations**:
- Significant complexity (~200-300 LOC)
- Different API for browser vs Node
- Larger bundle size
- May be better as separate package

---

### 5. Performance Optimizations
**Status**: Core optimizations implemented
**Priority**: Complete
**Effort**: Completed

Implemented:
- Cached static style branches and normalized dynamic colors
- Precomputed open/close sequences for chainable styles
- Replaced lazy getters with direct cached properties after first access
- Split named exports from the chainable default for real tree-shaking
- Added performance and bundle-size regression checks

**Benefits**:
- Hot paths now benchmark in the same performance class as Chalk
- Named `red` bundles 68% smaller than the chainable default before gzip

**Considerations**:
- Re-run benchmarks when Node.js, Vitest, or Chalk versions change
- Keep equivalent forced color levels in every comparison

---

### 6. Advanced Color Manipulation
**Status**: Not implemented
**Priority**: Low
**Effort**: Medium

Color utilities:
```typescript
colors.lighten('#ff0000', 0.2)  // Lighter red
colors.darken('#ff0000', 0.2)   // Darker red
colors.saturate('#ff0000', 0.3) // More saturated
colors.desaturate('#ff0000', 0.3) // Less saturated
colors.mix('#ff0000', '#0000ff', 0.5) // Mix colors
```

**Benefits**:
- Programmatic color generation
- Dynamic theming
- Useful for CLI tools

**Considerations**:
- Requires color space math (~150 LOC)
- Bundle size increase
- Scope creep (becomes color library not terminal colors)

---

### 7. Hyperlink Support
**Status**: Not implemented
**Priority**: Low
**Effort**: Low

Clickable terminal links:
```typescript
colors.link('Click here', 'https://example.com')
// → Text that's clickable in supported terminals
```

**Benefits**:
- Modern terminal feature
- Better UX for CLI tools

**Considerations**:
- Only works in modern terminals (iTerm2, Hyper, etc.)
- Limited browser support
- ~20 LOC addition

---

### 8. Style Composition Helpers
**Status**: Not implemented
**Priority**: Low
**Effort**: Low

Reusable style combinations:
```typescript
const errorStyle = colors.compose(colors.red, colors.bold)
const successStyle = colors.compose(colors.green, colors.bold)

console.log(errorStyle('Error!'))
console.log(successStyle('Success!'))
```

**Benefits**:
- Reusable styles
- Cleaner code
- Type-safe compositions

**Considerations**:
- Can be done with current API
- ~30 LOC addition
- Marginal benefit

---

### 9. Logging Helpers
**Status**: Not implemented
**Priority**: Low
**Effort**: Low

Pre-styled log functions:
```typescript
colors.error('Something went wrong')   // Red with ✖ symbol
colors.success('Build complete')       // Green with ✓ symbol
colors.warning('Deprecated API')       // Yellow with ⚠ symbol
colors.info('Server started')          // Blue with ℹ symbol
```

**Benefits**:
- Convenient helpers
- Consistent logging

**Considerations**:
- Overlaps with logging libraries
- Not core functionality
- ~50 LOC
- Better suited for separate package or lumen integration

---

### 10. Color Blindness Support
**Status**: Not implemented
**Priority**: Low
**Effort**: Medium

Accessibility features:
```typescript
const colors = createColors({
  colorBlindMode: 'deuteranopia'
})
// Automatically adjusts colors for color blindness
```

**Benefits**:
- Accessibility
- Inclusive design

**Considerations**:
- Complex color adjustments
- ~100-150 LOC
- Limited use case
- Better as opt-in feature

---

## Recommended Priority Order

### High Priority (Consider for v0.2.0)
None currently - package is feature-complete for v1.0

### Medium Priority (Consider for v1.x)
1. **Template Literal Support** - Most requested chalk feature
2. **Color Themes/Presets** - High value, low complexity

### Low Priority (Consider if requested)
3. Gradient Support
4. Hyperlink Support
5. Style Composition Helpers

### Not Recommended
- Browser Support (better as separate package)
- Advanced Color Manipulation (scope creep)
- Logging Helpers (overlaps with lumen)
- Color Blindness Support (niche use case)

---

## Community Feedback

Track feature requests and feedback:
- GitHub Issues: Feature requests from users
- npm trends: Compare with chalk feature usage
- Survey: Poll users on most wanted features

---

## Breaking Changes for v2.0

If we ever need breaking changes:
- Drop Node 18 support, require Node 20+
- Remove deprecated APIs
- Optimize API surface area
- Consider merging with lumen for unified logging

---

**Last Updated**: 2026-08-03
**Package Version**: 1.0.0
