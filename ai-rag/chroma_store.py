import chromadb
from embeddings import get_embedding

client = chromadb.Client()
collection = client.get_or_create_collection(
    "campusflow",
    metadata={"hnsw:space": "cosine"}
)

def add_document(text: str, metadata: dict, doc_id: str):
    collection.add(
        documents=[text],
        embeddings=[get_embedding(text)],
        metadatas=[metadata],
        ids=[doc_id]
    )

def search(query: str, n_results: int = 3):
    results = collection.query(
        query_embeddings=[get_embedding(query)],
        n_results=n_results
    )
    return results["documents"][0] if results["documents"] else []