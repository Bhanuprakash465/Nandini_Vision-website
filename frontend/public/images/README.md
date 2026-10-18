# Adding real photography

Until real photographs are added, every image area on the site is a labelled placeholder
(see `SHOW_PLACEHOLDER_LABELS` in `lib/data.ts`; set it to `false` when you are done).

## Where to put files

Put optimised JPEG/WebP files in this folder, for example:

    public/images/work/a-red-thread/cover.jpg
    public/images/work/a-red-thread/01.jpg

Then reference them in `frontend/lib/data.ts`:

    {
      slug: "a-red-thread",
      ...
      image: "/images/work/a-red-thread/cover.jpg",
      gallery: ["/images/work/a-red-thread/01.jpg", "/images/work/a-red-thread/02.jpg"],
    }

`next/image` handles resizing, modern formats and lazy loading. Use landscape (around 3:2)
for covers and wide frames, portrait (around 4:5) for tall frames.

## Placeholders still to replace

- Homepage hero portrait (uses `projects[0].image`)
- Each project cover: A Red Thread, Between River & Sky, The Gold Hour, A Little More Life
- Each project gallery (4 frames per project, via `gallery`)
- Services page side portrait, About page studio photograph, Consultation page side image
- Homepage films frame (or set `NEXT_PUBLIC_SHOWREEL_URL` for a real video)

Only use photographs the studio owns or is licensed to publish.
