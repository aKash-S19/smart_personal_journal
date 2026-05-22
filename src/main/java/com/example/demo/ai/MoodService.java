package com.example.demo.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class MoodService {

    @Value("${groq.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String detectMood(String text, String modelName) {
        if (text == null || text.trim().isEmpty()) {
            return "Neutral";
        }

        String escapedText = text.replace("\"", "\\\"");

        String requestBody = """
        {
          "messages": [
            {
              "role": "user",
              "content": "Analyze the mood of this text and reply with only one word: %s"
            }
          ],
          "model": "%s",
          "temperature": 0.5,
          "max_completion_tokens": 10
        }
        """.formatted(escapedText, modelName);

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey);

            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                    "https://api.groq.com/openai/v1/chat/completions",
                    entity,
                    String.class
            );

            String body = response.getBody();
            if (body == null) return "Unknown";

            // Safe String-based extraction targeting the content field wrapper
            String targetToken = "\"content\":\"";
            int startIndex = body.indexOf(targetToken);
            
            if (startIndex == -1) {
                return "Unknown";
            }
            
            startIndex += targetToken.length();
            int endIndex = body.indexOf("\"", startIndex);
            
            if (endIndex == -1) {
                return "Unknown";
            }

            String mood = body.substring(startIndex, endIndex).trim();
            return mood.replaceAll("[^a-zA-Z]", "");

        } catch (Exception e) {
            System.err.println("AI Mood Detection failed: " + e.getMessage());
            return "Unknown";
        }
    }
}