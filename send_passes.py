"""
GPF 2026 — Bulk General Pass issuer
Submits each member to Web3Forms so:
  1. Every entry is recorded in your Web3Forms dashboard
  2. If "Confirmation Email" is ON in your Web3Forms settings,
     each member also receives a pass confirmation email automatically.

To enable member confirmation emails:
  → Log in to web3forms.com → Settings → Enable "Auto-reply / Confirmation Email"
  → Set the reply subject + body once — it goes to every submitter's email.

Run: python3 send_passes.py
"""

import time
import json
import urllib.request
import urllib.error

WEB3FORMS_KEY = "05343d66-4685-49cf-ba57-e57dbf8a2bf1"
API_URL = "https://api.web3forms.com/submit"

members = [
    {"First Name": "Swathi",        "Last Name": "Chirravuri",    "Company": "Stealth Startup",  "Role": "AI Product Manager",              "Email": "swathi.chirravuri@gmail.com"},
    {"First Name": "Aditi",         "Last Name": "Rajesh",        "Company": "Hashfame",         "Role": "Product Manager",                 "Email": "Aditirajesh1234@gmail.com"},
    {"First Name": "Priyadarshini", "Last Name": "M",             "Company": "SES Satellite",    "Role": "Product Manager",                 "Email": "priya1687@gmail.com"},
    {"First Name": "Sonika",        "Last Name": "Panghal",       "Company": "Godrej Capital",   "Role": "Product Manager MarTech",         "Email": "Sonikap70@gmail.com"},
    {"First Name": "Khyaati",       "Last Name": "Jindal",        "Company": "Apple",            "Role": "AI Engineer",                     "Email": "khyaatijindal@gmail.com"},
    {"First Name": "Sangeetha",     "Last Name": "Balakrishnan",  "Company": "Workday",          "Role": "Product Manager",                 "Email": "Sangeetha.balakrishnan.k@gmail.com"},  # verify email spelling
    {"First Name": "Shubhodaye",    "Last Name": "Hiremath",      "Company": "Freelancer",       "Role": "Software Tester",                 "Email": "Shubhodaye@gmail.com"},
    {"First Name": "Nidhi",         "Last Name": "Bartakke",      "Company": "Target",           "Role": "Sr Data Analyst",                 "Email": "nidhbartakke@gmail.com"},
    {"First Name": "Vishwajeet",    "Last Name": "Jonnada",       "Company": "CGI",              "Role": "Technical Product Owner",         "Email": "jonnada.vishwajeet@gmail.com"},
    {"First Name": "Deeksha",       "Last Name": "Anand",         "Company": "Google",           "Role": "Senior Product Marketing Manager","Email": "deeksha.anand29@gmail.com"},
    {"First Name": "Mahi",          "Last Name": "Monga",         "Company": "Sprinklr",         "Role": "AI Product Manager",              "Email": "mahimonga04@gmail.com"},
    {"First Name": "Anchal",        "Last Name": "Garg",          "Company": "Arintra",          "Role": "Senior AI Product Manager",       "Email": "anchalgarg1995@gmail.com"},
]

def submit(member: dict) -> bool:
    name = f"{member['First Name']} {member['Last Name']}"
    payload = {
        "access_key":  WEB3FORMS_KEY,
        "subject":     f"GPF 2026 — General Pass Issued: {name}",
        "from_name":   "The Great Product Festival 2026",
        "name":        name,
        "email":       member["Email"],
        "Pass Type":   "General Pass",
        "Company":     member["Company"],
        "Role":        member["Role"],
        "Event":       "The Great Product Festival 2026",
        "Event Date":  "25–26 September 2026",
        "Venue":       "RMZ Ecoworld, Bangalore",
        "Message":     (
            f"Hi {member['First Name']},\n\n"
            "Your complimentary General Pass for The Great Product Festival 2026 has been issued.\n\n"
            "Event: The Great Product Festival 2026\n"
            "Date:  25–26 September 2026\n"
            "City:  RMZ Ecoworld, Bangalore\n\n"
            "See you there!\n"
            "— Team GPF 2026"
        ),
    }
    data = json.dumps(payload).encode()
    req  = urllib.request.Request(API_URL, data=data, headers={
        "Content-Type": "application/json",
        "Referer":      "https://thegreatproductfestival.com",
        "Origin":       "https://thegreatproductfestival.com",
    })
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            result = json.loads(resp.read())
            return result.get("success", False)
    except Exception as e:
        print(f"  ERROR: {e}")
        return False

def main():
    print(f"Submitting {len(members)} General Passes to Web3Forms…\n")
    ok, fail = 0, 0
    for m in members:
        name = f"{m['First Name']} {m['Last Name']}"
        print(f"  → {name:30s}  {m['Email']}", end="  ")
        if submit(m):
            print("✓")
            ok += 1
        else:
            print("✗ FAILED")
            fail += 1
        time.sleep(1.2)   # stay within Web3Forms rate limit

    print(f"\nDone — {ok} succeeded, {fail} failed.")
    if fail:
        print("Re-run for any failed entries or check your Web3Forms dashboard.")

if __name__ == "__main__":
    main()
