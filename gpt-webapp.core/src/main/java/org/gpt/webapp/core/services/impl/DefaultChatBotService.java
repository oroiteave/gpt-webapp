package org.gpt.webapp.core.services.impl;

import java.util.ArrayList;
import java.util.List;

import org.gpt.webapp.core.services.ChatBotService;
import org.gpt.webapp.persistence.entities.Message;
import org.springframework.beans.factory.annotation.Value;
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
		List<String> allMessages = new ArrayList<>();
		String requestBodyMessages= "";
		
		for(int i=0;i<messages.size();i++) {
			requestBodyMessages += (i==0) ? "":",";
			requestBodyMessages += "{\"role\": \""+messages.get(i).getRole()+"\", \"content\": \"" + messages.get(i).getContent() + "\"}";
		}
		allMessages.add(requestBodyMessages);
		
		String requestBody = "{"
                + "\"model\": \"" + model + "\","
                + "\"messages\": [" + requestBodyMessages + "]"
                + "}";
		
		return webClient.post()
                .uri("https://api.openai.com/v1/chat/completions")
                .header("Authorization", "Bearer " + token)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();
	}

}
