---
description: Apply the custom spotlight cursor effect (black circle revealing white text) to any heading or text element.
---

To apply the spotlight cursor effect to a new element (like an `h1`, `h2`, etc.), follow these steps:

1.  **Identify the Container**: exact wrapper for the text you want to spotlight.
2.  **Add `spotlight-group` Class**: Add the class `spotlight-group` to this container. This creates the relative context for the effect.
3.  **Wrap the Text**: Wrap the actual text content inside a `<span>` with the class `spotlight-text`. This handles the hover detection.
4.  **Create the Overlay**:
    *   Duplicate the entire text element (e.g., the `h1` link).
    *   Place this duplicate *inside* the `spotlight-group` container, right after the original element.
    *   Add the classes `spotlight-overlay` to this duplicate's container (if you wrap it) or directly to the element if strictly needed, but the recommended structure is a wrapper `div` with `spotlight-overlay`.
    *   Add `aria-hidden="true"` to the overlay to prevent screen readers from reading the text twice.

### Example Code Structure

**Before:**
```html
<div class="hero-content">
    <h1>Your Amazing Title</h1>
</div>
```

**After:**
```html
<div class="hero-content">
    <!-- 1. Container gets spotlight-group -->
    <div class="spotlight-group">
        <!-- 2. Original text wrapped in spotlight-text -->
        <h1><span class="spotlight-text">Your Amazing Title</span></h1>
        
        <!-- 3. Overlay div with duplicate content -->
        <div class="spotlight-overlay" aria-hidden="true">
            <h1>Your Amazing Title</h1>
        </div>
    </div>
</div>
```

### Notes
*   The `script.js` automatically finds all elements with `.spotlight-group` and initializes the mouse tracking.
*   The `style.css` handles the white text color automatically for anything inside `.spotlight-overlay`.
