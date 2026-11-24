"""
SakhiShakti ML Service — FastAPI
Ports: 8000
Endpoints: /health, /predict-pcos, /predict-cycle
"""
import os
import math
import joblib
import numpy as np
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional

app = FastAPI(
    title='SakhiShakti ML Service',
    description='PCOS Risk & Menstrual Cycle Prediction API',
    version='1.0.0'
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

BASE_DIR = os.path.dirname(__file__)

# ─────────────────────────────────────────────
# Model Loading with graceful fallback
# ─────────────────────────────────────────────

def load_model(name: str):
    path = os.path.join(BASE_DIR, f'{name}.pkl')
    if os.path.exists(path):
        return joblib.load(path)
    return None

pcos_artifact = load_model('pcos_model')
cycle_artifact = load_model('cycle_model')


# ─────────────────────────────────────────────
# Request / Response Models
# ─────────────────────────────────────────────

class PCOSInput(BaseModel):
    age: float = Field(..., example=25, ge=10, le=60)
    weight_kg: float = Field(..., example=68, ge=20, le=200)
    height_cm: float = Field(..., example=158, ge=100, le=220)
    cycle_irregular: int = Field(..., example=1, description='0=Regular, 1=Irregular')
    cycle_length_days: Optional[float] = Field(None, example=35)
    weight_gain: int = Field(..., example=1, description='0=No, 1=Yes')
    hair_growth: int = Field(..., example=1, description='0=No, 1=Yes')
    skin_darkening: int = Field(..., example=1, description='0=No, 1=Yes')
    pimples: int = Field(..., example=0, description='0=No, 1=Yes')
    fast_food: int = Field(..., example=1, description='0=No, 1=Yes')


class PCOSResponse(BaseModel):
    bmi: float
    bmi_category: str
    risk_score: float
    risk_level: str  # LOW / MODERATE / HIGH
    guidance_en: str
    guidance_hi: str
    disclaimer_en: str
    disclaimer_hi: str


class CycleInput(BaseModel):
    last_period_date: str = Field(..., example='2024-05-01', description='YYYY-MM-DD')
    cycle_number: int = Field(1, example=3)
    length_of_menses: float = Field(5, example=5, ge=1, le=14)
    mean_cycle_length: Optional[float] = Field(None, example=28)
    age: float = Field(..., example=24, ge=10, le=60)


class CycleResponse(BaseModel):
    predicted_cycle_length: float
    next_period_date: str
    ovulation_date: str
    fertile_window_start: str
    fertile_window_end: str
    luteal_phase_days: int
    irregularity_alert: bool
    alert_message_en: str
    alert_message_hi: str


# ─────────────────────────────────────────────
# Guidance Texts
# ─────────────────────────────────────────────

GUIDANCE = {
    'LOW': {
        'en': 'Your PCOS risk appears LOW. Maintain a balanced diet rich in whole grains, vegetables, and lean proteins. Regular exercise (30 min/day) is beneficial. Continue regular annual check-ups.',
        'hi': 'आपका PCOS जोखिम कम प्रतीत होता है। साबुत अनाज, सब्जियों और प्रोटीन से भरपूर संतुलित आहार लें। रोजाना 30 मिनट व्यायाम करें। वार्षिक स्वास्थ्य जांच जारी रखें।'
    },
    'MODERATE': {
        'en': 'Your PCOS risk is MODERATE. We recommend consulting a gynaecologist for a formal evaluation (ultrasound + hormone panel). Lifestyle changes — reduced sugar intake, regular exercise, and stress management — can significantly help.',
        'hi': 'आपका PCOS जोखिम मध्यम है। कृपया एक स्त्री रोग विशेषज्ञ से मिलें (अल्ट्रासाउंड + हार्मोन जांच)। चीनी कम करें, नियमित व्यायाम करें और तनाव प्रबंधन अपनाएं।'
    },
    'HIGH': {
        'en': 'Your PCOS risk appears HIGH. Please consult a gynaecologist or endocrinologist at the earliest. PCOS is manageable with proper medical care and lifestyle changes. Do not delay seeking help.',
        'hi': 'आपका PCOS जोखिम अधिक है। कृपया जल्द से जल्द किसी स्त्री रोग विशेषज्ञ या एंडोक्रिनोलॉजिस्ट से मिलें। उचित चिकित्सा देखभाल और जीवनशैली में बदलाव से PCOS नियंत्रणीय है।'
    }
}

DISCLAIMER_EN = ('This AI screening tool is for informational purposes only and is NOT a medical diagnosis. '
                 'Always consult a qualified healthcare professional before making health decisions.')
DISCLAIMER_HI = ('यह AI स्क्रीनिंग उपकरण केवल सूचना के उद्देश्य से है और यह चिकित्सीय निदान नहीं है। '
                 'स्वास्थ्य संबंधी निर्णय लेने से पहले हमेशा किसी योग्य स्वास्थ्य पेशेवर से परामर्श करें।')


def calculate_bmi(weight_kg: float, height_cm: float) -> tuple[float, str]:
    bmi = weight_kg / ((height_cm / 100) ** 2)
    bmi = round(bmi, 1)
    if bmi < 18.5:
        cat = 'Underweight'
    elif bmi < 25:
        cat = 'Normal'
    elif bmi < 30:
        cat = 'Overweight'
    else:
        cat = 'Obese'
    return bmi, cat


# ─────────────────────────────────────────────
# Endpoints
# ─────────────────────────────────────────────

@app.get('/health')
def health_check():
    return {
        'status': 'ok',
        'service': 'SakhiShakti ML Service',
        'models_loaded': {
            'pcos': pcos_artifact is not None,
            'cycle': cycle_artifact is not None
        }
    }


@app.post('/predict-pcos', response_model=PCOSResponse)
def predict_pcos(data: PCOSInput):
    bmi, bmi_cat = calculate_bmi(data.weight_kg, data.height_cm)

    if pcos_artifact is None:
        # Rule-based fallback if model not trained yet
        score = 0.0
        if data.cycle_irregular: score += 0.25
        if data.weight_gain: score += 0.20
        if data.hair_growth: score += 0.20
        if data.skin_darkening: score += 0.15
        if data.pimples: score += 0.10
        if bmi > 27: score += 0.10
    else:
        pipeline = pcos_artifact['pipeline']
        features = pcos_artifact['features']
        input_map = {
            'Age (yrs)': data.age, 'BMI': bmi,
            'Cycle(R/I)': data.cycle_irregular,
            'Cycle length(days)': data.cycle_length_days or 28,
            'Weight gain(Y/N)': data.weight_gain,
            'hair growth(Y/N)': data.hair_growth,
            'Skin darkening (Y/N)': data.skin_darkening,
            'Pimples(Y/N)': data.pimples,
            'Fast food (Y/N)': data.fast_food
        }
        import pandas as pd
        X = pd.DataFrame([[input_map.get(f, 0) for f in features]], columns=features)
        proba = pipeline.predict_proba(X)[0]
        score = float(proba[1])  # probability of PCOS

    if score < 0.35:
        level = 'LOW'
    elif score < 0.65:
        level = 'MODERATE'
    else:
        level = 'HIGH'

    return PCOSResponse(
        bmi=bmi, bmi_category=bmi_cat,
        risk_score=round(score * 100, 1),
        risk_level=level,
        guidance_en=GUIDANCE[level]['en'],
        guidance_hi=GUIDANCE[level]['hi'],
        disclaimer_en=DISCLAIMER_EN,
        disclaimer_hi=DISCLAIMER_HI
    )


@app.post('/predict-cycle', response_model=CycleResponse)
def predict_cycle(data: CycleInput):
    try:
        last_date = datetime.strptime(data.last_period_date, '%Y-%m-%d')
    except ValueError:
        raise HTTPException(status_code=400, detail='Invalid date format. Use YYYY-MM-DD')

    if cycle_artifact is None:
        # Fallback: use standard 28-day cycle
        predicted_len = 28.0
    else:
        pipeline = cycle_artifact['pipeline']
        features = cycle_artifact['features']
        mean_cl = data.mean_cycle_length or 28.0
        input_map = {
            'CycleNumber': data.cycle_number,
            'LengthofMenses': data.length_of_menses,
            'MeanCycleLength': mean_cl,
            'Age': data.age
        }
        import pandas as pd
        X = pd.DataFrame([[input_map.get(f, 0) for f in features]], columns=features)
        predicted_len = float(pipeline.predict(X)[0])
        predicted_len = round(max(21, min(45, predicted_len)), 1)

    luteal_phase = 14  # Standard clinical luteal phase
    ovulation_day = int(predicted_len) - luteal_phase
    ovulation_day = max(10, min(ovulation_day, int(predicted_len) - 10))

    next_period = last_date + timedelta(days=int(predicted_len))
    ovulation_date = last_date + timedelta(days=ovulation_day)
    fertile_start = ovulation_date - timedelta(days=5)
    fertile_end = ovulation_date + timedelta(days=1)

    # Irregularity alert if predicted length is outside 24–35 day normal range
    irregular = predicted_len < 24 or predicted_len > 35
    if irregular:
        alert_en = f'Your predicted cycle length ({predicted_len:.0f} days) is outside the typical 24–35 day range. Consider consulting a gynaecologist.'
        alert_hi = f'आपकी अनुमानित चक्र लंबाई ({predicted_len:.0f} दिन) सामान्य 24-35 दिन की सीमा से बाहर है। कृपया स्त्री रोग विशेषज्ञ से परामर्श करें।'
    else:
        alert_en = 'Your cycle appears within normal range.'
        alert_hi = 'आपका चक्र सामान्य सीमा के भीतर प्रतीत होता है।'

    return CycleResponse(
        predicted_cycle_length=predicted_len,
        next_period_date=next_period.strftime('%Y-%m-%d'),
        ovulation_date=ovulation_date.strftime('%Y-%m-%d'),
        fertile_window_start=fertile_start.strftime('%Y-%m-%d'),
        fertile_window_end=fertile_end.strftime('%Y-%m-%d'),
        luteal_phase_days=luteal_phase,
        irregularity_alert=irregular,
        alert_message_en=alert_en,
        alert_message_hi=alert_hi
    )
