from pathlib import Path
from fasthtml.common import *
from starlette.middleware import Middleware

HERE = Path(__file__).resolve().parent
class StaticCacheHeaders:
    """Apply browser caching to assets served by either static or explicit routes."""
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        path = scope.get("path", "")
        cache = None
        if scope.get("type") == "http" and scope.get("method") in {"GET", "HEAD"}:
            if path.startswith("/assets/") or path in {"/site.css", "/site.js"}:
                cache = b"public, max-age=86400, stale-while-revalidate=604800"
            elif path in {"/robots.txt", "/sitemap.xml"}:
                cache = b"public, max-age=3600"

        async def cached_send(message):
            if cache and message["type"] == "http.response.start" and message["status"] in {200, 304}:
                headers = [(k, v) for k, v in message.get("headers", []) if k.lower() != b"cache-control"]
                message["headers"] = headers + [(b"cache-control", cache)]
            await send(message)

        await self.app(scope, receive, cached_send)


# FastHTML registers its static route before the routes below.
# Resolve that route from this file, independently of the process directory.
_app, rt = fast_app(static_path=str(HERE), middleware=[Middleware(StaticCacheHeaders)])
# Vercel's entrypoint detector requires an explicit top-level app assignment.
app = _app

@rt("/")
def get():
    return Response((HERE / "index.html").read_text(), media_type="text/html")


@rt("/site.css")
def stylesheet():
    return Response((HERE / "site.css").read_text(), media_type="text/css")


@rt("/site.js")
def javascript():
    return Response((HERE / "site.js").read_text(), media_type="application/javascript")


@rt("/robots.txt")
def robots():
    return Response((HERE / "robots.txt").read_text(), media_type="text/plain")


@rt("/sitemap.xml")
def sitemap():
    return Response((HERE / "sitemap.xml").read_text(), media_type="application/xml")


if __name__ == "__main__":
    serve()
