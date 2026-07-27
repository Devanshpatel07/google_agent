try:
    import fastapi
    import uvicorn
    import sqlalchemy
    import aiosqlite
    import langgraph
    import langchain
    import langchain_groq
    import duckduckgo_search
    import playwright
    print("ALL BACKEND DEPS INSTALLED SUCCESSFULLY!")
except Exception as e:
    print("MISSING DEP:", e)
