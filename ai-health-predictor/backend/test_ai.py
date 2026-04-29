import os, json, re, time
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

MODEL_NAMES = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-2.5-flash",
    "gemini-flash-lite-latest",
    "gemini-flash-latest",
]

models_dict = {name: genai.GenerativeModel(name) for name in MODEL_NAMES}

def call_gemini_with_retry(contents, max_retries=2):
    last_error = None
    for model_name, model_instance in models_dict.items():
        for attempt in range(max_retries):
            try:
                print(f"[AI] Trying model: {model_name} (attempt {attempt + 1})")
                response = model_instance.generate_content(contents)
                print(f"[OK] Success with model: {model_name}")
                return response
            except Exception as e:
                last_error = e
                error_str = str(e)
                if "429" in error_str or "quota" in error_str.lower():
                    wait_match = re.search(r"retry in (\d+\.?\d*)", error_str, re.IGNORECASE)
                    wait_time = min(float(wait_match.group(1)), 15) if wait_match else 3
                    if attempt < max_retries - 1:
                        print(f"[WAIT] Rate limited, waiting {wait_time:.0f}s...")
                        time.sleep(wait_time)
                    else:
                        print(f"[SKIP] Quota exhausted on {model_name}, trying next...")
                        break
                else:
                    print(f"[ERR] {model_name}: {e}")
                    break
    raise Exception(f"All models exhausted. Last: {last_error}")

prompt = "Return only valid JSON: {\"test\": \"success\", \"message\": \"AI is working\"}"

try:
    response = call_gemini_with_retry([prompt])
    text = response.text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\s*```$", "", text)
    data = json.loads(text)
    print(f"\nFINAL RESULT: {json.dumps(data)}")
except Exception as e:
    print(f"\nFAILED: {e}")
