import os
import gradio as gr
from google.generativeai import Client  # Import Client directly

# Set your API key
API_KEY = "AIzaSyDfRb1ViZIeLclVo3j_iDOo5VUZin61wFw"  # Replace with your API key

# Create the Gemini client
client = Client(api_key=API_KEY) 
# Define custom CSS for an attractive UI
custom_css = """
.contain {
    max-width: 980px !important;
    margin: auto;
    padding-top: 1.5rem;
}
.chat-window {
    height: 600px !important;
    overflow-y: auto;
    border-radius: 15px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
.header {
    text-align: center;
    margin-bottom: 20px;
}
.header h1 {
    color: #2C3E50;
    font-size: 2.5rem;
    font-weight: 700;
}
.header p {
    color: #7F8C8D;
    font-size: 1.1rem;
}
.message-bot {
    background-color: #e3f2fd !important;
    border-radius: 10px !important;
    padding: 12px 16px !important;
    margin-bottom: 8px !important;
}
.message-user {
    background-color: #f1f8e9 !important;
    border-radius: 10px !important;
    padding: 12px 16px !important;
    margin-bottom: 8px !important;
}
.input-container {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    padding: 8px;
}
"""

# Initialize conversation history
def initialize_conversation():
    return []

# Function to handle chat with Gemini
def chat_with_gemini(message, history):
    # Format history for Gemini
    messages = []
    for user_msg, bot_msg in history:
        messages.append({"role": "user", "parts": [user_msg]})
        if bot_msg:
            messages.append({"role": "model", "parts": [bot_msg]})
    
    # Add the current message from the user
    messages.append({"role": "user", "parts": [message]})
    
    # Get response from Gemini with streaming
    chat = client.generate_content(
        model="gemini-2.0-flash",
        contents=messages,
        generation_config={"temperature": 0.7, "max_output_tokens": 1024},
        stream=True
    )
    
    # Stream the response
    response_text = ""
    for chunk in chat:
        if hasattr(chunk, 'parts') and chunk.parts:
            text_chunk = chunk.parts[0].text
            response_text += text_chunk
            yield response_text

# Create the Gradio interface
with gr.Blocks(css=custom_css, theme=gr.themes.Soft()) as demo:
    with gr.Column(elem_classes=["contain"]):
        # Header section
        with gr.Row(elem_classes=["header"]):
            gr.Markdown("# 🤖 AI Assistant")
            gr.Markdown("Ask me anything and get intelligent, helpful responses.")
        
        # Chat interface
        chatbot = gr.ChatInterface(
            fn=chat_with_gemini,
            chatbot=gr.Chatbot(
                height=550,
                avatar_images=(
                    "https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=You",
                    "https://ui-avatars.com/api/?background=7F49CA&color=fff&name=AI"
                ),
                bubble_full_width=False,
                show_copy_button=True,
                elem_classes=["chat-window"],
                render=True,
                likeable=True,
            ),
            clear_btn="New Chat",
            retry_btn="Retry",
            undo_btn="Undo",
            submit_btn="Send",
            textbox=gr.Textbox(
                placeholder="Type your message here...",
                lines=2,
                max_lines=10,
                show_label=False,
                elem_classes=["input-container"]
            ),
            examples=[
                "Explain quantum computing in simple terms",
                "Write a short story about a robot learning to feel emotions",
                "What are the top technologies to learn in 2025?",
                "Give me a 7-day workout plan for beginners"
            ],
            title="Chat with AI Assistant",
            description="A powerful AI assistant powered by Google Gemini",
        )

# Launch the application
if __name__ == "__main__":
    demo.launch(share=True)