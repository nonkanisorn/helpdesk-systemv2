# Reference Document Style

Source file: `/Users/nonkns/Downloads/รูปแบบเอกสาร.docx`

Use this profile when creating or editing project/report documents that should match the supplied sample.

## Page Setup

- Paper: A4 portrait, `11906 x 16838` twips, approximately `8.27 x 11.69 in`.
- Margins: top `1.0 in`, right `1.0 in`, bottom `1.0 in`, left `1.25 in`.
- Header/footer distance: `0.49 in` from page edge.
- Default tab stop: `0.5 in`.
- Document zoom setting: `80%`.
- Sections: repeated A4 sections with the same page setup.

## Typography

- Main font: `TH Sarabun New`.
- Default body size: `16 pt` (`w:sz=32`).
- Thai language context: `th-TH`; English/default language: `en-US`.
- Default paragraph alignment in document defaults: `thaiDistribute`.
- Main text color: black, mostly `000000`; a small amount of `222222` appears in imported/web-style text.
- Character spacing control: `doNotCompress`.

## Common Text Roles

- Cover title: centered, bold, `22 pt` (`w:sz=44`).
- Author names: centered, bold, `20 pt` (`w:sz=40`).
- Cover program/faculty/year lines: centered, bold, `18 pt` (`w:sz=36`).
- Normal body text: `16 pt`, regular or bold according to role.
- Smaller labels/captions/imported text: `14 pt`, `12 pt`, and `10 pt` appear in limited areas.
- Very large decorative/number text: `48 pt` appears once.

## Paragraph Layout

- Most paragraphs use direct formatting rather than named Word styles.
- Frequent alignments:
  - Center: used heavily for cover, section titles, captions, figures, and some tables.
  - Left: used for body/reference-like content.
  - Thai distribute: used for many Thai paragraphs.
  - Both/justified: rare.
- Common paragraph spacing: after `48` twips with line `20` twips, `lineRule=atLeast`.
- Some web/reference paragraphs set before/after spacing to `0`.
- Common list indentation: left `0.5 in` with hanging `0.5 in`.
- Deeper list levels: left/hanging around `1.5 in` and `2.0 in`.
- Body first-line indent appears around `0.75 in` in a few prose paragraphs.

## Document Structure

- Academic project/report style.
- First page uses a centered cover layout with large bold Thai title, centered author names, program/faculty/university lines, and year.
- Front matter uses Thai report conventions such as certificate/abstract/table-of-contents style pages.
- Main chapters use centered bold headings and numbered Thai chapter structure.
- Figure captions and table captions are centered and usually close to the visual they describe.

## Tables

- Tables are plain Word tables with explicit column grids in most cases.
- Database schema tables use approximately `6.12 in` total width (`8815` twips), 6 columns, and compact technical rows.
- Survey/evaluation tables use approximately `6.13-6.31 in` total width (`8820-9090` twips).
- Survey tables use a wide first column for the evaluation item and narrow centered numeric columns.
- Table text should stay in `TH Sarabun New`, typically `16 pt` unless the content is dense.
- Keep borders/gridlines visible and utilitarian; avoid decorative fills unless the source document clearly uses them locally.

## Images And Figures

- The document contains many inline images/screenshots.
- Common screenshot width: about `6.02 in`, matching the usable text width.
- Other common image widths: `5.32-5.77 in`, `4.74-5.0 in`, and small logo-like image around `1.83 x 1.30 in`.
- Figures are usually centered and placed as inline drawings.
- Preserve aspect ratio and keep captions paired with images.

## Headers And Footers

- Header/footer parts exist but most are visually empty.
- Some sections contain a page number/text value `2` in header/footer XML.
- Do not add heavy page furniture unless requested; keep headers/footers minimal.

## Implementation Notes

- Prefer direct DOCX formatting that reproduces the sample over modern styled templates.
- If generating with code, explicitly set page geometry, default font, paragraph alignment, font sizes, and spacing; do not rely on application defaults.
- For Thai academic report output, keep the overall look conservative: centered formal headings, TH Sarabun New, generous left margin, and full-width screenshots/tables.
- LibreOffice rendering was unavailable on this machine (`soffice` not found), so this reference is based on DOCX OOXML inspection rather than rendered PNG QA.
