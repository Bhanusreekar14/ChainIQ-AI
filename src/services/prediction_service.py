"""
Prediction service for ChainIQ.

Single responsibility: turn a raw API payload into a PredictionResponse.
Route handlers should call this; the ML plumbing (feature_builder +
predict_delay + Pydantic) stays out of the HTTP layer.
"""

from src.api.schemas import PredictionRequest, PredictionResponse
from src.feature_builder import build_features
from src.models.predict_delay import predict_delay


def predict_from_request(request: PredictionRequest) -> PredictionResponse:
    """
    Run the delay prediction pipeline for a validated request.

    Args:
        request: Validated Pydantic request from the HTTP layer.

    Returns:
        PredictionResponse with delay_probability, risk_level, confidence.
    """
    features = build_features(request.model_dump())
    result = predict_delay(features)
    return PredictionResponse(
        delay_probability=result["delay_probability"],
        risk_level=result["risk_level"],
        confidence=result["confidence"],
    )
