import sys
import json
import joblib
import numpy as np

# Load model and scaler
model = joblib.load('models/fraud_model.pkl')
scaler = joblib.load('models/scaler.pkl')

# Read input from Node.js (30 features)
input_data = json.loads(sys.argv[1])
features = np.array(input_data['features']).reshape(1, -1)

# Scale and predict
features_scaled = scaler.transform(features)
prediction = model.predict(features_scaled)[0]
probability = model.predict_proba(features_scaled)[0][1]  # Probability of fraud (class 1)

# Output result
print(json.dumps({'prediction': int(prediction), 'probability': float(probability)}))