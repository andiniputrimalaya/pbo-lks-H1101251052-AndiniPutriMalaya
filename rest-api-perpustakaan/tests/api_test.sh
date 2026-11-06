#!/bin/bash
BASE="http://localhost:8000/api"
JSON="Content-Type: application/json"

echo "== Test 1: GET semua buku =="
curl -s $BASE/books | jq

echo "== Test 2: POST buku baru =="
ID=$(curl -s -X POST $BASE/books -H "$JSON" \
  -d '{"judul":"Buku Uji","penulis":"Penulis Uji","tahun":2024,"stok":3}' \
  | jq -r '.data.id' | tr -d '\r')
echo "ID baru: $ID"

echo "== Test 3: GET buku ID $ID =="
curl -s $BASE/books/$ID | jq

echo "== Test 4: PUT ubah buku =="
curl -s -X PUT $BASE/books/$ID -H "$JSON" \
  -d '{"judul":"Buku Uji Revisi","penulis":"Penulis Uji","tahun":2025,"stok":9}' | jq

echo "== Test 5: DELETE buku =="
curl -s -X DELETE $BASE/books/$ID | jq

echo "== Test 6: Validasi error =="
curl -s -X POST $BASE/books -H "$JSON" -d '{"judul":""}' | jq