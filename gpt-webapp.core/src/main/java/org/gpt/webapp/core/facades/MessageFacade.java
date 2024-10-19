package org.gpt.webapp.core.facades;

import java.util.List;

import org.gpt.webapp.persistence.entities.Message;

public interface MessageFacade {
	void saveMessage(Message message);
	List<Message> getMessagesByChatId(Long chatId);
}
