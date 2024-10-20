package org.gpt.webapp.core.facades;

import java.util.List;

import org.gpt.webapp.persistence.entities.Chat;
import org.gpt.webapp.persistence.entities.User;

public interface ChatFacade {
	void saveChat(Chat chat);
	List<Chat> getChatsByUserId(Long userId);
	Chat getChatById(Long chatId);
	long countChatsByUser(User user);
	void deleteById(Long chatId);
}
