"""
Database layer — MongoDB is the source of truth in production.

If MONGODB_URI is absent/unreachable (sandbox, local dev without a
database), the API transparently falls back to an in-memory store with
the same interface so every feature still works. Nothing hardcoded.

Collections:
  bookings      — the studio calendar / bookings ledger
  inquiries     — consultation & contact enquiries
  admin_users   — admin authentication records
  notifications — notification records/logs (mock email included)
"""
from __future__ import annotations

import threading
import time
from datetime import datetime, timezone
from typing import Any

from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

from .config import get_settings

settings = get_settings()


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _serialize(doc: dict[str, Any]) -> dict[str, Any]:
    """Make a document JSON-safe for FastAPI responses."""
    import json
    from bson import ObjectId

    def convert(value: Any) -> Any:
        if isinstance(value, ObjectId):
            return str(value)
        if isinstance(value, datetime):
            return value.isoformat()
        if isinstance(value, dict):
            return {k: convert(v) for k, v in value.items()}
        if isinstance(value, (list, tuple)):
            return [convert(v) for v in value]
        return value

    return json.loads(json.dumps(convert(doc)))


class MemoryStore:
    """Thread-safe in-memory stand-in for MongoDB (dev/sandbox only)."""

    def __init__(self) -> None:
        self._lock = threading.RLock()
        self._data: dict[str, dict[str, dict[str, Any]]] = {
            "bookings": {},
            "inquiries": {},
            "admin_users": {},
            "notifications": {},
        }
        self._seq: dict[str, int] = {
            "bookings": 0,
            "inquiries": 0,
            "admin_users": 0,
            "notifications": 0,
        }

    def insert(self, collection: str, doc: dict[str, Any]) -> str:
        with self._lock:
            self._seq[collection] += 1
            oid = f"mem-{collection}-{self._seq[collection]}"
            doc["_id"] = oid
            self._data[collection][oid] = dict(doc)
            return oid

    def find_one(self, collection: str, query: dict[str, Any]) -> dict[str, Any] | None:
        with self._lock:
            for doc in self._data[collection].values():
                if all(doc.get(k) == v for k, v in query.items()):
                    return dict(doc)
        return None

    def find(self, collection: str, query: dict[str, Any] | None = None,
             sort: list[tuple[str, int]] | None = None) -> list[dict[str, Any]]:
        with self._lock:
            query = query or {}

            def matches(doc: dict[str, Any]) -> bool:
                for k, v in query.items():
                    if isinstance(v, dict) and "$in" in v:
                        if doc.get(k) not in v["$in"]:
                            return False
                    elif doc.get(k) != v:
                        return False
                return True

            docs = [dict(d) for d in self._data[collection].values() if matches(d)]
        if sort:
            for key, direction in reversed(sort):
                docs.sort(key=lambda d: (d.get(key) is None, d.get(key)), reverse=direction < 0)
        return docs

    def update(self, collection: str, oid: str, patch: dict[str, Any]) -> int:
        with self._lock:
            doc = self._data[collection].get(oid)
            if not doc:
                return 0
            for k, v in patch.items():
                if k != "_id":
                    doc[k] = v
            return 1

    def delete(self, collection: str, oid: str) -> int:
        with self._lock:
            return 1 if self._data[collection].pop(oid, None) is not None else 0

    def count(self, collection: str, query: dict[str, Any] | None = None) -> int:
        return len(self.find(collection, query))


def _connect_mongo() -> MongoClient | None:
    if not settings.mongodb_uri:
        return None
    try:
        client = MongoClient(settings.mongodb_uri, serverSelectionTimeoutMS=2500)
        client.admin.command("ping")
        return client
    except ConnectionFailure:
        return None


_client = _connect_mongo()
if _client is not None:
    _db = _client[settings.mongodb_db]
    # Unique index on human booking reference
    _db.bookings.create_index("booking_id", unique=True)
    _db.inquiries.create_index("inquiry_id", unique=True)
    _db.admin_users.create_index("email", unique=True)
    _db.notifications.create_index("notification_id", unique=True)
    _store: MemoryStore | None = None
    print("[nandini-vision] MongoDB connected:", settings.mongodb_uri)
else:
    if settings.require_mongodb:
        raise RuntimeError(
            "MONGODB_URI is set to a required database but is unreachable. "
            "Check the connection string or unset REQUIRE_MONGODB for dev."
        )
    _store = MemoryStore()
    print("[nandini-vision] MongoDB unreachable — using in-memory store (dev mode).")


class Repository:
    """Uniform data access across MongoDB and the memory fallback."""

    def insert(self, collection: str, doc: dict[str, Any]) -> str:
        if _store is not None:
            return _store.insert(collection, doc)
        res = _db[collection].insert_one(doc)
        return str(res.inserted_id)

    def find_one(self, collection: str, query: dict[str, Any]) -> dict[str, Any] | None:
        if _store is not None:
            return _store.find_one(collection, query)
        doc = _db[collection].find_one(query)
        return _serialize(doc) if doc else None

    def find(self, collection: str, query: dict[str, Any] | None = None,
             sort: list[tuple[str, int]] | None = None) -> list[dict[str, Any]]:
        if _store is not None:
            return _store.find(collection, query, sort)
        cursor = _db[collection].find(query or {})
        if sort:
            cursor = cursor.sort(sort)
        return [_serialize(d) for d in cursor]

    def update(self, collection: str, oid: str, patch: dict[str, Any]) -> bool:
        if _store is not None:
            return bool(_store.update(collection, oid, patch))
        res = _db[collection].update_one({"_id": oid}, {"$set": patch})
        return res.modified_count > 0 or res.matched_count > 0

    def delete(self, collection: str, oid: str) -> bool:
        if _store is not None:
            return bool(_store.delete(collection, oid))
        res = _db[collection].delete_one({"_id": oid})
        return res.deleted_count > 0

    def count(self, collection: str, query: dict[str, Any] | None = None) -> int:
        if _store is not None:
            return _store.count(collection, query)
        return _db[collection].count_documents(query or {})

    @property
    def online(self) -> bool:
        return _store is None


repo = Repository()
