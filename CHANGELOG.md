# Changelog

All notable changes to `volto-advanced-variations` will be documented in this file.

## [0.10.4] - 2026-10-29

### Campaign Redesign for Mosaic Listing
- **Headline & Typography:**
  - Aligned mosaic listing card titles to York College's bold brand typography (`Poppins` / `DM Sans`), uppercase styling, and crisp letter tracking.
  - Set all titles and descriptions to high-contrast pure white (`#ffffff`) on brand color backgrounds.
- **Campaign Pill Buttons:**
  - Replaced Semantic UI rectangular button overrides with sleek, rounded pill buttons (`border-radius: 9999px`) featuring directional arrow animation and hover lift.
- **Dynamic Geometric Shard Facets:**
  - Added dynamic angled linear gradients and shard facets (`::before` and `::after`) across card panels to match the York College promotional campaign artwork.
- **Date Validation:**
  - Added epoch date filter (`isValidDate`) to prevent invalid timestamps (e.g. "Dec 30, 1969") from displaying on cards without published dates.
- **Responsive Layout:**
  - Enhanced layout handling on mobile and tablet devices with stacked card flow.
- **Clean Card Presentation:**
  - Removed top-left corner brand badge and bottom campaign watermark to keep focus cleanly on card content and call-to-action buttons.

## [0.10.3] - 2026-10-29

### Carousel Controls & Layout Alignment
- **Full-Width Carousel Arrow Layout Alignment (`Advanced.css`):**
  - Updated navigation arrow positioning for full-width carousels outside rows (`.has--block-width--full`, `.has--stretch--stretch`, `.stretch`) to use `left: max(20px, calc((100% - var(--layout-container-width, 1440px)) / 2 + 20px))` and `right: max(20px, calc((100% - var(--layout-container-width, 1440px)) / 2 + 20px))`.
  - Rather than being pinned to the far outer edges of wide viewports (e.g. 1920px+), arrows now remain adjacent to the carousel cards and aligned with the page layout boundary.

## [0.10.2] - 2026-10-29

### Responsive & Layout Improvements
- **Mobile Responsiveness for Advanced Listing:** Made `AdvancedListingBlockTemplate` and `CommonItemRenderer` fully responsive on mobile viewports (`max-width: 767px`):
  - When `imageSide` is set to `left` or `right`, inner columns now stack vertically on mobile with the image repositioned to the top (`order: -1`) and full-width (`100%` / `twelve wide mobile`), with text content stacked neatly underneath.
  - On desktop and tablet viewports, maintains side-by-side layout with configured column widths (`imageWidth` and `12 - imageWidth`).
  - Added `.advanced-item-inner` container rules to eliminate negative margin horizontal overflow on mobile screens.

## [0.10.1] - 2026-10-29

### Bug Fixes & Improvements
- **Row & Column Containment for Carousel Controls:** Enforced relative positioning context on `.advancedView`, `.advancedSlider`, and `.slick-slider` when inside row columns (`.row-column`, `.block.row`, `.columns-view`), containing navigation arrows (`.slick-prev`, `.slick-next`) within the active column boundary instead of escaping to the outer row or viewport edges.
- **Unified Dots & Play/Pause Controls:** Integrated pagination dots and the play/pause button into a single `.slick-dots-container` rendered via `appendDots`, ensuring the pause button and slide dots are cleanly aligned and centered horizontally at the bottom of the carousel.
- **Standalone Viewport Positioning:** In full-width carousels outside rows, positioned arrows cleanly within the visible viewport bounds (`left: 20px; right: 20px;`) rather than overflowing negative offsets off-screen.

## [0.10.0] - 2026-10-24

### Bug Fixes & Compatibility
- **SSR & Observer Cleanup:** In `FadeInSection`, added defensive checks for `domRef.current` and `IntersectionObserver` availability during SSR, and properly invoke `observer.disconnect()` on unmount.
- **Dependencies:** Moved `react-slick` and `slick-carousel` directly into `dependencies` to ensure reliable resolution across pnpm workspaces.
- **Volto 19 Compatibility:** Updated `peerDependencies` to support `@plone/volto` 17, 18, and 19 (`>=17.0.0 || >=18.0.0-alpha.0 || >=19.0.0-alpha.0`).

## [0.9.0] - 2026-09-12

### Features
- **Auto-Scrolling Infinite List / Table:** Implemented auto-scrolling infinite list and table functionality for `AdvancedTable` component tailored for digital signage displays.
- **Title Header Sizing:** Enhanced title header sizing options and typography controls.

## [0.8.0] - 2026-05-15

### Features
- **Advanced Table Variation:** Display items in a configurable table layout with customizable columns based on selected options.
- **Advanced List Marker Variation:** Custom list marker styling options (None, Disc, Circle, Square, Decimal, Roman, Alpha).

## [0.7.0]

### Features
- **Advanced List Variation:** Added list variation supporting ordered list (OL), unordered list (UL), and unstyled bullet lists.
