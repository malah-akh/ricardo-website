# Ricardo website

Personal consulting portfolio. Production URL: https://ricardoborenstein.vercel.app/

## Local development

Create a virtual environment, install `requirements.txt`, then run `python main.py`.

## Assets and caching

The page uses small WebP display copies while retaining original artwork. Regenerate them and the social banner with `python scripts/optimize_assets.py` (requires Pillow and the macOS Arial fonts).

Static assets, CSS, and JavaScript use a one-day browser cache with a seven-day stale-while-revalidate window. Both the Python application and Vercel configuration apply this policy. Assets are not marked immutable because filenames are not content hashed; when changing an asset that must update immediately, rename it and update references.

`robots.txt`, `sitemap.xml`, canonical metadata, and social metadata use the production Vercel URL. Update all of these together when a custom domain is configured. Crawl files use a one-hour browser cache.

Contact uses Ricardo's existing Gmail address and LinkedIn profile. A booking service or working contact form can be added once an account and destination are available.
