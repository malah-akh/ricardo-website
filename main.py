from pathlib import Path
from fasthtml.common import *

app, rt = fast_app()

HERE = Path(__file__).parent


@rt("/")
def get():
    return Response((HERE / "index.html").read_text(), media_type="text/html")


if __name__ == "__main__":
    serve()
