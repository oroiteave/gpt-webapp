package org.gpt.webapp.core.utils;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Mono;

@Component
public class ApiUtil {

	private final WebClient webClient;

    public ApiUtil(WebClient webClient) {
        this.webClient = WebClient.builder()
                .baseUrl("https://api.openai.com/v1")
                .build();
    }

    public String sentPostRequest(String jsonBody,String token) {
    	
    	Mono<String> response = webClient.post()
                .uri("/chat/completions")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(jsonBody)
                .retrieve()
                .onStatus(status -> status.is4xxClientError(), clientResponse -> {
                    return Mono.error(new RuntimeException("4xx error occurred"));
                })
                .onStatus(status -> status.is5xxServerError(), clientResponse -> {
                    return Mono.error(new RuntimeException("5xx error occurred"));
                })
                .bodyToMono(String.class);

            return response.block();
    }
}