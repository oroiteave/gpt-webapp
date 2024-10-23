package org.gpt.webapp.web.controllers;

import java.util.List;

import org.gpt.webapp.core.facades.ChatFacade;
import org.gpt.webapp.core.facades.MessageFacade;
import org.gpt.webapp.core.services.ChatBotService;
import org.gpt.webapp.persistence.entities.Chat;
import org.gpt.webapp.persistence.entities.Message;
import org.gpt.webapp.persistence.entities.User;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/messages")
public class MessagesController {
	
	private static final String LOGGED_IN_USER_ATTR = "loggedInUser";
	
	@Autowired
	private MessageFacade messageFacade;
	
	@Autowired
	private ChatBotService chatBotService;
	
	@Autowired
	private ChatFacade chatFacade;
	
	@PostMapping("/sendPrompt")
	public ResponseEntity<String> sendMessage(@RequestParam String message, @RequestParam String chatId, HttpSession session) throws JSONException {
		Chat chat = chatFacade.getChatById(Long.parseLong(chatId));
		User user = ((User) session.getAttribute(LOGGED_IN_USER_ATTR));
		
		Message newMessage = new Message();
		newMessage.setContent(message);
		newMessage.setChat(chat);
		newMessage.setRole("user");
		
		List<Message> messages = chat.getMessages();
		messages.add(newMessage);
		
		String response = chatBotService.sendPrompt(messages,chat.getModel(),user.getToken());
		
		if(response==null) {
			return ResponseEntity.ok(null);
		}
		
		JSONObject obj = new JSONObject(response);
	 	JSONObject objMessage = obj.getJSONArray("choices").getJSONObject(0).getJSONObject("message");
	 	String choiceResponse = objMessage.getString("content");
		
		Message gptMsg = new Message();
		gptMsg.setContent(choiceResponse);
		gptMsg.setChat(chat);
		gptMsg.setRole("assistant");
		
		messageFacade.saveMessage(newMessage);
		messageFacade.saveMessage(gptMsg);
		
		
		return ResponseEntity.ok(choiceResponse);
	}
	
	@PostMapping("/test")
	public String testBotMessage() {
		return "hola mundo";
	}
	
	@GetMapping("/{chatId}/getMessages")
	public ResponseEntity<List<Message>> getMessagesByChatId(@PathVariable Long chatId){
		return ResponseEntity.ok(messageFacade.getMessagesByChatId(chatId));
	}
	
}
