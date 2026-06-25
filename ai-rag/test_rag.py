from rag_engine import ask, add_text

# Add some test content
add_text(
    "The DBMS exam is on July 3rd at 9 AM in Hall B.",
    {"source": "test_notice"}
)

# Ask a question
answer = ask("When is the DBMS exam?")
print("Answer:", answer)