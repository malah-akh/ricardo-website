from pathlib import Path
from fasthtml.common import *

HERE = Path(__file__).resolve().parent
# FastHTML registers its static route before the routes below.
# Resolve that route from this file, independently of the process directory.
_app, rt = fast_app(static_path=str(HERE))
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


if __name__ == "__main__":
    serve()
