from __future__ import annotations

import os
from pathlib import Path
from typing import Dict, List, Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles


REPO_ROOT = Path(__file__).resolve().parents[1]
PROCESSED_DIR = REPO_ROOT / "data" / "processed"
MAPAS_DIR = REPO_ROOT / "mapas"
TABELAS_DIR = REPO_ROOT / "tabelas"


def _list_products() -> List[str]:
    if not PROCESSED_DIR.exists():
        return []
    return sorted([p.name for p in PROCESSED_DIR.iterdir() if p.is_dir()])


def _latest_product() -> Optional[str]:
    items = [p for p in PROCESSED_DIR.iterdir() if p.is_dir()] if PROCESSED_DIR.exists() else []
    if not items:
        return None
    items.sort(key=lambda p: p.stat().st_mtime, reverse=True)
    return items[0].name


def _indices_for_product(product: str) -> Dict[str, str]:
    indices_dir = PROCESSED_DIR / product / "indices"
    if not indices_dir.exists():
        return {}
    return {p.stem: str(p.resolve()) for p in indices_dir.glob("*.tif")}


app = FastAPI(title="Cana Virus API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://127.0.0.1:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Static mounts to serve generated artifacts to the web app via Vite proxy
if MAPAS_DIR.exists():
    app.mount("/mapas", StaticFiles(directory=str(MAPAS_DIR)), name="mapas")
if TABELAS_DIR.exists():
    app.mount("/tabelas", StaticFiles(directory=str(TABELAS_DIR)), name="tabelas")


@app.get("/api/health")
def health() -> Dict[str, str]:
    return {"status": "ok"}


@app.get("/api/products")
def products() -> Dict[str, List[str]]:
    return {"products": _list_products()}


@app.get("/api/indices")
def indices(product: Optional[str] = Query(default=None)) -> Dict[str, Dict[str, str]]:
    prod = product or _latest_product()
    if not prod:
        return {"product": "", "indices": {}}
    return {"product": prod, "indices": _indices_for_product(prod)}


@app.get("/api/csv/{index_name}")
def get_csv(index_name: str):
    path = (TABELAS_DIR / f"{index_name}.csv").resolve()
    if not path.exists():
        raise HTTPException(status_code=404, detail="CSV not found")
    return FileResponse(str(path), media_type="text/csv", filename=path.name)


@app.get("/api/map/compare")
def compare_map() -> Dict[str, str]:
    # URL consumed by the frontend (proxied by Vite to this server)
    target = MAPAS_DIR / "compare_indices_all.html"
    if target.exists():
        return {"url": "/mapas/compare_indices_all.html"}
    # Fallback
    target2 = MAPAS_DIR / "compare_indices.html"
    if target2.exists():
        return {"url": "/mapas/compare_indices.html"}
    raise HTTPException(status_code=404, detail="Comparison map not found")


# Optional: serve truecolor overlay (very large files). Frontend can choose to embed it.
@app.get("/api/map/overlay")
def overlay_map() -> Dict[str, str]:
    target = MAPAS_DIR / "overlay_indices.html"
    if target.exists():
        return {"url": "/mapas/overlay_indices.html"}
    raise HTTPException(status_code=404, detail="Overlay map not found")

