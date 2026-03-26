import google.generativeai as genai

# Replace with your CORRECT key
API_KEY = "AIzaSyC0uYUKFTMCX9rT3N4TTZammwzqysVd-U"  # <-- FIX THIS

print(f"Testing key: {API_KEY[:20]}...")

try:
    genai.configure(api_key=API_KEY)
    
    # List available models
    print("\n✅ API Key accepted!")
    print("\nAvailable models:")
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"  - {m.name}")
    
    # Test with a simple prompt
    model = genai.GenerativeModel("models/gemini-1.5-flash")
    response = model.generate_content("Say 'API key is working!'")
    
    print(f"\n✅ Test successful!")
    print(f"Response: {response.text}")
    
except Exception as e:
    print(f"\n❌ Error: {e}")