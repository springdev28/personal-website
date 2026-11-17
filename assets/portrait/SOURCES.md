# Portrait source and refinement

- Input: owner-supplied `Untitled_Artwork 34.png` (provided November 17, 2026).
- First graphic version: `bahar-three-quarter.png`, 1254 × 1254 RGBA, transparent.
- Active output: `bahar-three-quarter-clean.png`, 1254 × 1254 RGBA, transparent.
- Method: built-in image generation tool, editing the supplied illustration.
- Preserved: three-quarter angle, head-only framing, face proportions, short dark hair, cyan/purple lighting.
- The earlier `portrait.png` is preserved in the project root.

## Final edit prompt

Use case: identity-preserve / style-transfer. EDIT TARGET: this exact attached three-quarter head portrait artwork, and no other character. Refine it for a bold punk-comic game-menu website inspired by Persona 5 graphic cutout art. Preserve this exact three-quarter angle facing RIGHT (both eyes visible, far eye smaller), exact facial proportions and recognizable likeness, gaze, understated expression, short black hair silhouette, little loose wavy strand at right, face/head-only framing with a small neck. No shoulders, no body. Keep the shape of her nose, eyes, brows, lips, jaw and hairline faithful to this image. Refine the artist's existing portrait, do not invent a prettier anime face. Convert the soft shading into deliberate angular flat-color shadow planes, crisp dark ink outlines around eyes/nose/lips, deep purple/near-black hair with carefully placed cyan and violet highlight shapes, natural muted peach skin. Strong graphic design detail, subtly rough ink edges and sparse halftone patches in shadows. The cyan light on the left cheek and purple light on the right cheek should become flat graphic color planes, with no glow. Keep it close to the supplied drawing, with much bolder ink and clearer cel-shaded structure. Remove the entire textured backdrop and replace it with actual transparency. Keep the entire hair and head silhouette in frame. No gradient, no background, no aura, no text, no logo, no signature, no white stroke outline.


## Sideburn removal — 2026-11-17

Active file: `bahar-three-quarter-clean.png`. Mode: built-in image editing with transparent output. The black triangular wedge between the visible ear and cyan cheek is removed. The upper bangs and the existing ear drawing remain. The previous refined PNG is retained, and the revised VFX skin contours follow the new boundary.

Final edit prompt:

```text
Use case: precise-object-edit. Edit the supplied portrait with one VERY LOCAL correction. The remaining SIDEBURN is the small BLACK DOWNWARD-POINTING TRIANGULAR WEDGE immediately IN FRONT OF the visible ear (on the viewer's left), between the ear's right rim and the cyan cheek plane. It is NOT the ear's dark internal linework and NOT the upper bangs. Its approximate footprint in this 1254x1254 image has corners (396,621), (451,629), (429,698). REMOVE THIS ENTIRE BLACK TRIANGULAR WEDGE down to its bottom tip. Continue the surrounding peach temple skin smoothly into the skin beside the ear so there is no black pointed hair projecting down between the ear and cyan cheek. Preserve the cyan cheek plane and its halftone dots. Keep the entire existing ear outline, its inner black/purple contours, size and position unchanged. The large swept UPPER BANGS and the peach skin openings through them must stay exactly as shown, including the long diagonal fringe above the ear. Hair may remain behind the ear; no sideburn is to remain in front of it. This is removal of that little wedge, not another redesign of the ear. Keep every other feature unchanged: eyebrow shape, facial likeness, eyes, nose, mouth, expression, hair silhouette, cyan/violet hair streaks, color planes, textures, halftone patterns, framing, scale and layout. Maintain a genuinely transparent background, original 1254x1254 square canvas, no text and no annotation.
```

## Graphic VFX outlines

`shape-vfx.json` contains 35 outlines aligned to the active PNG. The 8 skin contours were retraced after the hair-gap, eyebrow, and sideburn cleanup; the remaining colored-shape contours retain their existing positions. `portrait.js` uses these as clips for brief, flat cyan/violet edge echoes and graphic cuts. The source image remains stationary and unchanged. Cursor-motion code, movement settings, underpainting, and the movement extraction utility have been removed.

## Hair and eyebrow contour cleanup — 2026-11-17

Edited with the built-in image generation/editing tool, using the first graphic version as the edit target and the owner's two detail screenshots as references. The exposed skin openings remain visible; their jagged boundaries are smoothed. The eyebrow outlines are cleaned while retaining their original angle, arch, and thickness. The earlier artwork is retained for reference. The revised PNG is copied directly from the tool output, preserving its transparency.

Successful edit prompt:

```text
Use case: precise-object-edit. Image 1 is the ORIGINAL edit target; images 2 and 3 are original detail crops marking the defects. Preserve this exact portrait and make only tiny contour corrections. HAIR CORRECTION: the peach-colored slivers visible THROUGH the dark bangs are exposed SKIN and MUST REMAIN clearly visible, with essentially the same location, size, peach color, and diagonal orientation. In the larger sliver shown in image 2 (around x420–580,y395–545 in the original), correct only the jagged lower boundary: replace the little upward-pointing black sawtooth hair spikes intruding into that skin opening with a clean continuous flowing hair contour. Keep a narrow, naturally tapered peach skin opening between the layered locks. Apply the same gentle contour cleanup to the other small skin openings along the fringe. Do not fill, delete, cover, shorten away, or erase these skin openings. Hair should look naturally side-swept and falling downward, with no awkward upward-pointing teeth. EYEBROW CORRECTION: the problem in image 3 is the small random WOBBLES along the ink outline. Clean these irregular edges into controlled smooth/straight line segments, while retaining the ORIGINAL eyebrows' gentle arch, original slope, length, thickness, tapered ends, placement, and expression. Keep the existing brow shape; merely de-wobble the outline. Absolutely no thick horizontal rectangular eyebrows, no flat bars, no change to the eyebrow angle or elevation. All other pixels should remain as close as possible to Image 1: same face identity, eyes, gaze, nose, lips, jaw, head shape, hair silhouette, cyan and purple graphic highlights, color-plane shapes and halftone patches. Keep the original square 1254x1254 composition with full head and small neck, no shoulders. Preserve actual transparency. No new style, lighting, shine, texture, background, text, or added elements.
```

## Ear correction — 2026-11-17

A second focused edit uses the cleaned portrait and the owner's red-circle annotation. The short lock and spikes intruding into the visible ear are removed; the upper bangs, exposed skin openings, and cleaned eyebrow outlines remain. The final tool output is used directly as `bahar-three-quarter-refined.png`. Mode: built-in image editing, transparent output.

Final edit prompt:

```text
Use case: precise-object-edit. Use the latest UNMARKED portrait as the edit target. The matching portrait with a red circle is only a location guide. Make one local correction at the visible ear on the left side of the picture. Remove the small pointed black lock/sideburn that overlaps the top and inner edge of that ear and makes hair look as though it is growing out of the ear (approximately x350–445,y635–735 on the 1254px image). Restore a clean, anatomically readable ear rim and the small adjacent skin area using the existing peach skin and dark-plum ink style, with the surrounding hair sitting naturally behind the ear. The red circle is NOT a region to erase wholesale; change only the offending little lock and spikes touching/intruding into the ear. Preserve the ear size and position. Keep all of the long UPPER BANGS exactly as they are, including the diagonal fringe above the ear and the visible peach skin openings through those bangs. Preserve the newly smoothed eyebrows exactly. Keep the eyes, face proportions, expression, color planes, nose, lips, cheek cyan, halftones, all other hair, outer silhouette, and all cyan/purple hair highlights unchanged. No extra hair strands, no new hairstyle, no enlarged skin patch, no new lighting or texture. Remove all red annotation marks from the output. Maintain the same 1254x1254 square framing and genuine transparent background.
```
