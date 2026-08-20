"""
GPF 2026 — Send social share email to all attendees
Covers: 8 paid pass holders + 5 Premium complimentary + 12 General complimentary
Run: python3 send_share_email.py
"""

import time
import json
import urllib.request

API_URL = "https://www.thegreatproductfestival.com/api/send-share"


def gen_pass_number(email: str, tier: str) -> str:
    """Mirror of JS hash used in AdminSendPassesPage / genGeneralPassNumber."""
    prefix = {'VIP': 'V', 'Premium': 'P', 'General': 'G'}.get(tier, 'G')
    h = 0
    for c in email:
        h = (h * 31 + ord(c)) & 0xFFFFFF
    return f"GPF26-{prefix}-{h:06X}"


# ── Paid pass holders (8) ─────────────────────────────────────────────────────
paid = [
    {"to_email": "akbgunner4ever@gmail.com",  "to_name": "Akshay Balakrishnan",    "company": "",  "pass_type": "Premium Pass", "pass_number": gen_pass_number("akbgunner4ever@gmail.com",  "Premium")},
    {"to_email": "singhmanavi12@gmail.com",   "to_name": "Manavi Singh",            "company": "",  "pass_type": "VIP Pass",     "pass_number": gen_pass_number("singhmanavi12@gmail.com",   "VIP")},
    {"to_email": "rhalder197@gmail.com",      "to_name": "Rituparna Haldar",        "company": "",  "pass_type": "Premium Pass", "pass_number": gen_pass_number("rhalder197@gmail.com",      "Premium")},
    {"to_email": "smeena06@gmail.com",        "to_name": "Meenakshi Subramanian",   "company": "",  "pass_type": "VIP Pass",     "pass_number": gen_pass_number("smeena06@gmail.com",        "VIP")},
    {"to_email": "deepikaverma.pm@gmail.com", "to_name": "Deepika Verma",           "company": "",  "pass_type": "Premium Pass", "pass_number": gen_pass_number("deepikaverma.pm@gmail.com", "Premium")},
    {"to_email": "nikkiejazz@gmail.com",      "to_name": "Rachna Dixit",            "company": "",  "pass_type": "General Pass", "pass_number": gen_pass_number("nikkiejazz@gmail.com",      "General")},
    {"to_email": "tammanasriraj@gmail.com",   "to_name": "Tammana Sriraj",          "company": "",  "pass_type": "General Pass", "pass_number": gen_pass_number("tammanasriraj@gmail.com",   "General")},
    {"to_email": "kumudacharya2000@gmail.com","to_name": "Kumud Acharya",           "company": "",  "pass_type": "VIP Pass",     "pass_number": gen_pass_number("kumudacharya2000@gmail.com","VIP")},
]

# ── Premium complimentary — WiP India community (5) ──────────────────────────
comp_premium = [
    {"to_email": "findmadhu.roy@gmail.com",      "to_name": "Madhushree",               "company": "Mastercard",               "pass_type": "Premium Pass", "pass_number": "GPF26-P-WIP001"},
    {"to_email": "sheethalg@gmail.com",           "to_name": "Sheethal Ann George",      "company": "Adobe",                    "pass_type": "Premium Pass", "pass_number": "GPF26-P-WIP002"},
    {"to_email": "lavanya.karunakaran@gmail.com", "to_name": "Lavanya Karunakaran",      "company": "Light And Wonder iGaming", "pass_type": "Premium Pass", "pass_number": "GPF26-P-WIP003"},
    {"to_email": "ssai.keerthana@gmail.com",      "to_name": "Sai Keerthana Srinivasan", "company": "Docusign",                 "pass_type": "Premium Pass", "pass_number": "GPF26-P-WIP004"},
    {"to_email": "swati.sharma8621@gmail.com",    "to_name": "Swati Sharma",             "company": "Ellucian India",           "pass_type": "Premium Pass", "pass_number": "GPF26-P-WIP005"},
]

# ── General complimentary — core team (12) ────────────────────────────────────
comp_general = [
    {"to_email": "swathi.chirravuri@gmail.com",        "to_name": "Swathi Chirravuri",    "company": "Stealth Startup",  "pass_type": "General Pass", "pass_number": gen_pass_number("swathi.chirravuri@gmail.com",        "General")},
    {"to_email": "Aditirajesh1234@gmail.com",          "to_name": "Aditi Rajesh",         "company": "Hashfame",         "pass_type": "General Pass", "pass_number": gen_pass_number("Aditirajesh1234@gmail.com",          "General")},
    {"to_email": "priya1687@gmail.com",                "to_name": "Priyadarshini M",      "company": "SES Satellite",    "pass_type": "General Pass", "pass_number": gen_pass_number("priya1687@gmail.com",                "General")},
    {"to_email": "Sonikap70@gmail.com",                "to_name": "Sonika Panghal",       "company": "Godrej Capital",   "pass_type": "General Pass", "pass_number": gen_pass_number("Sonikap70@gmail.com",                "General")},
    {"to_email": "khyaatijindal@gmail.com",            "to_name": "Khyaati Jindal",       "company": "Apple",            "pass_type": "General Pass", "pass_number": gen_pass_number("khyaatijindal@gmail.com",            "General")},
    {"to_email": "Sangeetha.balakrishnan.k@gmail.com", "to_name": "Sangeetha Balakrishnan","company": "Workday",         "pass_type": "General Pass", "pass_number": gen_pass_number("Sangeetha.balakrishnan.k@gmail.com", "General")},
    {"to_email": "Shubhodaye@gmail.com",               "to_name": "Shubhodaye Hiremath",  "company": "Freelancer",       "pass_type": "General Pass", "pass_number": gen_pass_number("Shubhodaye@gmail.com",               "General")},
    {"to_email": "nidhbartakke@gmail.com",             "to_name": "Nidhi Bartakke",       "company": "Target",           "pass_type": "General Pass", "pass_number": gen_pass_number("nidhbartakke@gmail.com",             "General")},
    {"to_email": "jonnada.vishwajeet@gmail.com",       "to_name": "Vishwajeet Jonnada",   "company": "CGI",              "pass_type": "General Pass", "pass_number": gen_pass_number("jonnada.vishwajeet@gmail.com",       "General")},
    {"to_email": "deeksha.anand29@gmail.com",          "to_name": "Deeksha Anand",        "company": "Google",           "pass_type": "General Pass", "pass_number": gen_pass_number("deeksha.anand29@gmail.com",          "General")},
    {"to_email": "mahimonga04@gmail.com",              "to_name": "Mahi Monga",           "company": "Sprinklr",         "pass_type": "General Pass", "pass_number": gen_pass_number("mahimonga04@gmail.com",              "General")},
    {"to_email": "anchalgarg1995@gmail.com",           "to_name": "Anchal Garg",          "company": "Arintra",          "pass_type": "General Pass", "pass_number": gen_pass_number("anchalgarg1995@gmail.com",           "General")},
]

recipients = paid + comp_premium + comp_general


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
    print(f"  {'paid':>4}  {len(paid)} paid pass holders")
    print(f"  {'comp':>4}  {len(comp_premium)} Premium complimentary")
    print(f"  {'comp':>4}  {len(comp_general)} General complimentary\n")

    ok_count, fail_count = 0, 0
    for r in recipients:
        label = f"{r['to_name']:30s}  {r['pass_type']:14s}  {r['to_email']}"
        print(f"  → {label}", end="  ")
        if send(r):
            print("✓")
            ok_count += 1
        else:
            print("✗ FAILED")
            fail_count += 1
        time.sleep(1)

    print(f"\nDone — {ok_count} sent, {fail_count} failed.")


if __name__ == "__main__":
    main()
