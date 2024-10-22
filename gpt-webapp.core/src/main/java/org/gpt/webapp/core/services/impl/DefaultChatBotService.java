package org.gpt.webapp.core.services.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.gpt.webapp.core.services.ChatBotService;
import org.gpt.webapp.persistence.entities.Message;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class DefaultChatBotService implements ChatBotService{

	private final WebClient webClient;
	
	public DefaultChatBotService(WebClient webClient) {
		this.webClient = webClient;
	}
	
	@Override
	public String sendPrompt(List<Message> messages, String model, String token) {
		List<Map<String, String>> allMessages = new ArrayList<>();

        // Recorremos los mensajes y creamos un mapa para cada uno
        for (Message message : messages) {
            Map<String, String> messageMap = new HashMap<>();
            messageMap.put("role", message.getRole());
            messageMap.put("content", message.getContent());
            allMessages.add(messageMap);
        }

        // Creamos el cuerpo de la solicitud con modelo y mensajes
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);
        requestBody.put("messages", allMessages);

        // Enviamos la solicitud a la API de OpenAI
        return webClient.post()
                .uri("https://api.openai.com/v1/chat/completions")
                .header("Authorization", "Bearer " + token)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)  // Spring WebClient convierte el mapa a JSON automáticamente
                .retrieve()
                .bodyToMono(String.class)
                .block();
	}

}
