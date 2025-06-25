"""Script to generate OpenAPI documentation for the A1Betting backend.
Outputs openapi.json and a static Swagger UI site (if desired).
"""

import json

from fastapi.openapi.utils import get_openapi

from backend.main_enhanced import app


def generate_openapi():
    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )
    with open("openapi.json", "w") as f:
        json.dump(openapi_schema, f, indent=2)
    print("openapi.json generated.")


if __name__ == "__main__":
    generate_openapi()
