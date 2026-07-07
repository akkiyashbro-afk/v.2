from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
import base64
import logging
import re
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone

import httpx


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Email setup — Emergent managed email proxy.
# EMAIL_BASE_URL is a hardcoded constant (survives deployment); never read from env.
EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMERGENT_EMAIL_KEY = os.environ.get('EMERGENT_EMAIL_KEY', '')
EMAIL_FROM_NAME = os.environ.get('EMAIL_FROM_NAME', 'WinsAble')
RECOVERY_APPEAL_RECIPIENT = os.environ.get(
    'RECOVERY_APPEAL_RECIPIENT', 'aakashpalzone@gmail.com'
)

app = FastAPI()
api_router = APIRouter(prefix="/api")


# ---------- Models ----------
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class RecoveryAppealRecord(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    full_name: str
    email: EmailStr
    platform: str
    username: str
    followers: str
    problem_type: str
    since_when: str
    already_submitted_appeal: str
    can_login: str
    additional_details: Optional[str] = ""
    attachment_names: List[str] = Field(default_factory=list)
    resend_email_id: Optional[str] = None
    submitted_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "WinsAble V2 API"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


def _escape_html(text: str) -> str:
    return (
        (text or "")
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def _build_email_html(payload: dict) -> str:
    rows = [
        ("Full Name", payload.get("full_name", "")),
        ("Email", payload.get("email", "")),
        ("Platform", payload.get("platform", "")),
        ("Username", payload.get("username", "")),
        ("Followers", payload.get("followers", "")),
        ("Problem Type", payload.get("problem_type", "")),
        ("Since When", payload.get("since_when", "")),
        ("Already Submitted Appeal", payload.get("already_submitted_appeal", "")),
        ("Can Login", payload.get("can_login", "")),
        ("Additional Details", payload.get("additional_details", "") or "—"),
    ]
    tr = "".join(
        f'<tr>'
        f'<td style="padding:10px 14px;color:#8a8f98;text-transform:uppercase;'
        f'letter-spacing:.14em;font-size:11px;border-bottom:1px solid #1a1a1a;'
        f'width:200px;vertical-align:top">{_escape_html(k)}</td>'
        f'<td style="padding:10px 14px;color:#fafafa;font-size:14px;'
        f'border-bottom:1px solid #1a1a1a">{_escape_html(v)}</td></tr>'
        for k, v in rows
    )
    return f"""
<div style="background:#050505;padding:32px;font-family:Inter,-apple-system,Segoe UI,sans-serif;color:#fafafa">
  <div style="max-width:640px;margin:0 auto;background:#0D0D0D;border:1px solid #1a1a1a;border-radius:16px;overflow:hidden">
    <div style="padding:28px 28px 8px 28px;border-bottom:1px solid #1a1a1a">
      <div style="font-size:11px;letter-spacing:.28em;color:#8a8f98;text-transform:uppercase">
        WinsAble · Recovery Case
      </div>
      <div style="margin-top:8px;font-size:22px;font-weight:800;letter-spacing:-0.02em;color:#fafafa">
        New Recovery Appeal
      </div>
      <div style="margin-top:6px;color:#a1a1aa;font-size:14px">
        {_escape_html(payload.get('platform', ''))} · {_escape_html(payload.get('username', ''))}
      </div>
    </div>
    <table style="width:100%;border-collapse:collapse">
      {tr}
    </table>
    <div style="padding:20px 28px;border-top:1px solid #1a1a1a;color:#6b7280;font-size:11px;letter-spacing:.2em;text-transform:uppercase">
      Submitted {datetime.now(timezone.utc).strftime('%b %d, %Y · %H:%M UTC')}
    </div>
  </div>
</div>
"""


@api_router.post("/recovery/submit")
async def submit_recovery_appeal(
    full_name: str = Form(...),
    email: EmailStr = Form(...),
    platform: str = Form(...),
    username: str = Form(...),
    followers: str = Form(...),
    problem_type: str = Form(...),
    since_when: str = Form(...),
    already_submitted_appeal: str = Form(...),
    can_login: str = Form(...),
    additional_details: str = Form(""),
    screenshots: List[UploadFile] = File(default=[]),
):
    # Basic validation
    required = {
        "full_name": full_name,
        "email": email,
        "platform": platform,
        "username": username,
        "followers": followers,
        "problem_type": problem_type,
        "since_when": since_when,
        "already_submitted_appeal": already_submitted_appeal,
        "can_login": can_login,
    }
    missing = [k for k, v in required.items() if not str(v).strip()]
    if missing:
        raise HTTPException(status_code=422, detail=f"Missing fields: {', '.join(missing)}")

    if not EMERGENT_EMAIL_KEY:
        raise HTTPException(
            status_code=500,
            detail="Email service not configured (EMERGENT_EMAIL_KEY missing).",
        )

    # Build attachments (base64 for Resend)
    attachments = []
    attachment_names: List[str] = []
    total_bytes = 0
    MAX_TOTAL = 15 * 1024 * 1024  # 15 MB combined cap for safety
    for f in screenshots or []:
        if not f or not f.filename:
            continue
        data = await f.read()
        total_bytes += len(data)
        if total_bytes > MAX_TOTAL:
            raise HTTPException(
                status_code=413,
                detail="Combined attachment size exceeds 15 MB.",
            )
        attachments.append({
            "filename": f.filename,
            "content": base64.b64encode(data).decode("ascii"),
        })
        attachment_names.append(f.filename)

    payload = {
        "full_name": full_name.strip(),
        "email": str(email),
        "platform": platform.strip(),
        "username": username.strip(),
        "followers": followers.strip(),
        "problem_type": problem_type.strip(),
        "since_when": since_when.strip(),
        "already_submitted_appeal": already_submitted_appeal.strip(),
        "can_login": can_login.strip(),
        "additional_details": (additional_details or "").strip(),
    }

    safe_username = re.sub(r"[^A-Za-z0-9._@-]", "", payload["username"])[:64]
    subject = f"New Recovery Appeal - {payload['platform']} - @{safe_username}"

    email_payload = {
        "to": [RECOVERY_APPEAL_RECIPIENT],
        "subject": subject,
        "html": _build_email_html(payload),
        "from_name": EMAIL_FROM_NAME,
        "contact_email": payload["email"],
    }
    if attachments:
        email_payload["attachments"] = attachments

    try:
        async with httpx.AsyncClient(timeout=30) as http_client:
            resp = await http_client.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": EMERGENT_EMAIL_KEY},
                json=email_payload,
            )
        resp.raise_for_status()
        result = resp.json() if resp.content else {}
        email_id = result.get("id") if isinstance(result, dict) else None
    except httpx.HTTPStatusError as e:
        logger.error(
            f"Email send failed: {e.response.status_code} {e.response.text}"
        )
        raise HTTPException(status_code=502, detail="Email delivery failed")
    except Exception as e:
        logger.error(f"Email send error: {e}")
        raise HTTPException(status_code=502, detail="Email delivery failed")

    record = RecoveryAppealRecord(
        **payload,
        attachment_names=attachment_names,
        resend_email_id=email_id,
    )
    doc = record.model_dump()
    doc['submitted_at'] = doc['submitted_at'].isoformat()
    try:
        await db.recovery_appeals.insert_one(doc)
    except Exception as e:
        logger.warning(f"Mongo store failed (non-fatal): {e}")

    return {
        "status": "success",
        "message": "Recovery appeal submitted",
        "case_id": record.id,
        "email_id": email_id,
    }


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
