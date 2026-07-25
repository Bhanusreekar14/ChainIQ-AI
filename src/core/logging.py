"""
Centralized logging configuration for ChainIQ AI.
"""

import logging
import sys

# Configure standard root formatting
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)

# Application logger instance
logger = logging.getLogger("chainiq")
