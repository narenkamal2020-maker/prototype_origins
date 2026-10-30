# Asset, font, and reference sources

The supplied user prompt is the source of truth for the studio's hours, phone number, address, services, reputation figures, and review quotes. Third-party directory values that differ from the user's supplied facts were not used.

## Studio photos

The four real studio photos were returned by image search as photos of Origins Fitness Studio in Madipakkam. They were copied into the project, uploaded to managed project storage, and then uploaded to the durable public CDN because `/manus-storage/...` returned HTTP 404 from the actual Cloud Preview origin. The site uses these public URLs; their original image-source URLs are included below.

- `studio-floor.jpg` — site CDN URL: https://files.manuscdn.com/user_upload_by_module/session_file/310519663523940180/iQJPGPFvfLnnAHMg.jpg — original [image source](https://files.manuscdn.com/search-media/310519663523940180/8xKscaYI1qDEFQfzkLhW4X/iHeZnuxwuUjb9kq3A4q3pj.jpg)
- `training-session.jpg` — site CDN URL: https://files.manuscdn.com/user_upload_by_module/session_file/310519663523940180/LOHxyLiqzysQVOIY.jpg — original [image source](https://files.manuscdn.com/search-media/310519663523940180/8xKscaYI1qDEFQfzkLhW4X/8TjdvGtCDxtc8r3aVTGtFH.jpg)
- `coaching-floor.jpg` — site CDN URL: https://files.manuscdn.com/user_upload_by_module/session_file/310519663523940180/XTEIqEyNKLssWHXR.jpg — original [image source](https://files.manuscdn.com/search-media/310519663523940180/8xKscaYI1qDEFQfzkLhW4X/eLYp3zfn9uJhPv5iF39D73.jpg)
- `equipment-room.jpg` — site CDN URL: https://files.manuscdn.com/user_upload_by_module/session_file/310519663523940180/bknPHdpCFKzBrtZM.jpg — original [image source](https://files.manuscdn.com/search-media/310519663523940180/8xKscaYI1qDEFQfzkLhW4X/sNyJJDRiCoSpRy9fJpdp8M.jpg)

## Training video

The user-supplied 30-second portrait clip is bundled at `videos/training-session.mp4` (H.264, 360 × 640). It replaces the standalone image in the Studio section and uses the original studio-floor photo as its poster. It autoplays muted, loops, and keeps native controls; playback pauses when reduced motion is preferred. The rotating hero gallery continues to use still photos.

The source listing page used to confirm the business-photo association is [Origins Fitness Studio on Justdial](https://www.justdial.com/Chennai/Origins-Fitness-Studio-Near-Anitha-Hospital-Madipakkam/044PXX44-XX44-250910113731-Y8Q8_BZDET).

## Supplied logo, directions, and favicon

The user-provided file `pasted_file_JwlQCt_image.png` is used in the navigation and footer from this durable public CDN URL: https://files.manuscdn.com/user_upload_by_module/session_file/310519663523940180/eUZGtpWhRbknyPTP.png. Project branding references the same image at that URL.

The embedded map and directions links search Google Maps using the full address supplied by the user. The compact orbit mark remains the browser-tab favicon so the wordmark remains legible at page scale.

## Current typography sources

- [Limelight on Google Fonts](https://fonts.google.com/specimen/Limelight) is used for prominent headlines.
- [Lavishly Yours on Google Fonts](https://fonts.google.com/specimen/Lavishly+Yours) is used only for short decorative script accents.
- The existing Poppins webfont remains the clean sans-serif for body text and interface copy.

The attached `info.rtfd.zip` contains search-result snapshots and directory snippets, not verified trainer portraits or confirmed individual trainer profiles. None of its unsupported review, trainer, service, or hours claims were adopted.

The user-supplied Karan and Sanjay portraits are bundled at `images/trainers/karan.png` and `images/trainers/sanjay.png`. Afzal's referenced portrait file is not included in the project; his card shows his initials and a “Portrait to be added” note when that image fails to load. Mohammed Ali's card also uses a placeholder because no confirmed portrait was provided for him.

## Motion source and delivery constraint

The official [Motion JavaScript scroll API documentation](https://motion.dev/docs/scroll) describes `scroll()` for scroll-linked parallax and recommends CSS `position: sticky` for pinned sections. The npm registry reported `motion` version `14.8.0`; the ESM CDN URL `https://cdn.jsdelivr.net/npm/motion@14.8.0/+esm` returned server-side content but failed to import in the preview browser. The site therefore serves a locally bundled scroll API at `motion-scroll.js`, plus a readable first-party controller in `site-interactions.js`, without adopting React or changing the static/Vercel architecture. MIT notices are in `MOTION-LICENSE.txt`.

Superseded font exploration: Tan Buster was listed as a paid webfont product by TanType on [Creative Market](https://creativemarket.com/tantype/5891172-TAN-BUSTER). The current user-selected Limelight and Lavishly Yours pair supersedes that suggestion; Tan Buster is not included.
