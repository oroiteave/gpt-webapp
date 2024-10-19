package org.gpt.webapp.core.services;

import java.util.List;

import org.gpt.webapp.persistence.entities.Message;

public interface ChatBotService {
	String sendPrompt(List<Message> message,String model);
}
