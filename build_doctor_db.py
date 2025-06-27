import json
import chromadb
from sentence_transformers import SentenceTransformer

# 1. 載入醫師資料
with open('doctors.json', 'r', encoding='utf-8') as f:
    doctors = json.load(f)

# 2. 初始化向量模型（bge-m3）
model = SentenceTransformer('BAAI/bge-m3')

# 3. 初始化 ChromaDB
client = chromadb.PersistentClient(path="chroma_db/doctorv1")
collection = client.get_or_create_collection("doctorv1")

# 4. 將每位醫師資料轉成向量並存入 ChromaDB
for idx, doctor in enumerate(doctors):
    # 將醫師所有資訊合併成一個描述
    doc_text = f"{doctor['name']}，{doctor['department']}，{'，'.join(doctor.get('specialty', []))}，{'，'.join(doctor.get('title', []))}，{'，'.join(doctor.get('experience', []))}，{'，'.join(doctor.get('education', []))}，{'，'.join(doctor.get('certifications', []))}"
    embedding = model.encode(doc_text)
    collection.add(
        documents=[doc_text],
        embeddings=[embedding.tolist()],
        ids=[str(idx)]
    )

print("✅ 醫師向量庫建立完成！")