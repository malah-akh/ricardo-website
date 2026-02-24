from fasthtml.common import *

app, rt = fast_app(live=True)


@rt("/")
def get():
    with open("index.html", "r") as f:
        return Response(f.read(), media_type="text/html")


serve()
