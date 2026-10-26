
import os

from huggingface_hub import InferenceClient
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status


class ChatbotView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        question = request.data.get("question", "").strip()

        if not question:
            return Response(
                {"error": "Please enter a question."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        token = os.getenv("HF_TOKEN")

        if not token:
            print("HUGGING FACE ERROR: HF_TOKEN is missing.")
            return Response(
                {"error": "AI service is not configured."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        try:
            client = InferenceClient(
                provider="auto",
                api_key=token,
            )

            response = client.chat_completion(
                model="Qwen/Qwen2.5-7B-Instruct",
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are a helpful Law and Policy assistant. "
                            "Provide clear, general legal information. "
                            "Ask for the relevant country or jurisdiction "
                            "when necessary. Do not claim to be a lawyer. "
                            "Explain that answers are informational and "
                            "should be verified with an appropriate "
                            "legal professional or official source."
                        ),
                    },
                    {
                        "role": "user",
                        "content": question,
                    },
                ],
                max_tokens=500,
            )

            answer = response.choices[0].message.content

            if not answer:
                print("HUGGING FACE ERROR: The model returned an empty answer.")
                return Response(
                    {"error": "The AI returned an empty answer. Please try again."},
                    status=status.HTTP_502_BAD_GATEWAY,
                )

            return Response({"answer": answer})

        except Exception as e:
            print("HUGGING FACE ERROR:", repr(e))

            return Response(
                {
                    "error": (
                        "The AI service could not answer right now. "
                        "Please try again later."
                    )
                },
                status=status.HTTP_502_BAD_GATEWAY,
            )
