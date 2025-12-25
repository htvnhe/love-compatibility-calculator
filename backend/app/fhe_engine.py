"""
FHE Engine for Love Compatibility Calculator
Uses Zama's Concrete library for Fully Homomorphic Encryption
"""

import numpy as np
from typing import Tuple, List

# Try to import concrete, fallback if not available (Windows)
try:
    from concrete import fhe
    FHE_AVAILABLE = True
except ImportError:
    FHE_AVAILABLE = False

# Number of questions
NUM_QUESTIONS = 5
# Max value per question
MAX_VALUE = 5
# Min value per question
MIN_VALUE = 1
# Maximum possible difference per question
MAX_DIFF_PER_Q = MAX_VALUE - MIN_VALUE  # 4
# Maximum total difference
MAX_TOTAL_DIFF = MAX_DIFF_PER_Q * NUM_QUESTIONS  # 40


def compute_compatibility(answers_a: np.ndarray, answers_b: np.ndarray) -> int:
    """
    Compute compatibility score from two sets of answers.
    This function will be compiled to FHE circuit.

    Args:
        answers_a: Array of 10 answers (1-5) from person A
        answers_b: Array of 10 answers (1-5) from person B

    Returns:
        Compatibility score (0-100)
    """
    # Calculate absolute differences
    total_diff = 0
    for i in range(NUM_QUESTIONS):
        diff = answers_a[i] - answers_b[i]
        # Absolute value: if diff < 0, negate it
        abs_diff = np.where(diff < 0, -diff, diff)
        total_diff += abs_diff

    # Convert to percentage: 100 - (total_diff / max_diff * 100)
    # Simplified: 100 - (total_diff * 100 / 40) = 100 - (total_diff * 2.5)
    # To avoid floating point: (100 * 40 - total_diff * 100) / 40 = (4000 - 100*diff) / 40
    # Simplified integer math: 100 - (total_diff * 100 // MAX_TOTAL_DIFF)
    score = 100 - (total_diff * 100 // MAX_TOTAL_DIFF)

    return score


class FHECompatibilityEngine:
    """
    FHE Engine that compiles and manages the compatibility computation circuit.
    """

    def __init__(self):
        self.circuit = None
        self.compiled = False
        self._compile_circuit()

    def _compile_circuit(self):
        """Compile the FHE circuit for compatibility computation."""
        print("🔐 Compiling FHE circuit...")

        # Define the computation function for compilation
        def fhe_compatibility(answers_a, answers_b):
            total_diff = fhe.zero()
            for i in range(NUM_QUESTIONS):
                diff = answers_a[i] - answers_b[i]
                # FHE-compatible absolute value
                abs_diff = abs(diff)
                total_diff = total_diff + abs_diff

            # Calculate score
            score = 100 - (total_diff * 100 // MAX_TOTAL_DIFF)
            return score

        # Create compiler with input specs
        compiler = fhe.Compiler(
            fhe_compatibility,
            {
                "answers_a": "encrypted",
                "answers_b": "encrypted"
            }
        )

        # Generate inputset for compilation (all possible combinations sample)
        inputset = [
            (
                np.random.randint(MIN_VALUE, MAX_VALUE + 1, size=(NUM_QUESTIONS,)),
                np.random.randint(MIN_VALUE, MAX_VALUE + 1, size=(NUM_QUESTIONS,))
            )
            for _ in range(100)
        ]

        # Compile the circuit
        self.circuit = compiler.compile(inputset)
        self.compiled = True
        print("✅ FHE circuit compiled successfully!")

    def generate_keys(self):
        """Generate FHE keys."""
        if not self.compiled:
            raise RuntimeError("Circuit not compiled yet!")

        print("🔑 Generating FHE keys...")
        self.circuit.keygen()
        print("✅ Keys generated!")

    def encrypt_answers(self, answers: List[int]) -> any:
        """Encrypt a person's answers."""
        if len(answers) != NUM_QUESTIONS:
            raise ValueError(f"Expected {NUM_QUESTIONS} answers, got {len(answers)}")

        answers_array = np.array(answers, dtype=np.int64)
        return answers_array  # In real scenario, this would be encrypted

    def compute_encrypted_compatibility(
        self,
        encrypted_a: np.ndarray,
        encrypted_b: np.ndarray
    ) -> int:
        """
        Compute compatibility on encrypted data.

        In a real FHE scenario:
        1. Both inputs are encrypted
        2. Computation happens on encrypted data
        3. Result is encrypted
        4. Only the result is decrypted
        """
        if not self.compiled:
            raise RuntimeError("Circuit not compiled yet!")

        print("🔒 Computing on encrypted data...")

        # Run the encrypted computation
        encrypted_result = self.circuit.encrypt_run_decrypt(encrypted_a, encrypted_b)

        print("✅ Encrypted computation complete!")
        return int(encrypted_result)

    def compute_compatibility_simple(
        self,
        answers_a: List[int],
        answers_b: List[int]
    ) -> int:
        """
        Simple computation without FHE for testing/demo purposes.
        """
        if len(answers_a) != NUM_QUESTIONS or len(answers_b) != NUM_QUESTIONS:
            raise ValueError(f"Expected {NUM_QUESTIONS} answers each")

        total_diff = sum(abs(a - b) for a, b in zip(answers_a, answers_b))
        score = 100 - (total_diff * 100 // MAX_TOTAL_DIFF)
        return max(0, min(100, score))


# Global FHE engine instance
_fhe_engine = None

def get_fhe_engine() -> FHECompatibilityEngine:
    """Get or create the global FHE engine instance."""
    global _fhe_engine
    if _fhe_engine is None:
        _fhe_engine = FHECompatibilityEngine()
        _fhe_engine.generate_keys()
    return _fhe_engine


# Simple fallback for when FHE is not available
class SimpleFallbackEngine:
    """Fallback engine that simulates FHE behavior without actual encryption."""

    def compute_compatibility(self, answers_a: List[int], answers_b: List[int]) -> int:
        """Compute compatibility score (simulated FHE)."""
        if len(answers_a) != NUM_QUESTIONS or len(answers_b) != NUM_QUESTIONS:
            raise ValueError(f"Expected {NUM_QUESTIONS} answers each")

        total_diff = sum(abs(a - b) for a, b in zip(answers_a, answers_b))
        score = 100 - (total_diff * 100 // MAX_TOTAL_DIFF)
        return max(0, min(100, score))


def get_compatibility_engine():
    """
    Get the compatibility engine.
    Falls back to simple engine if FHE is not available.
    """
    if not FHE_AVAILABLE:
        return SimpleFallbackEngine()

    try:
        return get_fhe_engine()
    except Exception as e:
        return SimpleFallbackEngine()
