from typing import Dict, Any, List, Optional

def verify_resolution_fallback(
    description: str,
    category: str,
    resolution_notes: str,
    before_images: Optional[List[str]] = None,
    after_images: Optional[List[str]] = None,
    team_name: Optional[str] = "Municipal Response Team"
) -> Dict[str, Any]:
    notes_lower = resolution_notes.lower()
    
    # Check if officer notes provide genuine detail
    detailed = len(resolution_notes) >= 15 and any(w in notes_lower for w in [
        "replaced", "repaired", "cleaned", "cleared", "fixed", "restored", "resurfaced", 
        "patched", "unblocked", "inspected", "completed", "installed", "rectified"
    ])
    
    has_after_image = bool(after_images and len(after_images) > 0)
    
    verified = detailed or has_after_image
    confidence = 0.92 if (detailed and has_after_image) else (0.82 if detailed else 0.70)
    
    verif_notes = "Officer provided detailed resolution notes and visual completion evidence." if (detailed and has_after_image) else \
                  "Resolution verified based on officer work logs and reported action items."
                  
    citizen_explanation = f"The reported {category.lower()} issue has been resolved by the {team_name}. " \
                          f"Action taken: {resolution_notes.strip()}."
                          
    return {
        "verified": verified,
        "confidence": confidence,
        "verificationNotes": verif_notes,
        "citizenExplanation": citizen_explanation
    }
