"""
GPF 2026 — Complimentary Premium Pass sender
Calls the live /api/send-email endpoint (same as paid attendees get).
"""

import time
import json
import urllib.request
import urllib.error

API_URL = "https://www.thegreatproductfestival.com/api/send-email"

def gen_pass_number(payment_id: str, tier: str) -> str:
    prefix = 'V' if tier == 'VIP' else 'P' if tier == 'Premium' else 'G'
    suffix = payment_id[-6:].upper()
    return f"GPF26-{prefix}-{suffix}"

members = [
    # ACCELERATE
    { "first": "Madhushree",      "last": "",            "company": "Mastercard",                  "role": "",                                    "email": "findmadhu.roy@gmail.com",         "payment_id": "XCOMPWIP001" },
    { "first": "Sheethal Ann",    "last": "George",      "company": "Adobe",                       "role": "",                                    "email": "sheethalg@gmail.com",             "payment_id": "XCOMPWIP002" },
    { "first": "Lavanya",         "last": "Karunakaran", "company": "Light And Wonder iGaming",    "role": "Deputy Director, Product Management", "email": "lavanya.karunakaran@gmail.com",   "payment_id": "XCOMPWIP003" },
    { "first": "Sai Keerthana",   "last": "Srinivasan",  "company": "Docusign",                   "role": "Lead Product Designer",               "email": "ssai.keerthana@gmail.com",        "payment_id": "XCOMPWIP004" },
    # ADVANCE
    { "first": "Swati",           "last": "Sharma",      "company": "Ellucian India",              "role": "Senior Product Manager",              "email": "swati.sharma8621@gmail.com",      "payment_id": "XCOMPWIP005" },
    { "first": "Nidhi",           "last": "Shreya",      "company": "",                            "role": "",                                    "email": "nidhishreya@gmail.com",           "payment_id": "XCOMPWIP006" },
]

def send_pass(m: dict) -> bool:
    name        = f"{m['first']} {m['last']}".strip()
    pass_number = gen_pass_number(m["payment_id"], "Premium")
    payload = {
        "to_email":    m["email"],
        "to_name":     name,
        "company":     m["company"],
        "pass_type":   "Premium Pass",
        "amount":      "Complimentary",
        "payment_id":  m["payment_id"],
        "pass_number": pass_number,
        "event_date":  "25-26 Sept 2026",
        "event_city":  "RMZ Ecoworld, Bangalore",
    }
    data = json.dumps(payload).encode()
    req  = urllib.request.Request(API_URL, data=data, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            result = json.loads(resp.read())
            return result.get("ok", False)
    except Exception as e:
        print(f"  ERROR: {e}")
        return False

def main():
    print(f"Sending {len(members)} complimentary Premium Passes…\n")
    ok, fail = 0, 0
    for m in members:
        name = f"{m['first']} {m['last']}".strip()
        pn   = gen_pass_number(m["payment_id"], "Premium")
        print(f"  → {name:25s}  {m['email']:40s}  {pn}", end="  ")
        if send_pass(m):
            print("✓")
            ok += 1
        else:
            print("✗ FAILED")
            fail += 1
        time.sleep(1.5)

    print(f"\nDone — {ok} sent, {fail} failed.")

if __name__ == "__main__":
    main()
