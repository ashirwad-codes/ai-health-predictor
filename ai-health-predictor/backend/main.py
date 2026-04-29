from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import google.generativeai as genai
import json
import os
import re
import time
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure Gemini API
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY not found in environment variables. Check your .env file.")

genai.configure(api_key=api_key)

# Multiple models to try in order — if one is rate-limited, try the next
MODEL_NAMES = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-2.5-flash",
    "gemini-flash-lite-latest",
    "gemini-flash-latest",
]

models = {name: genai.GenerativeModel(name) for name in MODEL_NAMES}
print(f"[OK] Loaded {len(models)} Gemini models as fallbacks")

app = FastAPI(title="AI Health Predictor API")

# CORS - Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Data Models ---

class PatientData(BaseModel):
    name: str
    age: int
    gender: str
    location: Optional[str] = None
    weight: Optional[str] = None
    temperature: Optional[str] = None
    blood_pressure: Optional[str] = None

class SymptomsInput(BaseModel):
    symptoms: List[str]
    description: Optional[str] = None
    patient_data: Optional[PatientData] = None
    image_base64: Optional[str] = None

class InterviewAnswers(BaseModel):
    answers: dict

class PredictionRequest(BaseModel):
    symptoms: SymptomsInput
    answers: InterviewAnswers

# --- Helpers ---

def clean_json(text: str) -> str:
    """Strip markdown code fences and leading/trailing whitespace."""
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\s*```$", "", text)
    return text.strip()

def build_image_part(image_base64: str) -> Optional[dict]:
    """Parse base64 data URL into Gemini image part format."""
    try:
        header, encoded = image_base64.split(",", 1)
        mime_type = header.split(":")[1].split(";")[0]
        return {"mime_type": mime_type, "data": encoded}
    except Exception as e:
        print(f"[WARN] Failed to parse image: {e}")
        return None

def get_patient_context(pd: Optional[PatientData]) -> str:
    if not pd:
        return ""
    return (
        f"\n\nPatient Demographics:\n"
        f"  - Age: {pd.age} years old\n"
        f"  - Gender: {pd.gender}\n"
        f"  - Weight: {pd.weight or 'Not provided'}\n"
        f"  - Body Temperature: {pd.temperature or 'Not provided'}\n"
        f"  - Blood Pressure: {pd.blood_pressure or 'Not provided'}\n"
        f"  - Location: {pd.location or 'Not provided'}"
    )

def call_gemini_with_retry(contents, max_retries=1):
    """
    Try each model in the fallback list. If rate-limited (429), skip to next model fast.
    With 5 models and 1 retry each, worst case is ~25 seconds instead of minutes.
    """
    last_error = None
    for model_name, model_instance in models.items():
        for attempt in range(max_retries):
            try:
                print(f"[AI] Trying model: {model_name}")
                response = model_instance.generate_content(contents)
                print(f"[OK] Success with model: {model_name}")
                return response
            except Exception as e:
                last_error = e
                error_str = str(e)
                if "429" in error_str or "quota" in error_str.lower() or "rate" in error_str.lower():
                    print(f"[SKIP] Quota exhausted on {model_name}, trying next model...")
                    break  # Skip to next model immediately
                else:
                    print(f"[ERR] Non-quota error on {model_name}: {e}")
                    break  # Non-rate-limit error, try next model

    raise HTTPException(status_code=429, detail="All AI models exhausted. Your free API quota may be used up for today. Please wait a few minutes and try again.")


# --- Routes ---

@app.get("/")
def read_root():
    return {"status": "AI Health Predictor API is running", "models": MODEL_NAMES}


@app.post("/api/generate-interview")
def generate_interview(data: SymptomsInput):
    """
    Generates 10-12 highly specific clinical multiple-choice questions using Gemini AI.
    """
    symptoms_str = ", ".join(data.symptoms) if data.symptoms else "Not specified"
    description_str = data.description if data.description else "Not provided"
    patient_context = get_patient_context(data.patient_data)

    prompt = f"""You are a senior clinical physician conducting a patient intake interview.
    
Patient Reported Information:
  - Primary Symptoms: {symptoms_str}
  - Patient's Own Description: {description_str}
  {patient_context}

Your task: Generate exactly 10 to 12 precise, clinically relevant multiple-choice questions to ask this patient.
These questions MUST:
1. Be highly specific to the reported symptoms -- NOT generic questions.
2. Help differentiate between possible diagnoses.
3. Investigate symptom onset, duration, severity, triggers, associated symptoms, medical history, and lifestyle factors.
4. Include questions based on the patient's age, gender, and vitals if provided.
5. If an image was uploaded (injury/skin condition), ask about its characteristics (color, texture, spreading, pain level, etc.).

Return ONLY a valid JSON object. No markdown, no explanation, no preamble.
Format:
{{
  "questions": [
    {{"id": "q1", "question": "...", "options": ["Option A", "Option B", "Option C", "Option D"]}},
    ...
  ]
}}"""

    try:
        contents = [prompt]
        if data.image_base64:
            img = build_image_part(data.image_base64)
            if img:
                contents.append(img)

        response = call_gemini_with_retry(contents)
        response_text = clean_json(response.text)
        questions_data = json.loads(response_text)
        print(f"[OK] Generated {len(questions_data.get('questions', []))} interview questions via AI")
        return questions_data

    except Exception as e:
        print(f"[ERR] Error generating interview: {e}")
        first_symptom = data.symptoms[0] if data.symptoms else "your symptoms"
        return {
            "questions": [
                {"id": "q1", "question": f"How long have you been experiencing {first_symptom}?", "options": ["Less than 24 hours", "2-3 days", "About a week", "More than 2 weeks"]},
                {"id": "q2", "question": "On a scale of 1-10, how would you rate the intensity of your discomfort?", "options": ["1-3 (Mild)", "4-6 (Moderate)", "7-8 (Severe)", "9-10 (Unbearable)"]},
                {"id": "q3", "question": "Has the condition been getting worse, better, or staying the same?", "options": ["Rapidly worsening", "Slowly worsening", "Staying the same", "Improving gradually"]},
                {"id": "q4", "question": "Have you experienced a fever or chills along with your symptoms?", "options": ["High fever (above 38.5C)", "Low-grade fever", "Only chills, no fever", "No fever or chills"]},
                {"id": "q5", "question": "Does anything make your symptoms better or worse?", "options": ["Rest makes it better", "Movement makes it worse", "Food or drink affects it", "Nothing changes it"]},
                {"id": "q6", "question": "Have you experienced these symptoms before?", "options": ["Yes, multiple times", "Yes, once before", "Never before", "Similar but not identical"]},
                {"id": "q7", "question": "Are you experiencing any of these additional symptoms?", "options": ["Nausea or vomiting", "Dizziness or lightheadedness", "Shortness of breath", "None of these"]},
                {"id": "q8", "question": "Have you taken any medication for these symptoms?", "options": ["Yes, prescription medication - helped", "Yes, OTC medication - helped", "Yes, but no relief", "No medication taken"]},
                {"id": "q9", "question": "Do you have any pre-existing medical conditions?", "options": ["Diabetes", "Hypertension / Heart disease", "Respiratory conditions (Asthma, COPD)", "No known conditions"]},
                {"id": "q10", "question": "How are your symptoms affecting your daily life?", "options": ["Unable to perform daily tasks", "Significantly affecting routine", "Minor inconvenience", "Not affecting daily life"]},
            ]
        }


@app.post("/api/predict")
def predict_disease(request: PredictionRequest):
    """
    Performs a deep clinical analysis and returns a structured AI-generated diagnosis.
    Uses ALL patient data: symptoms, body parts, description, vitals, location, interview answers, and images.
    """
    data = request.symptoms
    answers = request.answers.answers

    symptoms_str = ", ".join(data.symptoms) if data.symptoms else "Not specified"
    description_str = data.description if data.description else "Not provided"
    patient_context = get_patient_context(data.patient_data)
    answers_str = "\n".join([f"  Q: {k}\n  A: {v}" for k, v in answers.items()])
    
    location_str = (data.patient_data.location if data.patient_data and data.patient_data.location else "me").replace(' ', '+')

    prompt = f"""You are a world-class AI diagnostic physician. Analyze ALL of the following patient data carefully.

=== COMPLETE PATIENT DATA ===

{patient_context}

PRIMARY SYMPTOMS AND AFFECTED BODY PARTS: {symptoms_str}

PATIENT'S OWN DESCRIPTION OF THE PROBLEM: {description_str}

CLINICAL INTERVIEW - PATIENT'S ANSWERS:
{answers_str}

=== YOUR TASK ===

1. Analyze EVERY piece of information above: symptoms, body parts, description, vitals, age, gender, and interview answers.
2. Cross-reference the symptoms and answers to identify the MOST PROBABLE specific medical condition.
3. Provide a detailed clinical summary explaining WHY this diagnosis fits.
4. Give cure methods and precautions that are SPECIFIC to this exact condition (NOT generic advice like "rest" or "hydration").
5. Provide real medical resource links for this specific condition.
6. Generate Google Maps search links for the type of specialist needed.

=== REQUIRED JSON OUTPUT ===

Return ONLY a valid JSON object. No markdown. No backticks. No explanation. Just the JSON:

{{
  "disease": "The specific medical condition name (e.g., Acute Sinusitis, Tension Headache, Contact Dermatitis)",
  "confidence": 75,
  "danger_level": 25,
  "recommendation": "One specific actionable sentence of advice for this patient",
  "emergency": false,
  "summary": "2-3 sentences explaining how the patient's specific symptoms, answers, and vitals point to this diagnosis. Reference their actual data.",
  "cure_methods": [
    "First specific treatment action for this exact condition",
    "Second specific treatment or remedy",
    "Third specific precaution to take",
    "Fourth specific lifestyle change or measure",
    "Fifth specific thing to watch for or avoid"
  ],
  "clinic_link": "https://www.google.com/maps/search/[correct specialist type]+near+{location_str}",
  "useful_resources": [
    "Mayo Clinic - [Condition Name] Overview: https://www.mayoclinic.org/diseases-conditions/",
    "WebMD - [Condition Name] Symptoms and Treatment: https://www.webmd.com/",
    "NHS - [Condition Name] Information: https://www.nhs.uk/conditions/"
  ],
  "nearby_specialists": [
    "Search [Specialist Type] near you: https://www.google.com/maps/search/[specialist]+near+{location_str}",
    "Search General Physician near you: https://www.google.com/maps/search/general+physician+near+{location_str}"
  ]
}}"""

    try:
        contents = [prompt]
        if data.image_base64:
            img = build_image_part(data.image_base64)
            if img:
                contents.append(img)

        response = call_gemini_with_retry(contents)
        response_text = clean_json(response.text)
        prediction_data = json.loads(response_text)
        print(f"[OK] AI Prediction: {prediction_data.get('disease')} (confidence: {prediction_data.get('confidence')}%)")
        return prediction_data

    except Exception as e:
        print(f"[ERR] Error predicting disease: {e}")
        return {
            "disease": f"AI Quota Exhausted - Please wait 1 minute and retry",
            "confidence": 0,
            "danger_level": 0,
            "recommendation": "Your free Gemini API quota is temporarily used up. Please wait about 60 seconds and click 'New Assessment' to try again.",
            "emergency": False,
            "summary": f"The AI could not process your request due to API rate limits. Error: {str(e)[:150]}",
            "cure_methods": [
                "Wait 60 seconds for the API quota to reset",
                "Click 'New Assessment' and re-submit your symptoms",
                "If this keeps happening, consider upgrading to a paid Gemini API plan at https://ai.google.dev",
                "Meanwhile, consult a doctor directly for urgent concerns"
            ],
            "clinic_link": f"https://www.google.com/maps/search/doctor+near+{location_str}",
            "useful_resources": [
                "Mayo Clinic - Symptom Checker: https://www.mayoclinic.org/symptom-checker",
                "WebMD - Medical Encyclopedia: https://www.webmd.com"
            ],
            "nearby_specialists": [
                f"Find doctors near you: https://www.google.com/maps/search/doctor+near+{location_str}"
            ]
        }


@app.post("/api/generate-report")
def generate_report(request: PredictionRequest):
    """
    Generates a professional, detailed clinical report in Markdown format for download.
    """
    data = request.symptoms
    answers = request.answers.answers

    symptoms_str = ", ".join(data.symptoms) if data.symptoms else "Not specified"
    description_str = data.description if data.description else "Not provided"
    patient_context = get_patient_context(data.patient_data)
    answers_str = "\n".join([f"  - **Q:** {k}\n    **A:** {v}" for k, v in answers.items()])
    
    patient_name = data.patient_data.name if data.patient_data else "Patient"

    prompt = f"""You are a senior medical consultant. Write a complete, professional clinical assessment report in Markdown format.

PATIENT DATA COLLECTED:
{patient_context}

PRIMARY SYMPTOMS: {symptoms_str}
PATIENT DESCRIPTION: {description_str}

CLINICAL INTERVIEW RESPONSES:
{answers_str}

Write a detailed, professional Markdown report. It must look like a real clinical document prepared by a senior physician. Include:

# CLINICAL ASSESSMENT REPORT
**Patient:** {patient_name} | **Date:** [Today's Date]
**Report Type:** AI-Assisted Diagnostic Assessment

---

## 1. Clinical Overview
(Summarize what the patient reported, key symptoms, and context)

## 2. Differential Diagnosis
(List the top 3 possible conditions in order of likelihood. For each, explain WHY the symptoms point to it)

## 3. Most Probable Diagnosis
(State your primary diagnosis and the clinical reasoning)

## 4. Risk Assessment
(Assess urgency: Is this an emergency? Mild? Moderate? Use the vitals and symptoms to justify)

## 5. Recommended Immediate Actions
(Numbered list of specific, actionable steps the patient should take NOW)

## 6. Precautions and Lifestyle Measures
(Specific do's and don'ts for this condition)

## 7. Medications to Discuss With Your Doctor
(Common medications or treatments associated with this condition -- note: for discussion only)

## 8. Specialist Referral Recommendation
(Which specialist should the patient see and why)

## 9. Follow-Up Guidelines
(When to seek emergency care, when to return for follow-up)

---
*Report generated by AI Health Predictor -- This is an AI-assisted assessment and does not replace professional medical diagnosis.*

Be thorough, specific, and clinically accurate. Do NOT use generic or placeholder text."""

    try:
        response = call_gemini_with_retry([prompt])
        print(f"[OK] AI Medical Report generated for patient: {patient_name}")
        return {"report": response.text}
    except Exception as e:
        print(f"[ERR] Error generating report: {e}")
        return {"report": f"# Report Generation Error\n\nThe AI encountered an issue: {str(e)}\n\nPlease wait 60 seconds for the API quota to reset, then try again."}
