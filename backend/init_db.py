
"""
DocuMind - Database Initialization Script

Initializes the database by enabling the pgvector extension,
creating all ORM tables, and configuring the HNSW vector index.
"""

from sqlalchemy import text

from app.core.database import Base, engine
import app.models  # Register all ORM models with SQLAlchemy


def init_database() -> None:
    """Initialize the database schema and vector search index."""

    print("Connecting to the database...")

    # 1. Enable the pgvector extension
    with engine.connect() as connection:
        print("Enabling the pgvector extension...")

        connection.execute(
            text("CREATE EXTENSION IF NOT EXISTS vector;")
        )
        connection.commit()

        # Verify the installed pgvector extension
        result = connection.execute(
            text(
                """
                SELECT extname, extversion
                FROM pg_extension
                WHERE extname = 'vector';
                """
            )
        )

        extension = result.fetchone()

        if extension is None:
            raise RuntimeError(
                "Failed to verify the pgvector extension."
            )

        print(
            f"pgvector extension is ready. "
            f"Version: {extension.extversion}"
        )

    # 2. Create all ORM tables
    print("Creating database tables...")

    Base.metadata.create_all(bind=engine)

    print("Database tables created successfully.")

    # 3. Create the HNSW index for vector similarity search
    print("Creating the HNSW vector index...")

    with engine.begin() as connection:
        connection.execute(
            text(
                """
                CREATE INDEX IF NOT EXISTS
                    ix_document_chunks_embedding_hnsw
                ON document_chunks
                USING hnsw (embedding vector_cosine_ops);
                """
            )
        )

    print("HNSW vector index created successfully.")
    print("DocuMind database initialization completed successfully.")


if __name__ == "__main__":
    init_database()
