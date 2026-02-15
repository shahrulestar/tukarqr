# Plan: OG Image Update & Cleanup

## 1. Update OG Image to `tkrqr.png`

**File:** `app/layout.tsx`

- Change `openGraph.images[0].url` from `/image.png` → `/tkrqr.png`
- Change `twitter.images[0]` from `/image.png` → `/tkrqr.png`

**Note:** `public/tkrqr.png` already exists.

---

## 2. Remove Unused Public Assets

| Asset | Status | Action |
|-------|--------|--------|
| `public/image.png` | Replaced by tkrqr.png for OG | **Delete** |
| `public/vercel.svg` | Not referenced in app | **Delete** |
| `public/next.svg` | Not referenced in app | **Delete** |
| `public/globe.svg` | Not referenced in app | **Delete** |
| `public/file.svg` | Not referenced in app | **Delete** |
| `public/window.svg` | Not referenced in app | **Delete** |
| `public/favicon.ico` | Used in layout metadata | **Keep** |
| `public/tkrqr.png` | New OG image | **Keep** |

---

## 3. Remove Unused Code

**Checked:**
- `app/page.tsx` – All imports used (RefreshCw, QrCode, ImageIcon, Scan, X, etc.)
- `components/ui/drawer.tsx` – Used for mobile ratio selection
- No dead code or unused components found

**Result:** No unused code to remove.

---

## 4. Remove Unused Folders

**Checked:** No empty or unused folders identified. Project structure is lean.

---

## Summary

| Task | Action |
|------|--------|
| OG image | Update layout.tsx to use `/tkrqr.png` |
| Unused assets | Delete 6 files: image.png, vercel.svg, next.svg, globe.svg, file.svg, window.svg |
| Unused code | None found |
| Unused folders | None found |
