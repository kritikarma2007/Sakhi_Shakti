"""
SakhiShakti ML Model Trainer
Trains PCOS and Menstrual Cycle prediction models.
Auto-generates synthetic data if Kaggle CSVs are not present.
"""
import os
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, mean_absolute_error
import joblib

DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
MODEL_DIR = os.path.dirname(__file__)

os.makedirs(DATA_DIR, exist_ok=True)

# ─────────────────────────────────────────────
# 1. PCOS MODEL
# ─────────────────────────────────────────────

def generate_pcos_data(n=600):
    """Generate realistic synthetic PCOS dataset matching Kaggle schema."""
    np.random.seed(42)
    n_pcos = n // 2
    n_no = n - n_pcos

    def gen_group(n_samples, pcos=True):
        age = np.random.randint(18, 42, n_samples)
        bmi = np.random.normal(28.5 if pcos else 23.0, 4.0, n_samples).clip(16, 45)
        cycle_ri = np.random.choice([0, 1], n_samples, p=[0.2, 0.8] if pcos else [0.75, 0.25])  # 1=Irregular
        cycle_len = np.random.randint(28, 60 if pcos else 35, n_samples)
        weight_gain = np.random.choice([0, 1], n_samples, p=[0.2, 0.8] if pcos else [0.75, 0.25])
        hair_growth = np.random.choice([0, 1], n_samples, p=[0.3, 0.7] if pcos else [0.85, 0.15])
        skin_dark = np.random.choice([0, 1], n_samples, p=[0.35, 0.65] if pcos else [0.80, 0.20])
        pimples = np.random.choice([0, 1], n_samples, p=[0.3, 0.7] if pcos else [0.70, 0.30])
        fast_food = np.random.choice([0, 1], n_samples, p=[0.2, 0.8] if pcos else [0.55, 0.45])
        label = np.ones(n_samples, dtype=int) if pcos else np.zeros(n_samples, dtype=int)
        return pd.DataFrame({
            'Age (yrs)': age, 'BMI': bmi, 'Cycle(R/I)': cycle_ri,
            'Cycle length(days)': cycle_len, 'Weight gain(Y/N)': weight_gain,
            'hair growth(Y/N)': hair_growth, 'Skin darkening (Y/N)': skin_dark,
            'Pimples(Y/N)': pimples, 'Fast food (Y/N)': fast_food,
            'PCOS (Y/N)': label
        })

    df = pd.concat([gen_group(n_pcos, True), gen_group(n_no, False)], ignore_index=True)
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)
    # Introduce ~5% missing values for realism
    for col in ['BMI', 'Cycle length(days)']:
        mask = np.random.random(len(df)) < 0.05
        df.loc[mask, col] = np.nan
    return df


def load_or_generate_pcos():
    csv_path = os.path.join(DATA_DIR, 'PCOS_data.csv')
    xlsx_path = os.path.join(DATA_DIR, 'PCOS_data.xlsx')
    if os.path.exists(csv_path):
        print(f'[PCOS] Loading real Kaggle data from {csv_path}')
        return pd.read_csv(csv_path)
    elif os.path.exists(xlsx_path):
        print(f'[PCOS] Loading real Kaggle data from {xlsx_path}')
        return pd.read_excel(xlsx_path)
    else:
        print('[PCOS] Kaggle data not found — generating 600-row synthetic dataset...')
        df = generate_pcos_data(600)
        df.to_csv(csv_path, index=False)
        print(f'[PCOS] Synthetic data saved to {csv_path}')
        return df


def train_pcos_model():
    df = load_or_generate_pcos()
    FEATURES = [
        'Age (yrs)', 'BMI', 'Cycle(R/I)', 'Cycle length(days)',
        'Weight gain(Y/N)', 'hair growth(Y/N)', 'Skin darkening (Y/N)',
        'Pimples(Y/N)', 'Fast food (Y/N)'
    ]
    TARGET = 'PCOS (Y/N)'
    # Keep only columns that exist
    available_features = [f for f in FEATURES if f in df.columns]
    df_clean = df[available_features + [TARGET]].dropna(subset=[TARGET])

    X = df_clean[available_features]
    y = df_clean[TARGET].astype(int)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    pipeline = Pipeline([
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler()),
        ('clf', RandomForestClassifier(n_estimators=200, max_depth=8, random_state=42, class_weight='balanced'))
    ])

    pipeline.fit(X_train, y_train)
    y_pred = pipeline.predict(X_test)
    print('[PCOS] Classification Report:')
    print(classification_report(y_test, y_pred, target_names=['No PCOS', 'PCOS']))

    model_path = os.path.join(MODEL_DIR, 'pcos_model.pkl')
    joblib.dump({'pipeline': pipeline, 'features': available_features}, model_path)
    print(f'[PCOS] Model saved to {model_path}')
    return pipeline, available_features


# ─────────────────────────────────────────────
# 2. MENSTRUAL CYCLE MODEL
# ─────────────────────────────────────────────

def generate_cycle_data(n=600):
    """Generate realistic synthetic menstrual cycle dataset matching Kaggle schema."""
    np.random.seed(123)
    cycle_numbers = np.random.randint(1, 10, n)
    mean_cycle = np.random.normal(28, 3.5, n).clip(21, 45)
    length_cycle = (mean_cycle + np.random.normal(0, 2.5, n)).clip(21, 45).astype(int)
    length_menses = np.random.randint(3, 8, n)
    age = np.random.randint(18, 48, n)

    df = pd.DataFrame({
        'CycleNumber': cycle_numbers,
        'LengthofCycle': length_cycle,
        'LengthofMenses': length_menses,
        'MeanCycleLength': mean_cycle.round(1),
        'Age': age
    })
    # Introduce small noise / missing values
    for col in ['MeanCycleLength']:
        mask = np.random.random(len(df)) < 0.04
        df.loc[mask, col] = np.nan
    return df


def load_or_generate_cycle():
    csv_path = os.path.join(DATA_DIR, 'menstrual_cycle.csv')
    if os.path.exists(csv_path):
        print(f'[Cycle] Loading real Kaggle data from {csv_path}')
        return pd.read_csv(csv_path)
    else:
        print('[Cycle] Kaggle data not found — generating 600-row synthetic dataset...')
        df = generate_cycle_data(600)
        df.to_csv(csv_path, index=False)
        print(f'[Cycle] Synthetic data saved to {csv_path}')
        return df


def train_cycle_model():
    df = load_or_generate_cycle()
    FEATURES = ['CycleNumber', 'LengthofMenses', 'MeanCycleLength', 'Age']
    TARGET = 'LengthofCycle'

    available_features = [f for f in FEATURES if f in df.columns]
    df_clean = df[available_features + [TARGET]].dropna(subset=[TARGET])

    X = df_clean[available_features]
    y = df_clean[TARGET].astype(float)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    pipeline = Pipeline([
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler()),
        ('reg', GradientBoostingRegressor(n_estimators=200, max_depth=4, learning_rate=0.08, random_state=42))
    ])

    pipeline.fit(X_train, y_train)
    y_pred = pipeline.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    print(f'[Cycle] Mean Absolute Error: {mae:.2f} days')

    model_path = os.path.join(MODEL_DIR, 'cycle_model.pkl')
    joblib.dump({'pipeline': pipeline, 'features': available_features}, model_path)
    print(f'[Cycle] Model saved to {model_path}')
    return pipeline, available_features


if __name__ == '__main__':
    print('=' * 60)
    print('SakhiShakti ML Model Trainer')
    print('=' * 60)
    print()
    print('Training PCOS Risk Prediction Model...')
    train_pcos_model()
    print()
    print('Training Menstrual Cycle Prediction Model...')
    train_cycle_model()
    print()
    print('=' * 60)
    print('All models trained and saved successfully!')
    print('  pcos_model.pkl  — PCOS risk classifier')
    print('  cycle_model.pkl — Cycle length regressor')
    print('=' * 60)
