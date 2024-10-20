package org.gpt.webapp.web.controllers;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.gpt.webapp.core.facades.ChatFacade;
import org.gpt.webapp.persistence.entities.Chat;
import org.gpt.webapp.persistence.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/chat")
public class ChatController {

	private static final String LOGGED_IN_USER_ATTR = "loggedInUser";
	
	@Autowired
	private ChatFacade chatFacade;
	
	@PostMapping("/create")
	public Map <String, Object>createChat(HttpSession session) {
		User user = ((User) session.getAttribute(LOGGED_IN_USER_ATTR));
		Chat chat = new Chat();
		chat.setUser(user);
		chat.setTitle("Chat " + (chatFacade.countChatsByUser(user) + 1));
		chat.setModel("gpt-3.5-turbo");
		chatFacade.saveChat(chat);
		Map<String, Object> response = new HashMap<>();
	    response.put("id", chat.getId());
	    response.put("title", chat.getTitle());

	    return response;
	}
	
	@GetMapping("/list")
	public Map <Long,String> getChats(HttpSession session) {
		return chatFacade
				.getChatsByUserId(((User) session.getAttribute(LOGGED_IN_USER_ATTR)).getId())
				.stream().collect(Collectors.toMap(Chat::getId, Chat::getTitle));
	}
	
	@PutMapping("/title")
	public void setTitle(@RequestParam String title,@RequestParam String chatId) {
		Chat chat = chatFacade.getChatById(Long.parseLong(chatId));
		chat.setTitle(title);
		chatFacade.saveChat(chat);
	}
	
	@PutMapping("/model")
	public void setModel(@RequestParam String chatId,@RequestParam String model) {
		Chat chat = chatFacade.getChatById(Long.parseLong(chatId));
		chat.setModel(model);
		chatFacade.saveChat(chat);
	}
	
	@DeleteMapping("/delete")
	public void deleteChat(@RequestParam String id) {
		chatFacade.deleteById(Long.parseLong(id));
	}
}
