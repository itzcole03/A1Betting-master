# Automated Testing & Documentation for A1Betting Backend

## Automated Testing

- All backend endpoints are covered by `pytest` tests in `tests/test_main_enhanced.py`.
- To run tests:

```bash
pytest tests/
```

- Tests use FastAPI's `TestClient` for in-process API validation.
- Add more tests to `tests/` as needed for new endpoints or business logic.

## Documentation Generation

- The backend exposes a full OpenAPI schema.
- To generate the OpenAPI JSON file, run:

```bash
python generate_docs.py
```

- This will create `openapi.json` in the project root.
- You can use Swagger UI or Redoc to visualize the API, or serve the docs statically.

## Recommendations

- Integrate test runs into your CI/CD pipeline for every commit.
- Regenerate docs after any API change and publish to your documentation portal.
- For advanced usage, consider generating static HTML docs using Swagger UI or Redoc CLI.
