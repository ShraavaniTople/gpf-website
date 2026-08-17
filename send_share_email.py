"""
GPF 2026 — Send social share email (with pass re-attached)
Run: python3 send_share_email.py
"""

import time
import json
import urllib.request

API_URL = "https://www.thegreatproductfestival.com/api/send-share"

# Test recipient — change to full list after confirming
recipients = [
    { "to_email": "shraavani2503@gmail.com", "to_name": "Shraavani", "company": "WiP India", "pass_type": "Premium Pass", "pass_number": "GPF26-P-TEST01" },
]

def send(r: dict) -> bool:
    data = json.dumps(r).encode()
    req  = urllib.request.Request(API_URL, data=data, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            result = json.loads(resp.read())
            return result.get("ok", False)
    except Exception as e:
        print(f"  ERROR: {e}")
        return False

def main():
    print(f"Sending share email to {len(recipients)} recipient(s)…\n")
    for r in recipients:
        print(f"  → {r['to_name']:25s}  {r['to_email']}", end="  ")
        ok = send(r)
        print("✓" if ok else "✗ FAILED")
        time.sleep(1)
    print("\nDone.")

if __name__ == "__main__":
    main()
