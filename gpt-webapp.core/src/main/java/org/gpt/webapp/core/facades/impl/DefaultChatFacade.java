package org.gpt.webapp.core.facades.impl;

import java.util.List;

import org.gpt.webapp.core.facades.ChatFacade;
import org.gpt.webapp.persistence.entities.Chat;
import org.gpt.webapp.persistence.entities.User;
import org.gpt.webapp.persistence.repositories.ChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DefaultChatFacade implements ChatFacade{

	@Autowired
	private ChatRepository chatRepository;
	
	@Override
	public void saveChat(Chat chat) {
		chatRepository.save(chat);
	}

	@Override
	public List<Chat> getChatsByUserId(Long userId) {
		return (chatRepository.findByUserId(userId)).get();
	}

	@Override
	public Chat getChatById(Long chatId) {
		return (chatRepository.findById(chatId)).get();
	}

	@Override
	public long countChatsByUser(User user) {
		return chatRepository.countByUser(user);
	}
}