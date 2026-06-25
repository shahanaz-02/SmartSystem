import fitz  # PyMuPDF
import uuid
from chroma_store import add_document

def load_pdf(file_path: str, metadata: dict) -> int:
    doc = fitz.open(file_path)
    chunks = []

    for page in doc:
        text = page.get_text().strip()
        if text:
            chunks.append(text)

    for i, chunk in enumerate(chunks):
        add_document(
            text=chunk,
            metadata={**metadata, "page": i + 1},
            doc_id=str(uuid.uuid4())
        )

    return len(chunks)