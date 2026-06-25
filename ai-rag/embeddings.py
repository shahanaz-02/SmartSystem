import hashlib

def get_embedding(text: str):
    # Generate a 384-dimension vector from text
    vector = []
    for i in range(384):
        hash_bytes = hashlib.md5(f"{text}{i}".encode()).digest()
        value = int.from_bytes(hash_bytes[:4], 'big') / (2**32)
        vector.append(value)
    return vector