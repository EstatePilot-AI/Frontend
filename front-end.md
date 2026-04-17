Act as a senior React UI/UX engineer.

The current CRM uses a Prime-style dark theme, but some UI parts look inconsistent and not polished. I want you to refine and fix the following components to achieve a clean, premium dark dashboard look.

DO NOT change business logic — only UI/UX and styling.

---

1. TABLE HEADER (IMPORTANT FIX)

Problem:

* Table header looks flat and unclear
* No strong visual separation from rows

Fix:

* Make header slightly darker than rows
  Example:
  Header background: #111827
  Row background: #0F172A

* Text:

  * Uppercase
  * Small size
  * Letter spacing (0.05em)
  * Color: #9CA3AF

* Add subtle bottom border:
  border-bottom: 1px solid #1F2937

* Align columns cleanly

* Add more horizontal padding

---

2. TABLE ROWS

* Improve row spacing (more breathing room)

* Add hover effect:
  background: rgba(255,255,255,0.03)

* Status badges:

  * Green (qualified): #22C55E (soft background)
  * Red (not interested): #EF4444
  * Gray/blue (invalid): muted tone

* Make badges softer:
  background: rgba(color, 0.12)
  border-radius: 999px

---

3. SIDEBAR (REFINEMENT)

Problem:

* Looks a bit heavy and outdated

Fix:

* Background: #0F172A

* Reduce visual weight

* Increase spacing between items

* Active item:
  background: rgba(34,197,94,0.12)
  color: #22C55E

* Section titles:

  * Smaller
  * Uppercase
  * More spacing above sections

* Icons:

  * Slightly dimmed when inactive
  * Brighter when active

---

4. TOPBAR (SIMPLIFY)

Problem:

* Slight clutter / not clean

Fix:

* Keep minimal:

  * Page title (left)
  * User avatar (right)
  * Theme toggle

* Remove unnecessary elements

* Add subtle bottom border:
  border-bottom: 1px solid #1F2937

---

5. PAGE HEADER (LEADS TITLE AREA)

Fix spacing and hierarchy:

* Title (Leads):

  * Larger
  * Bold

* Subtitle:

  * Smaller
  * Muted color (#9CA3AF)

* Filters (chips):

  * Add spacing between them
  * Active:
    background: #22C55E
    color: #022C22
  * Inactive:
    background: #1F2937
    color: #9CA3AF

---

6. SEARCH INPUT (RIGHT SIDE)

* Make it more subtle:
  background: #111827
  border: 1px solid #1F2937

* Remove any glow or strong outline

* Focus state:
  border-color: #22C55E

---

7. GLOBAL CONSISTENCY

* Use consistent spacing (8px system)
* Avoid heavy shadows
* Use contrast instead of borders where possible
* Keep everything minimal and clean

---

GOAL:

Make the UI feel like:

* A real SaaS product
* Clean, modern, and premium
* Not like a default Prime template

---

OUTPUT:

* Updated styles for:

  * Table
  * Sidebar
  * Topbar
  * Filters
* Clean React/Tailwind implementation
