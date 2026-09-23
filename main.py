from pathlib import Path
from fasthtml.common import *

_app, rt = fast_app()
# Vercel's entrypoint detector requires an explicit top-level app assignment.
app = _app

HERE = Path(__file__).parent


@rt("/")
def get():
    return Response((HERE / "index.html").read_text(), media_type="text/html")


if __name__ == "__main__":
    serve()
