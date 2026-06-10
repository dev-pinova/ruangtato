// Set up environment variables for testing

// Mock the global process.env for tests
process.env.DATABASE_URL = "postgres://postgres:postgres@localhost:5432/ruangtato_test"
process.env.S3_BUCKET = "test-bucket"
process.env.S3_ACCESS_KEY_ID = "test-access"
process.env.S3_SECRET_ACCESS_KEY = "test-secret"
process.env.S3_ENDPOINT = "https://test.r2.cloudflarestorage.com"
