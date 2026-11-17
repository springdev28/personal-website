# Portrait source and refinement

- Input: owner-supplied `Untitled_Artwork 34.png` (provided November 17, 2026).
- Output: `bahar-three-quarter.png`, 1254 × 1254 RGBA, transparent.
- Method: built-in image generation tool, editing the supplied illustration.
- Preserved: three-quarter angle, head-only framing, face proportions, short dark hair, cyan/purple lighting.
- The earlier `portrait.png` is preserved in the project root.

## Final edit prompt

Use case: identity-preserve / style-transfer. EDIT TARGET: this exact attached three-quarter head portrait artwork, and no other character. Refine it for a bold punk-comic game-menu website inspired by Persona 5 graphic cutout art. Preserve this exact three-quarter angle facing RIGHT (both eyes visible, far eye smaller), exact facial proportions and recognizable likeness, gaze, understated expression, short black hair silhouette, little loose wavy strand at right, face/head-only framing with a small neck. No shoulders, no body. Keep the shape of her nose, eyes, brows, lips, jaw and hairline faithful to this image. Refine the artist's existing portrait, do not invent a prettier anime face. Convert the soft shading into deliberate angular flat-color shadow planes, crisp dark ink outlines around eyes/nose/lips, deep purple/near-black hair with carefully placed cyan and violet highlight shapes, natural muted peach skin. Strong graphic design detail, subtly rough ink edges and sparse halftone patches in shadows. The cyan light on the left cheek and purple light on the right cheek should become flat graphic color planes, with no glow. Keep it close to the supplied drawing, with much bolder ink and clearer cel-shaded structure. Remove the entire textured backdrop and replace it with actual transparency. Keep the entire hair and head silhouette in frame. No gradient, no background, no aura, no text, no logo, no signature, no white stroke outline.


## Graphic VFX outlines

`shape-vfx.json` contains 34 outlines traced from the existing PNG. `portrait.js` uses these as clips for brief, flat cyan/violet edge echoes and graphic cuts. The source image remains stationary and unchanged. Cursor-motion code, movement settings, underpainting, and the movement extraction utility have been removed.
