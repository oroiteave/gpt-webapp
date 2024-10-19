package org.gpt.webapp.core.facades.impl;

import java.util.List;

import org.gpt.webapp.core.facades.MessageFacade;
import org.gpt.webapp.persistence.entities.Message;
import org.gpt.webapp.persistence.repositories.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DefaultMessageFacade implements MessageFacade{

	@Autowired
	private MessageRepository messageRepository;
	
	@Override
	public void saveMessage(Message message) {
		messageRepository.save(message);
	}

	@Override
	public List<Message> getMessagesByChatId(Long chatId) {
		return (messageRepository.findByChatId(chatId)).get();
	}
}